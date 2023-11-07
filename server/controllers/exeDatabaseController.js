const { MongoClient } = require('mongodb');
const { all } = require('express/lib/application')
const uri = process.env.URI



const exerciseEquipments = async (req, res, next) => {
  const client = new MongoClient(uri)

  try {
    await client.connect()

    const database = client.db('app-data')
    const collection = database.collection('exercisesDatabase')


    const pipeline = [
      { $unwind: "$primaryMuscles" },
      { $group: { _id: null, uniqueCategories: { $addToSet: "$category" }, uniqueEquipment: { $addToSet: "$equipment" }, uniquePrimaryMuscles: { $addToSet: "$primaryMuscles" } } },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    res.send(result[0])


  } finally {
    await client.close()
  }
};

const exercisesByOptions = async (req,res,next)=>{
  const client = new MongoClient(uri)
  const allOptions=req.query.allOptions;
  const userID=req.query.userID;
  try{
    await client.connect();
    const database=client.db('app-data');
    const collection=database.collection('exercisesDatabase');
    const query={}
    if(allOptions.category?.length>0){
      query.category={ $in: allOptions.category }
    }
    if(allOptions.advancement_level?.length>0){
      query.level={ $in: allOptions.advancement_level }
    }
    if(allOptions.force?.length>0){
      query.force={ $in: allOptions.force }
    }
    if(allOptions.equipment?.length>0){
      query.equipment={ $in: allOptions.equipment }
    }
    if(allOptions.primaryMuscles?.length>0){
      query.primaryMuscles={ $in: allOptions.primaryMuscles }
    }
    if(allOptions.secondaryMuscles?.length>0){
      query.secondaryMuscles={ $in: allOptions.secondaryMuscles }
    }
    const workouts=database.collection("workouts");

    const randomSampleSize = 5;

    const pipeline = [
      { $match: query },
      { $sample: { size: randomSampleSize } },
      { $project: { _id: 0, name: 1 } }
    ];
    const exercisesName = await collection.aggregate(pipeline).toArray();
    const exercisesNameArray = exercisesName.map(function(obj) {
      return obj.name;
    });

    const sharedExercises=await workouts.aggregate([
      { $unwind: "$exercises" },
      { $match: { "exercises.label": { $in: exercisesNameArray } } },
      { $match: { "user_id": userID } },
      { $sort: { "date": -1 } },
      { $limit: 10 },
      { $project: { _id: 0, exercise: "$exercises" } }
    ]).toArray();


    const result={
      exercisesNames:exercisesNameArray,
      sharedExercises:sharedExercises

    }
    res.send(result)

  }finally {
    await client.close()
  }

}

module.exports = {
  exerciseEquipments,
  exercisesByOptions
};

