import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np

# Load the saved model
model_path = 'arcface_model.h5'  # Change this to the path where your model is saved
loaded_model = tf.keras.models.load_model(model_path)

# Load an image for testing
image_path = '3.jpg'  # Change this to the path of your test image
img = image.load_img(image_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array /= 255.0  # Normalize the image

# Make a prediction
predictions = loaded_model.predict(img_array)

# Print the prediction results
print(predictions)
