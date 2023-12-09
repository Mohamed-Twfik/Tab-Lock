from flask import Flask
from flask import request, jsonify
from controllers.user import register, login, update_user, delete_user, add_url, delete_url, testImage
from db import init_db
from dotenv import load_dotenv
import os
from authMiddleware import token_required
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
app.config['MONGO_URI'] = os.getenv("DB_URI")
app.config["SECRET_KEY"] = os.getenv("JWT_SECRET")
app.config['UPLOAD_FOLDER'] = 'uploads'

# CORS(app, origins=["https://your-frontend-app.com", "http://localhost:3000"])
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "chrome-extension://hcmgbllnhehbdfmifpjimkebhaaefjfm"}})
init_db(app)

@app.route('/register', methods=['POST'])
def register_route():
    return register()

@app.route('/login', methods=['POST'])
def login_route():
    return login()

@app.route('/<user_id>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
@token_required
def user_routes(current_user, user_id):
    if request.method == 'GET':
        current_user['_id'] = str(current_user['_id'])
        return jsonify({"user": current_user}), 200
    elif request.method == 'POST':
        return add_url(current_user, user_id)
    elif request.method == 'PATCH':
        return update_user(current_user, user_id)
    elif request.method == 'DELETE':
        return delete_user(current_user, user_id)
    elif request.method == 'PUT':
        return delete_url(current_user, user_id)
    else:
        return jsonify({"message": "Method not allowed"+str(request.method)}), 405

@app.route("/test", methods=["POST"])
@token_required
def test(current_user):
    return testImage(current_user)

if __name__ == '__main__':
    app.run(debug=True)
