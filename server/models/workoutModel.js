const {Schema, model} = require('mongoose');

const { MongoClient } = require('mongodb');
const uri = process.env.URI


const workoutSchema = new Schema({
  workout_id: {
    type: Number,
    required: true,
    unique: true,
  },
  exercises: {
    type: [Object],
    default:[],
    required:true
  },
  user_id: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
  },
  name: {
    type: String,
  },
});

workoutSchema.statics.create = async function (data) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('workouts');
    return await users.insertOne(data)
  } finally {
    await client.close();
  }
};


workoutSchema.statics.findOne = async function (query) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('workouts');
    return await users.findOne(query);
  } finally {
    await client.close();
  }
};

workoutSchema.statics.updateOne = async function (query, update) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('workouts');
    return await users.updateOne(query, update);
  } finally {
    await client.close();
  }
};

workoutSchema.statics.deleteOne = async function(query){
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('workout');
    return await users.deleteOne(query);
  } finally {
    await client.close();
  }
};

const WorkoutModel = model('WorkouteModel', workoutSchema);

module.exports = {
  WorkoutModel,
};