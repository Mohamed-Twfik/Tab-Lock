# TabLock

TabLock is a Chrome extension that protects your privacy by using face recognition as an extra layer of security for any domain you add. It keeps your sensitive data safe if you have shared your PC with someone or if there are some intrusive people in your life.

## Features

- Add any domain name to the TabLock list and enable face recognition for it
- Every time you enter a TabLock domain, you will be prompted to verify your face using your webcam
- If your face matches the one stored in the database, you will have access to the website
- If your face does not match or you decline the verification, you will see an access denied page
- Manage your TabLock domains from the extension popup


## Installation

To install TabLock locally, follow these steps:

- Clone the repository or download the zip file of the project.
- In your terminal `cd Backend`, `touch .env` then add JWT_SECRET and DB_URI with your key in `.env`.
- After that type the following commands `python3 -m venv venv`, `source venv/bin/activate`, `pip install -r requirements.txt` and `python3 app.py` hooray 🎉 the server is running.
- Now You can go extension home page from [🌍](https://tab-lock-utqs.onrender.com/) sign up and add the domains you want to lock.
- Go to the extension directory `cd Extension`, `touch .env` add VITE_APP_PROD_PRODHOST="http://127.0.0.1:5000/" in `.env`.
- After that type the following commands `npm install` and `npm run build`.
- A dist folder will be created go to Google Chrome then type this URL `chrome://extensions/`.
- Enable developer mode and press the Load unpacked button.
- Select the dist folder to be packed.
- Extension has been installed you can press on it and log in to your email to add or remove domains.
- You are good to go try to enter any domain you have already added and it will check your face first before you can access it.

## Technologies

TabLock uses the following technologies for different aspects of the project:

### AI
- GAN: A generative adversarial network that creates realistic face images
- vgg16: A pre-trained model that performs face recognition by comparing the features of the input face and the stored face
- mtcnn: A pre-trained model that performs face extraction by detecting and cropping the face region from the image


### Backend
- Flask: A micro web framework that handles the requests and responses of the extension
- MongoDB: A document-based database that stores the user information and face data
- JWT: A standard for creating and verifying tokens for authentication and authorization
- RESTful API: A style of web service that follows the principles of REST (Representational State Transfer)

### Frontend and Extension
- React: A library for building user interfaces using components
- TypeScript: A superset of JavaScript that adds static type checking and other features
- Tanstack Query: A library for fetching, caching, and updating data in React
- Zustand: A library for managing global state in React
- React Hook Forms: A library for handling forms and validations in React
- Manifest Version 3: A specification for Chrome extensions that defines the structure, permissions, and capabilities of the extension


## Team
- Mohamed Gad: Data Scientist 
- Mohamed Tawfik: Backend Engineer
- Zakaria Loai: Frontend Engineer






