
const { MongoClient, ObjectId } = require('mongodb')

const { UserModel } = require('../models/userModel')

const { ExerciseModel } = require('../models/exerciseModel')
const uri = process.env.URI


async function updateValues(req, res) {
  const  exerciseData  = req.body.params.exerciseData;


  try {
    const user = await UserModel.findOne({ user_id: exerciseData.user_id})


    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if(exerciseData.attributeKeys.length===0){
      await ExerciseModel.deleteOne({ user_id: exerciseData.user_id, value: exerciseData.value });
    }
    else {

      await ExerciseModel.updateOne(
        { user_id: exerciseData.user_id, value: exerciseData.value },
        {
          $set: {
            label: exerciseData.label,
            attributeKeys: exerciseData.attributeKeys,
            value: exerciseData.value
          }
        }
      );
    }
    res.json({ message: 'Update successful' })
  } catch (error) {
    console.error('Failed to update exercise', error)
    res.status(500).json({ error: 'Failed to update exercise' })
  }
}
async function insert(req, res) {
  const  exerciseData  = req.body.params.exerciseData;

  console.log(exerciseData);
  try {
    const user = await UserModel.findOne({ user_id: exerciseData.user_id})
    const exercise =await ExerciseModel.findOne({ user_id: exerciseData.user_id, value: exerciseData.value });
    if(exercise){
      return res.status(404).json({ error: 'Provided exercise already exists!' })
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    if(exerciseData.attributeKeys.length===0){
      return res.status(404).json({ error: 'At least 1 attribute must be present!' })
    }

    await ExerciseModel.create(exerciseData)

    res.json({ message: 'Creation successful' })
  } catch (error) {
    console.error('Failed to create exercise', error)
    res.status(500).json({ error: 'Failed to create exercise' })
  }
}




module.exports = {
  updateValues,
  insert
}
