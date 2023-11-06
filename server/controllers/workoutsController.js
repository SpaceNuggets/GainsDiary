
const { MongoClient } = require('mongodb');
const uri = process.env.URI
const { UserModel } = require('../models/userModel')


const workoutsByDate = async (req, res, next) => {
  // const { userID} = req.body
  const client = new MongoClient(uri)


  const toDate=req.query.toDate;
  const fromDate=req.query.fromDate;
  const userID=req.query.userID;


  try {
    await client.connect()

    const database = client.db('app-data')
    const users = database.collection('workouts')
    const foundWorkouts = await users.find({
      user_id: userID,
      date: {
        $gte: new Date(fromDate),
        $lt: new Date(toDate)
      }
    }).toArray()

    res.send(foundWorkouts)

  } finally {
    await client.close()
  }
};

module.exports = {
  workoutsByDate
};