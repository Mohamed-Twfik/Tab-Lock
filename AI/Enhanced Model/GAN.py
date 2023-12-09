import os
import numpy as np
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Set your own data directory
data_dir = "/path/to/your/data"

# Create an ImageDataGenerator
data_generator = ImageDataGenerator(rescale=1./255)
data_flow = data_generator.flow_from_directory(
    data_dir,
    target_size=(28, 28),  # Adjust the target size as needed
    batch_size=64,
    class_mode=None,  # This is for generating only, not class labels
    color_mode="grayscale"  # Use "rgb" if your images are in color
)

# Generator model
generator = keras.Sequential([
    layers.InputLayer(input_shape=(100,)),
    layers.Dense(7 * 7 * 128),
    layers.Reshape((7, 7, 128)),
    layers.Conv2DTranspose(128, (4, 4), strides=(2, 2), padding="same"),
    layers.Conv2DTranspose(64, (4, 4), strides=(2, 2), padding="same"),
    layers.Conv2DTranspose(1, (4, 4), strides=(1, 1), padding="same", activation="sigmoid"),
])

# Discriminator model
discriminator = keras.Sequential([
    layers.InputLayer(input_shape=(28, 28, 1)),
    layers.Conv2D(64, (4, 4), strides=(2, 2), padding="same", activation="relu"),
    layers.Conv2D(128, (4, 4), strides=(2, 2), padding="same", activation="relu"),
    layers.Flatten(),
    layers.Dense(1, activation="sigmoid"),
])

# Combined model (GAN)
discriminator.trainable = False
gan_input = keras.Input(shape=(100,))
x = generator(gan_input)
gan_output = discriminator(x)
gan = keras.Model(gan_input, gan_output)

# Compile models
discriminator.compile(optimizer=keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5), loss="binary_crossentropy", metrics=["accuracy"])
gan.compile(optimizer=keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5), loss="binary_crossentropy")

# Training loop
epochs = 10000
batch_size = 64
save_interval = 500  # Save generated images every 500 epochs
output_dir = "generated_images"

for epoch in range(epochs):
    # Load and preprocess real images from the data generator
    real_images = data_flow.next()
    real_images = real_images.reshape((batch_size, 28, 28, 1))

    # ... (rest of the training code)

    # Save generated images at specific intervals
    if epoch % save_interval == 0:
        noise = np.random.normal(0, 1, (16, 100))
        generated_images = generator.predict(noise)
        generated_images = 0.5 * generated_images + 0.5  # Rescale images

        # Create the output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Save generated images
        for i in range(generated_images.shape[0]):
            image = generated_images[i, :, :, 0]
            image = (image * 255).astype(np.uint8)
            image_path = os.path.join(output_dir, f"generated_image_{epoch}_{i}.png")
            plt.imsave(image_path, image, cmap="gray")

        print(f"Generated images saved at epoch {epoch} in {output_dir}")

