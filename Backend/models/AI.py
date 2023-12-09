import cv2
import os
import numpy as np
from mtcnn.mtcnn import MTCNN

THRESHOLD = .6
TARGET_FPS = 10
EPOCH = 1

def preprocessing(input_video, output_dir):
  # Create the output folder if it doesn't exist
  if not os.path.exists(output_dir):
    os.makedirs(output_dir)

  # Initialize MTCNN model
  detector = MTCNN()

  # Open the video file
  cap = cv2.VideoCapture(input_video)

  # Set the desired frames per second (fps)
  cap.set(cv2.CAP_PROP_FPS, TARGET_FPS)

  while True:
    # Read a frame from the video
    ret, frame = cap.read()

    # Break the loop if the video has ended
    if not ret:
      break

    # Detect faces in the frame
    faces = detector.detect_faces(frame)

    # Process and save each detected face
    for i, face_info in enumerate(faces):
      x, y, w, h = face_info['box']
      face = frame[y:y+h, x:x+w]

      # Convert to grayscale
      face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)

      # Perform histogram equalization
      face_equalized = cv2.equalizeHist(face_gray)

      # Remove noise (e.g., using GaussianBlur)
      face_denoised = cv2.GaussianBlur(face_equalized, (5, 5), 0)

      # Save the processed face
      face_filename = os.path.join(output_dir, f"frame_{int(cap.get(cv2.CAP_PROP_POS_FRAMES))}_face_{i + 1}.jpg")
      cv2.imwrite(face_filename, face_denoised)

  # Release the video capture object
  cap.release()

  print("Face extraction and processing from video completed.")

# ------------------------------------------------------------------------

def train(user_dir):
  from keras.preprocessing.image import ImageDataGenerator
  from keras.applications.vgg16 import VGG16
  from keras import layers
  from keras import models
  from keras import optimizers
  from imblearn.over_sampling import SMOTE
  from sklearn.model_selection import train_test_split

  # Set the paths to your data
  # data_dir = 'Data'
  data_dir = os.path.join(user_dir, "Data")

  # Parameters
  img_width, img_height = 224, 224
  batch_size = 32

  # Load the VGG16 model pre-trained on ImageNet data
  base_model = VGG16(weights='imagenet', include_top=False, input_shape=(img_width, img_height, 3))

  # Freeze the convolutional layers
  for layer in base_model.layers:
    layer.trainable = False

  # Create a custom model for classification on top of the VGG16 base
  model = models.Sequential()
  model.add(base_model)
  model.add(layers.Flatten())
  model.add(layers.Dense(256, activation='relu'))
  model.add(layers.Dropout(0.5))
  model.add(layers.Dense(1, activation='sigmoid'))  # Binary classification (you or not you)

  # Compile the model
  model.compile(optimizer=optimizers.Adam(lr=1e-4), loss='binary_crossentropy', metrics=['accuracy'])

  # Data augmentation for the entire dataset
  data_datagen = ImageDataGenerator(
    rescale=1./255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
  )

  # Generator for loading and augmenting the entire dataset
  data_generator = data_datagen.flow_from_directory(
    data_dir,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='binary',
    shuffle=False  # Important: set shuffle to False to preserve the order of samples for splitting
  )

  # Get labels and filenames
  labels = data_generator.classes
  filenames = data_generator.filenames

  # Identify the minority class
  minority_class = min(set(labels.tolist()), key=labels.tolist().count)

  # Split the dataset into training and validation sets while preserving class balance
  X_train, X_val, y_train, y_val = train_test_split(
    filenames,
    labels,
    test_size=0.2,
    random_state=42,
    stratify=labels,
    shuffle=True
  )

  # Load and augment images for the training set
  X_train_images = [cv2.imread(os.path.join(data_dir, filename)) for filename in X_train]
  X_train_images = np.array([cv2.resize(img, (img_width, img_height)) for img in X_train_images])

  # Apply SMOTE to the training set
  smote = SMOTE(sampling_strategy='auto', random_state=42)
  X_train_flattened, y_train_resampled = smote.fit_resample(X_train_images.reshape((-1, img_width * img_height * 3)), y_train)

  # Reshape the data back to the original shape
  X_train_resampled = X_train_flattened.reshape((-1, img_width, img_height, 3))

  # Train the model with SMOTE-resampled data using Keras generators
  train_datagen = ImageDataGenerator(
    rescale=1./255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
  )

  train_generator = train_datagen.flow(X_train_resampled, y_train_resampled, batch_size=batch_size)

  # Use validation generator
  validation_datagen = ImageDataGenerator(rescale=1./255)

  validation_generator = validation_datagen.flow_from_directory(
    data_dir,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='binary',
    subset='validation'  # Use validation subset
  )

  # Train the model with Keras generators
  model.fit(
    train_generator,
    steps_per_epoch=len(X_train_resampled) // batch_size,
    epochs=EPOCH,
    validation_data=validation_generator,
    validation_steps=len(X_val) // batch_size
  )

  # save the model
  modelname = "model.h5"
  modelpath = os.path.join(user_dir, modelname)
  model.save(modelpath)

# ------------------------------------------------------------------------

def test(user_dir):
  from keras.models import load_model

  model_path = os.path.join(user_dir, "model.h5")
  image_path = os.path.join(user_dir, "image.jpg")
  # Load the trained model
  model = load_model(model_path)
  
  # Load the image
  img = cv2.imread(image_path)

  # Apply face extraction using MTCNN
  detector = MTCNN()
  faces = detector.detect_faces(img)

  if not faces:
    print("No face found in the image.")
    return "noface"

  # Assuming the first face is the main face
  x, y, w, h = faces[0]['box']
  face = img[y:y+h, x:x+w]

  # Convert the face to grayscale
  gray_face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)

  # Apply histogram equalization
  equalized_face = cv2.equalizeHist(gray_face)

  # Remove noise using Gaussian blur
  blurred_face = cv2.GaussianBlur(equalized_face, (5, 5), 0)

  # Resize the image to the required input size for the model
  resized_face = cv2.resize(blurred_face, (224, 224))

  # Convert the image to 3 channels (RGB)
  rgb_face = cv2.cvtColor(resized_face, cv2.COLOR_GRAY2RGB)

  # Expand dimensions to match the model input shape
  preprocessed_image = np.expand_dims(rgb_face, axis=0)  # Add batch dimension
  preprocessed_image = preprocessed_image / 255.0  # Normalize pixel values

  if preprocessed_image is not None:
    # Make predictions
    predictions = model.predict(preprocessed_image)

    # Interpret the predictions
    class_labels = ['You', 'Not You']  # Assuming 'Not You' is class 0 and 'You' is class 1
    predicted_class = np.argmax(predictions)
    confidence = predictions[0][predicted_class]

    # Print the result
    print(f"Predicted class: {class_labels[predicted_class]}")
    print(f"Confidence: {confidence:.4f}")
    if confidence < THRESHOLD:
      return False
    else:
      return True
  return None
