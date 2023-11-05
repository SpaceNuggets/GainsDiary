const {Schema, model} = require('mongoose');

const { MongoClient } = require('mongodb');
const uri = process.env.URI


const exerciseSchema = new Schema({
  exercise_id: {
    type: Number,
    required: true,
    unique: true,
  },
  attributeKeys: {
    type: [String],
    default:[]
  },
  user_id: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
  },
  value: {
    type: String,
  },
});

exerciseSchema.statics.create = async function (data) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('savedExercises');
    return await users.insertOne(data)
  } finally {
    await client.close();
  }
};


exerciseSchema.statics.findOne = async function (query) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('savedExercises');
    return await users.findOne(query);
  } finally {
    await client.close();
  }
};

exerciseSchema.statics.updateOne = async function (query, update) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('savedExercises');
    return await users.updateOne(query, update);
  } finally {
    await client.close();
  }
};

exerciseSchema.statics.deleteOne = async function(query){
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('savedExercises');
    return await users.deleteOne(query);
  } finally {
    await client.close();
  }
};

const ExerciseModel = model('ExerciseModel', exerciseSchema);

module.exports = {
  ExerciseModel,
};