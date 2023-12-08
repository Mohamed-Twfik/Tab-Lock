import cv2
import numpy as np
from keras.models import load_model
from mtcnn.mtcnn import MTCNN

# Load the trained model
model = load_model('classification_model_inceptionv3_with_smote.h5')

def preprocess_image(image_path):
    # Load the image
    img = cv2.imread(image_path)

    # Apply face extraction using MTCNN
    detector = MTCNN()
    faces = detector.detect_faces(img)

    if not faces:
        print("No face found in the image.")
        return None

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

    return preprocessed_image

# Path to your new image
new_image_path = 'no.jpg'

# Preprocess the image
preprocessed_image = preprocess_image(new_image_path)

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
