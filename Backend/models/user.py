from bson.objectid import ObjectId
from db import mongo

class User:
  def __init__(self, name, email, password, model=None):
    self.name = name
    self.email = email
    self.password = password
    self.urls = []
    self.model = model

  def to_dict(self):
    return {
      'name': self.name,
      'email': self.email,
      'password': self.password,
      'urls': self.urls,
      'model': self.model
    }
  
  def save(self):
    existing_user = mongo.db.users.find_one({'email': self.email})
    if existing_user:
      raise ValueError('Email already exists. Choose a different email.')
    return mongo.db.users.insert_one(self.to_dict())
  
  @staticmethod
  def get_by_id(user_id):
    return mongo.db.users.find_one({"_id": ObjectId(user_id)})
  
  @staticmethod
  def update(user_id, data):
    return mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": data})

  @staticmethod
  def delete(user_id):
    return mongo.db.users.delete_one({"_id": ObjectId(user_id)})

  @staticmethod
  def add_url(user_id, url):
    return mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$push": {"urls": url}})

  @staticmethod
  def delete_url(user_id, url):
    return mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$pull": {"urls": url}})
  
  @staticmethod
  def get_by_email(email):
    return mongo.db.users.find_one({"email": email})