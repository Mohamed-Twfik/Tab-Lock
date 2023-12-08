from mtcnn.mtcnn import MTCNN
import cv2
import os

def extract_faces_with_mtcnn_from_video(input_video_path, output_folder, target_fps=10):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Initialize MTCNN model
    detector = MTCNN()

    # Open the video file
    cap = cv2.VideoCapture(input_video_path)

    # Set the desired frames per second (fps)
    cap.set(cv2.CAP_PROP_FPS, target_fps)

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
            face_filename = os.path.join(output_folder, f"frame_{int(cap.get(cv2.CAP_PROP_POS_FRAMES))}_face_{i + 1}.jpg")
            cv2.imwrite(face_filename, face_denoised)

    # Release the video capture object
    cap.release()

    print("Face extraction and processing from video completed.")

# Example usage with video
input_video_path = "path/to/your/input/video.mp4"
output_folder = "path/to/your/output/folder"
target_fps = 10  # Set the desired frames per second
extract_faces_with_mtcnn_from_video(input_video_path, output_folder, target_fps)
