
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

const uniqueData=async(req,res)=>{
  // const { userID} = req.body
  const client = new MongoClient(uri)

  const userID=req.query.userID;



  try {
    await client.connect()

    const database = client.db('app-data')
    const collection= database.collection('workouts')
    const exercises= await collection.distinct("exercises.name",{ user_id: userID })
    const years=await collection.aggregate([
      {
        $match: { user_id: userID }
      },
      {
        $project: {
          year: { $year: "$date" }
        }
      },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray()

    res.send({years:years,exercises:exercises})

  } finally {
    await client.close()
  }
}

const exercisesByDate=async(req,res)=>{
  const client = new MongoClient(uri)

  const userID=req.query.userID;
  const exerciseName=req.query.exerciseName;
  const year=req.query.year;
  const month=req.query.month
  console.log( new Date(year, month, 1))
  try{
    await client.connect();

    const database=client.db('app-data');
    const collection=database.collection('workouts');
    const aggregationPipeline = [
      { $unwind: "$exercises" },
      { $match: { "exercises.name":  exerciseName} },
      { $match: { "user_id": userID } },
      { $sort: { "date": -1 } },
      { $project: { _id: 0, exercise: "$exercises", date:1 } }
    ];

    if (year !== "0" && month !== "0") {
      aggregationPipeline.splice(3, 0, {
        $match: {
          "date": {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1)
          }
        }
      });
    } else if (year !== "0") {
      aggregationPipeline.splice(3, 0, {
        $match: {
          "date": {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1)
          }
        }
      });
    }
    const sharedExercises = await collection.aggregate(aggregationPipeline).toArray();
    res.send(sharedExercises);
  }finally {
    await client.close();
  }


}

module.exports = {
  workoutsByDate, uniqueData, exercisesByDate
};