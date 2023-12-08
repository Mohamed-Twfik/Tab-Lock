from mtcnn.mtcnn import MTCNN
import cv2
import os

def extract_faces_with_mtcnn(input_folder, output_folder):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Initialize MTCNN model
    detector = MTCNN()

    # Iterate through all image files in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith(('.jpg', '.jpeg', '.png', '.gif')):  # Add more extensions if needed
            input_image_path = os.path.join(input_folder, filename)

            # Load the image
            image = cv2.imread(input_image_path)

            if image is None:
                print(f"Unable to read image: {filename}")
                continue

            # Detect faces in the image
            faces = detector.detect_faces(image)

            print(f"Image: {filename}, Detected faces: {len(faces)}")

            # Extract and process each face
            for i, face_info in enumerate(faces):
                x, y, w, h = face_info['box']
                face = image[y:y+h, x:x+w]

                # Convert to grayscale
                face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)

                # Perform histogram equalization
                face_equalized = cv2.equalizeHist(face_gray)

                # Remove noise (e.g., using GaussianBlur)
                face_denoised = cv2.GaussianBlur(face_equalized, (5, 5), 0)

                # Save the processed face
                face_filename = os.path.join(output_folder, f"{os.path.splitext(filename)[0]}_face_{i + 1}.jpg")
                cv2.imwrite(face_filename, face_denoised)

    print("Face extraction and processing completed.")

# Example usage with MTCNN
input_folder = "Data Set/You"
output_folder = "Data/You"
extract_faces_with_mtcnn(input_folder, output_folder)
