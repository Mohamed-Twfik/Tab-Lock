import os
import cv2
import numpy as np
from keras.preprocessing.image import ImageDataGenerator
from keras.applications.vgg16 import VGG16
from keras import layers
from keras import models
from keras import optimizers
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split

# Set the paths to your data
data_dir = 'Data'

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
    epochs=30,
    validation_data=validation_generator,
    validation_steps=len(X_val) // batch_size
)

# Save the trained model
model.save('classification_model_vgg16_with_smote.h5')
