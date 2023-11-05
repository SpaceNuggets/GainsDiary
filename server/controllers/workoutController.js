
const { MongoClient, ObjectId } = require('mongodb')

const { UserModel } = require('../models/userModel')

const { WorkoutModel } = require('../models/workoutModel')
const uri = process.env.URI


async function updateValues(req, res) {
  const  workoutData  = req.body.params.workoutData;

  try {
    const user = await UserModel.findOne({ user_id:  workoutData.user_id})


    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if( workoutData.exercises.length===0){
      await WorkoutModel.deleteOne({ user_id:  workoutData.user_id, workout_id: workoutData.workout_id });
    }
    else {
      await WorkoutModel.updateOne(
        { user_id: workoutData.user_id, workout_id: workoutData.workout_id },
        {
          $set: {
            date: new Date(workoutData.date),
            exercises: workoutData.exercises,
            name:workoutData.name
          }
        }
      );
    }
    res.json({ message: 'Update successful' })
  } catch (error) {
    console.error('Failed to update workout', error)
    res.status(500).json({ error: 'Failed to update workout' })
  }
}
async function insert(req, res) {
  const  workoutData  = req.body.params.workoutData;
  workoutData.date=new Date(workoutData.date);
  console.log(workoutData);
  try {
    const user = await UserModel.findOne({ user_id: workoutData.user_id})
    const exercise =await WorkoutModel.findOne({ user_id: workoutData.user_id, date:workoutData.date});
    if(exercise){
      return res.status(404).json({ error: 'There already is a workout on that day!' })
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    if(workoutData.exercises.length===0){
      return res.status(404).json({ error: 'At least 1 exercise must be present!' })
    }

    await WorkoutModel.create(workoutData)

    res.json({ message: 'Creation successful' })
  } catch (error) {
    console.error('Failed to create workout', error)
    res.status(500).json({ error: 'Failed to create workout' })
  }
}




module.exports = {
  updateValues,
  insert
}
