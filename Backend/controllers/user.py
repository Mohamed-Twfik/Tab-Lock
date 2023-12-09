from flask import request, jsonify, copy_current_request_context
import jwt
from models.user import User
from flask import current_app
import os
from datetime import datetime
from models.AI import train, preprocessing, test
import shutil
import asyncio
import threading

# Allowed file extensions
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm'}
ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif'}

def allowed_video(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS

def allowed_image(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS


def background_model_training(user_dir, videopath, NOT_YOU_DIR):
  # model training
  output_dir = os.path.join(user_dir, "Data", "You")
  preprocessing(videopath, output_dir)
  # Copy the entire folder and its contents
  not_you_path = os.path.join(user_dir, "Data", "Not You")
  shutil.copytree(NOT_YOU_DIR, not_you_path)
  # training
  train(user_dir)
  os.remove(videopath)
  shutil.rmtree(os.path.join(user_dir, "Data"))

def register():
  try:
    UPLOADER_DIR = current_app.config['UPLOAD_FOLDER']
    AI_DIR = os.path.join(UPLOADER_DIR, "AIFolder")
    NOT_YOU_DIR = os.path.join(AI_DIR, "Not You")

    if 'video' not in request.files or 'name' not in request.form or 'email' not in request.form:
      return jsonify({"message": "Incomplete request"}), 403
    
    data = request.form.to_dict()
    video = request.files['video']
    
    if video.filename == '':
      return jsonify({"message": "No selected file"}), 400

    if not (video and allowed_video(video.filename)):
      return jsonify({"message": "Invalid file"}), 400

    now = datetime.now()
    timestamp = now.timestamp()
    milliseconds = round(timestamp * 1000)
    user_dir_name = "folder-" + str(milliseconds)
    user_dir = os.path.join(AI_DIR, user_dir_name)
    os.makedirs(user_dir, exist_ok=True)
    videoname = "video.mp4"
    videopath = os.path.join(user_dir, videoname)
    video.save(videopath)
    data['model'] = user_dir

    # Run the model training in the background
    threading.Thread(target=background_model_training, args=(user_dir, videopath, NOT_YOU_DIR)).start()

    new_user = User(name=data['name'], email=data['email'], password=data['password'], model=data['model'])
    _id = new_user.save().inserted_id

    return jsonify({
      "message": "Success..!",
      "user_id": str(_id)
    }), 200
  except ValueError as e:
    return jsonify({"message": str(e)}), 400

def login():
  try:
    if 'email' not in request.json or 'password' not in request.json:
      return jsonify({"message": "Incomplete request"}), 403
    data = request.json
    user = User.get_by_email(email = data['email'])
    if user and user['password'] == data['password']:
      user_id = str(user['_id'])
      encoded = jwt.encode({"user_id": user_id}, current_app.config["SECRET_KEY"])
      return jsonify({
        "message": "Success..!",
        "user_id": user_id,
        "token": encoded
      }), 200
    else:
      return jsonify({"message": "Invalid credentials"}), 401
  except Exception as e:
    return jsonify({"message": str(e)}), 500

def update_user(current_user, user_id):
  try:
    UPLOADER_DIR = current_app.config['UPLOAD_FOLDER']
    AI_DIR = os.path.join(UPLOADER_DIR, "AIFolder")
    NOT_YOU_DIR = os.path.join(AI_DIR, "Not You")
    user_dir = current_user['model']

    if 'video' not in request.files and 'name' not in request.form and 'email' not in request.form:
      return jsonify({"message": "Incomplete request"}), 403

    name = None
    email = None
    if 'name' in request.form:
      name = request.form['name']
    if 'email' in request.form:
      email = request.form['email']
    videopath = None

    video = request.files['video']
    if video:
      if video.filename == '':
        return jsonify({"message": "No selected file"}), 400

      if not (video and allowed_video(video.filename)):
        return jsonify({"message": "Invalid file"}), 400

      videoname = "video.mp4"
      videopath = os.path.join(user_dir, videoname)
      video.save(videopath)
      
      # Run the model training in the background
      threading.Thread(target=background_model_training, args=(user_dir, videopath, NOT_YOU_DIR)).start()
    
    name = name or current_user['name']
    email = email or current_user['email']
    User.update(user_id, {'name': name, 'email': email})

    return jsonify({"message": "Success..!"}), 200

  except Exception as e:
    return jsonify({"message": str(e)}), 500

def delete_user(current_user, user_id):
  try:
    User.delete(user_id)
    # shutil.rmtree(current_user['model'])
    return jsonify({"message": "Success..!"}), 200
  except Exception as e:
    return jsonify({"message": str(e)}), 500

def testImage(current_user):
  user_dir = current_user['model']

  # Check if the post request has the file and other data parts
  if 'image' not in request.files:
    return jsonify({"message": "Incomplete request"}), 403
  image = request.files['image']
  # Check if the file is empty
  if image.filename == '':
    return jsonify({"message": "No selected file"}), 400
  
  # Check if the file has an allowed extension
  if not (image and allowed_image(image.filename)):
    return jsonify({"message": "Invalid file"}), 400

  # save the file
  imagename = "image.jpg"
  imagepath = os.path.join(user_dir, imagename)
  image.save(imagepath)

  # test process
  allowed = test(user_dir)

  os.remove(imagepath)
  if allowed=="noface":
    return jsonify({"message": "No face found..! Please upload new image.",}), 403
  if allowed is None:
    return jsonify({"message": "test process error..!"}), 500

  return jsonify({
    "message": "Success..!",
    "result": allowed
  }), 200

def add_url(current_user, user_id):
  try:
    url = request.json['url']
    if url:
      if url not in current_user['urls']:
        User.add_url(user_id, url)
        return jsonify({"message": "Success..!"}), 200
      else:
        return jsonify({"message": "the URL is already added..!"}), 400
    else:
      return jsonify({"message": "Incomplete request"}), 403
  except Exception as e:
    return jsonify({"message": str(e)}), 500

def delete_url(current_user, user_id):
  try:
    url = request.json['url']
    if url:
      if url in current_user['urls']:
        User.delete_url(user_id, url)
        return jsonify({"message": "Success..!"}), 200
      else:
        return jsonify({"message": "the URL not exist..!"}), 400
      
    else:
      return jsonify({"message": "Incomplete request"}), 403
  except Exception as e:
    return jsonify({"message": str(e)}), 500
