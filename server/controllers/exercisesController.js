
const { MongoClient } = require('mongodb');
const uri = process.env.URI



const exercisesByUserID = async (req, res, next) => {
  const client = new MongoClient(uri)

  const userID=req.query.userID;
  try {
    await client.connect()

    const database = client.db('app-data')
    const users = database.collection('savedExercises')
    const foundExercises = await users.find({
      user_id: userID
    }).toArray()

    res.send(foundExercises)

  } finally {
    await client.close()
  }
};

module.exports = {
  exercisesByUserID
};