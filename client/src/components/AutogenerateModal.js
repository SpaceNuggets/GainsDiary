import { useEffect, useState } from 'react'
import axios, { all } from 'axios'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import '../styles/AutogenerateModal.css'

const AutogenerateModal = ({ setShowModal, setExercises }) => {

  const { v4: uuidv4 } = require('uuid');
  const [allOptions, setAllOptions] = useState({
    advancement_level: ['expert'],
    force: ['push'],
  })
  const [cookies] = useCookies()
  const userID = cookies.UserID

  const [allPossibleOptions, setAllPossibleOptions] = useState({
    advancement_level: ['beginner', 'intermediate', 'expert'],
    force: ['push', 'pull', 'static']
  })

  const handleSelectChange = (e, option) => {
    const categories = (Array.isArray(e) ? e.map(x => x.value) : [])
    setAllOptions({
      ...allOptions,
      [option]: categories
    })
  }
  const handleOneChange = (e) => {

    const option = e.target.getAttribute('option')
    const value = e.target.value

    setAllOptions((prevState) => {
      const updatedOptions = { ...prevState }
      const nameArray = Array.isArray(option) ? option : [option]

      nameArray.forEach((nameItem) => {
        if (updatedOptions[nameItem] === undefined) {
          updatedOptions[nameItem] = [value]
        } else {
          if (updatedOptions[nameItem].includes(value)) {
            // Remove the value if it already exists in the array
            updatedOptions[nameItem] = updatedOptions[nameItem].filter(
              (item) => item !== value
            )
            if (updatedOptions[nameItem].length === 0) {
              updatedOptions[nameItem] = [allPossibleOptions[nameItem][(allPossibleOptions[nameItem].indexOf(value) + 1) % allPossibleOptions[nameItem].length]]
            }
          } else {
            // Add the value to the array if it doesn't exist
            updatedOptions[nameItem] = [...updatedOptions[nameItem], value]
          }
        }
      })

      return updatedOptions
    })
  }

  const handleZeroChange = (e) => {
    const option = e.target.name
    const value = e.target.value
    if (allOptions[option] === value) {
      setAllOptions({
        ...allOptions,
        [option]: undefined
      })
    } else {
      setAllOptions({
        ...allOptions,
        [option]: value
      })
    }

  }
  const getPossibleOptions = async () => {

    try {

      const promise = await axios.get('http://localhost:8000/exercise-options', {
        params: {}
      })

      setAllPossibleOptions({
        ...allPossibleOptions,
        categories: promise.data.uniqueCategories.map(item => ({ value: item, label: item })),
        muscles: promise.data.uniquePrimaryMuscles.map(item => ({ value: item, label: item })),
        equipment: promise.data.uniqueEquipment.map(item => ({ value: item, label: item }))

      })
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  const groupExercisesByLabel = (exercisesArray) =>{
    const groupedExercises = {};

    exercisesArray.forEach((exercise) => {
      const name = exercise.exercise.label;

      if (!groupedExercises[name]) {
        groupedExercises[name] = { name, exercises: [] };
      }

      groupedExercises[name].exercises.push({ exercise:exercise.exercise });
    });

    return Object.values(groupedExercises);
  }
  const getAverageExerciseData=(exerciseData,parameter)=>{
    const {exercises}=exerciseData;
    let sum=0;
    let count=0

    exercises.forEach((exercise)=>{
      const index=exercise.exercise.attributeKeys.indexOf(parameter);
      if(!isNaN(parseFloat(exercise.exercise.attributeValues[index]))) {
        sum += parseFloat(exercise.exercise.attributeValues[index]);
        count++;
      }
    })
    return isNaN(sum/count) ? 0: sum/count;
  }

  function formatString(inputString) {
    // Convert to lowercase
    const lowercaseString = inputString.toLowerCase();

    // Remove whitespaces and replace with hyphens
    const formattedString = lowercaseString.replace(/\s+/g, '-');

    return formattedString;
  }

  const formatWorkout = (data) =>{
    const formattedExercises=[];
    let {exercisesNames,sharedExercises}=data;
    sharedExercises=groupExercisesByLabel(sharedExercises);
    exercisesNames.forEach((exerciseName)=>{
      const sharedExercise=sharedExercises.find(obj => obj.name === exerciseName);
      if(sharedExercise){
        const weight=getAverageExerciseData(sharedExercise,'weight');
        const reps=getAverageExerciseData(sharedExercise,'reps');
        const rest=allOptions.goal==="power" ? 180 : allOptions.goal ==="endurance" ? 30 : 60
        formattedExercises.push({
          id: uuidv4(),
          label:exerciseName,
          name:exerciseName,
          value:formatString(exerciseName),
          attributeKeys:["reps","sets","weight","rest"],
          attributeValues: [
            reps,
            4,
            weight,
            rest
          ]
        })
      }
      else{
        formattedExercises.push({
          id: uuidv4(),
          name:exerciseName,
          label:exerciseName,
          value:formatString(exerciseName),
          attributeKeys:["reps","sets","weight","rest"],
          attributeValues: [
            "15",
            "4",
            "0",
            "60"
          ]
        })
      }
    })
    return formattedExercises;

  }
  const generateWorkouts= async()=>{
    try {

      const promise = await axios.get('http://localhost:8000/exercise-by-options', {
        params: {
          allOptions:allOptions,
          userID:userID
        }
      })

)
      setExercises(formatWorkout(promise.data));
      setShowModal(false)


    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getPossibleOptions()
  }, [])

  return (
    <div className="exe-modal-body">
      <div className="divCenter h100">
        <div className="divCenter flexColumn">
          <div className="exe-container">
            <div className="exe-close-sign" onClick={() => setShowModal(false)}>X</div>
            <div className="divCenter">
              <form>
                <div className="advancement-level">
                  <div><label htmlFor="beginner_level">Beginner</label>
                    <input
                      id="beginner_level"
                      type="radio"
                      name="beginner_level"
                      option="advancement_level"
                      value={'beginner'}
                      onClick={handleOneChange}
                      checked={allOptions.advancement_level.some((item) => item === 'beginner')}
                    /></div>
                  <div><label htmlFor="intermediate_level">Intermediate</label>
                    <input
                      id="intermediate_level"
                      type="radio"
                      name="intermediate_level"
                      option="advancement_level"
                      value={'intermediate'}
                      onClick={handleOneChange}
                      checked={allOptions.advancement_level.some((item) => item === 'intermediate')}
                    /></div>
                  <div><label htmlFor="expert_level">Expert</label>
                    <input
                      id="expert_level"
                      type="radio"
                      name="expert_level"
                      option="advancement_level"
                      value={'expert'}
                      onClick={handleOneChange}
                      checked={allOptions.advancement_level.some((item) => item === 'expert')}
                    /></div>
                </div>
                <div className="force">
                  <div><label htmlFor="push">Push</label>
                    <input
                      id="push"
                      type="radio"
                      name="push"
                      option="force"
                      value={'push'}
                      onClick={handleOneChange}
                      checked={allOptions.force.some((item) => item === 'push')}
                    /></div>
                  <div><label htmlFor="pull">Pull</label>
                    <input
                      id="pull"
                      type="radio"
                      name="pull"
                      option="force"
                      value={'pull'}
                      onClick={handleOneChange}
                      checked={allOptions.force.some((item) => item === 'pull')}
                    /></div>
                  <div><label htmlFor="static">Static</label>
                    <input
                      id="static"
                      type="radio"
                      name="static"
                      option="force"
                      value={'static'}
                      onClick={handleOneChange}
                      checked={allOptions.force.some((item) => item === 'static')}
                    /></div>
                </div>
                <div className="goal">
                  <div><label htmlFor="power">Power</label>
                    <input
                      id="power"
                      type="radio"
                      name="goal"
                      value={'power'}
                      onClick={handleZeroChange}
                      checked={allOptions.goal === 'power'}
                    /></div>
                  <div><label htmlFor="pull">Hypertrophy</label>
                    <input
                      id="hypertrophy"
                      type="radio"
                      name="goal"
                      value={'hypertrophy'}
                      onClick={handleZeroChange}
                      checked={allOptions.goal === 'hypertrophy'}
                    /></div>
                  <div><label htmlFor="static">Endurance</label>
                    <input
                      id="endurance"
                      type="radio"
                      name="goal"
                      value={'endurance'}
                      onClick={handleZeroChange}
                      checked={allOptions.goal === 'endurance'}
                    /></div>
                </div>
                <div>
                  <Select
                    isMulti
                    name="category"
                    onChange={(e) => {handleSelectChange(e, 'category')}}
                    options={allPossibleOptions.categories}
                    placeholder="Category"
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div>
                  <Select
                    isMulti
                    name="category"
                    onChange={(e) => {handleSelectChange(e, 'equipment')}}
                    options={allPossibleOptions.equipment}
                    placeholder={'Equipment'}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div>
                  <Select
                    isMulti
                    name="primaryMuscles"
                    onChange={(e) => {handleSelectChange(e, 'primaryMuscles')}}
                    options={allPossibleOptions.muscles}
                    placeholder="Primary muscles"
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div>
                  <Select
                    isMulti
                    name="secondaryMuscles"
                    onChange={(e) => {handleSelectChange(e, 'secondaryMuscles')}}
                    options={allPossibleOptions.muscles}
                    placeholder={'Secondary muscles'}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              </form>

            </div>
            <div className="divCenter">
              <div className="prm-button" onClick={generateWorkouts}>Generate</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
export default AutogenerateModal