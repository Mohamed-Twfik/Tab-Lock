from tensorflow.keras import layers, Model, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import SparseCategoricalCrossentropy
from tensorflow.keras.preprocessing.image import ImageDataGenerator

import tensorflow as tf

def arcface_loss(y_true, y_pred, margin=0.5, scale=64):
    y_pred = tf.nn.l2_normalize(y_pred, axis=1)
    
    # Cast y_true to int32
    labels = tf.cast(y_true, dtype=tf.int32)
    labels = tf.one_hot(labels, depth=tf.shape(y_pred)[1])
    
    # Adjust labels to have shape (None,)
    labels = tf.argmax(labels, axis=1)
    
    # Cast both y_pred and labels to float32
    y_pred = tf.cast(y_pred, dtype=tf.float32)
    labels = tf.cast(labels, dtype=tf.float32)
    
    cos_similarity = tf.reduce_sum(y_pred * labels, axis=1)
    theta = tf.acos(tf.clip_by_value(cos_similarity, -1.0 + 1e-7, 1.0 - 1e-7))
    
    # Use binary cross-entropy for binary classification
    arcface_loss = tf.reduce_mean(tf.nn.sigmoid_cross_entropy_with_logits(labels=labels, logits=scale * tf.cos(theta + margin)))
    return arcface_loss

def build_arcface_model(input_shape):
    base_model = tf.keras.applications.MobileNetV2(input_shape=input_shape, include_top=False, weights='imagenet')
    base_model.trainable = False

    x = base_model.output
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(512, activation='relu')(x)
    x = layers.Dropout(0.5)(x)

    # Output layer for binary classification with sigmoid activation
    output_layer = layers.Dense(1, activation='sigmoid')(x)

    model = Model(inputs=base_model.input, outputs=output_layer)
    model.compile(optimizer=Adam(), loss='binary_crossentropy', metrics=['accuracy'])
    return model


# Set your dataset paths
train_path = 'train_dataset'
val_path = 'validation_dataset'

# Set batch size, image size, etc.
batch_size = 32
image_size = (224, 224)

# Data augmentation and preprocessing for training
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Data preprocessing for validation (no augmentation)
val_datagen = ImageDataGenerator(rescale=1./255)

# Create data generators for binary classification
train_generator = train_datagen.flow_from_directory(
    train_path,
    target_size=image_size,
    batch_size=batch_size,
    class_mode='binary',  # Binary classification
    shuffle=True
)

val_generator = val_datagen.flow_from_directory(
    val_path,
    target_size=image_size,
    batch_size=batch_size,
    class_mode='binary',  # Binary classification
    shuffle=False
)

# Build and compile the model
arcface_model = build_arcface_model((image_size[0], image_size[1], 3))

# Train the model
num_epochs = 10
arcface_model.fit(train_generator, epochs=num_epochs, validation_data=val_generator)

# Save the trained model
arcface_model.save('arcface_model.h5')
