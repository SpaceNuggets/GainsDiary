const {Schema, model} = require('mongoose');

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt')
const uri = process.env.URI


const userSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    default: "",
  },
});

userSchema.statics.create = async function (data) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    return await users.insertOne(data)
  } finally {
    await client.close();
  }
};


userSchema.statics.findOne = async function (query) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    return await users.findOne(query);
  } finally {
    await client.close();
  }
};

userSchema.statics.updateOne = async function (query, update) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    return await users.updateOne(query, update);
  } finally {
    await client.close();
  }
};

userSchema.statics.deleteOne = async function(query){
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    return await users.deleteOne(query);
  } finally {
    await client.close();
  }
};

const UserModel = model('UserModel', userSchema);

module.exports = {
  UserModel,
};