import '../styles/ExerciseModal.css'
import Select from 'react-select/creatable'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'


const ExerciseModal = ({setShowExerciseModal, setExercises, exercises, clickedExercise, setClickedExercise}) =>{


  //currently selected select option
  const [activeOption, setActiveOption]=useState(null);

  //to Get select options from
  const options = [
    { value: 'legs-presses', label: 'Legs Presses' },
    { value: 'squats', label: 'Squats' },
    { value: 'calf-raises', label: 'calf raises' }
  ];

  //To get attributes from
  const [exercisesOptions, setExerciseOptions] =useState( [
    { name:"legs-presses", value: "legs-presses", label: 'Legs Presses', attributeKeys:["reps","sets","weight","break-time"] },
    {name:"squats",  value: 'squats', label: 'Squats', attributeKeys:["reps","sets","weight","water"], attributeValues:[1,2,3,4] },
    {name:"calf-raises", value: 'calf-raises', label: 'calf raises', attributeKeys:["reps","sets","weight","break-time","water"], attributeValues: [null,null,null,null,null] }
  ]);
  const defaultKeys={attributeKeys: ["reps","sets","weight","rest"]};
  const [customAttributes, setCustomAttributes] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const removeInputs = (target) => {
    target.parentElement.remove();
    setClickCount(clickCount-1);

  };
  let acceptedExercise={};

  const generateExercise = ()=>{
    //Set name of exercise
    acceptedExercise={
      // ...acceptedExercise,
      label:formatString(activeOption),
      value:activeOption,
      name:formatString(activeOption)
    };
    acceptedExercise={
      ...acceptedExercise,
      id:uuidv4()
    };

    const orgAttKeys = document.querySelectorAll(".org-att-container");
    const orgAttValues = document.querySelectorAll(".org-att-container input");

    const attributeKeys = [];
    const attributeValues = [];

    orgAttKeys.forEach((keyElement, index) => {
      const key = keyElement.getAttribute("value");
      attributeKeys.push(key);
      attributeValues.push(orgAttValues[index].value);
    });

// Get custom keys and values
    const customAttKeys = document.querySelectorAll(".custom-att-name");
    const customAttValues = document.querySelectorAll(".custom-att-value");

    customAttKeys.forEach((keyElement, index) => {
      const key = keyElement.value;
      attributeKeys.push(key);
      attributeValues.push(customAttValues[index].value);
    });
    acceptedExercise = {
      ...acceptedExercise,
      attributeKeys,
      attributeValues
    };
    console.log("gen",acceptedExercise)
    return acceptedExercise;
  }
  const acceptClick = () => {
    if (exercises) {

      const index = exercises?.findIndex(obj => obj.id === clickedExercise);
      if (index === -1) {
        setExercises([...exercises, generateExercise()]);
      } else {
        const newArray = [...exercises];
        newArray[index] = generateExercise();
        console.log("new", newArray);
        setExercises(newArray);

      }


    }
    else{
      setExercises([generateExercise()]);
    }
    setClickedExercise();
    setShowExerciseModal(false);
  }


  const addInput = () =>{
    if (clickCount < 10) {
      setClickCount(clickCount + 1);

      const newAttribute = (

        <div className="divCenter flexSpaceEven">
          <input className="exercise-container custom-att-name" placeholder="Name"></input>
          <input className="exercise-container custom-att-value" placeholder="Value"></input>

          <div className="divCenter flexColumn att-remove-btn"  onClick={(e)=>{removeInputs(e.target)}}>X</div>
        </div>
      );

      setCustomAttributes([...customAttributes, newAttribute]);
    }
  }
  const getExerciseByName = (exerciseName)=>{
    return exercisesOptions.filter((exercise) => exercise.label === exerciseName);
  }

  const getExerciseByID = (exerciseID)=>{
    console.log(exercises.filter((exercise) => exercise.id === exerciseID)[0])
    return exercises.filter((exercise) => exercise.id === exerciseID)[0];
  }
  function formatString(inputString) {
    return inputString
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  const checkSelection = (e)=>{
    setActiveOption(e.value);
  }
  const [cookies] = useCookies()
  const userID = cookies.UserID
  const getExercisesOptions = async () => {
    try {

      const promise = await axios.get('http://localhost:8000/exercises-by-user', {
        params:{userID:userID}
      })
      console.log(promise.data)
      setExerciseOptions(promise.data);
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const createExercise = async () => {
    const acceptedExercise=generateExercise();
    const data={
      value:activeOption,
      label:formatString(activeOption),
      user_id:userID,
      exercise_id:acceptedExercise.id,
      attributeKeys:acceptedExercise.attributeKeys
    }
    if(exercisesOptions.some(item=>item.value===activeOption)){

      //if exercise exist, update it
      try {
        const promise = await axios.put('http://localhost:8000/update-exercise', {
          params: { exerciseData: data }
        })

      } catch (error) {
        console.log(error)
        toast.error(error.response.data.error)
      }
    }
    else {
      //else create new one
      try {
        const promise = await axios.put('http://localhost:8000/create-exercise', {
          params: { exerciseData: data }
        })

      } catch (error) {
        console.log(error)
        toast.error(error.response.data.error)
      }
    }



  }


  useEffect(() => {
   if(clickedExercise!==null){
     setActiveOption( getExerciseByID( clickedExercise).name);
   }
    console.log("AA",activeOption)

  }, [clickedExercise]);

  useEffect(()=>{
    getExercisesOptions()
    console.log(clickedExercise);
  },[])

  return (
    <div className="exe-modal-body">
      <div className="divCenter h100">
        <div className="divCenter flexColumn">
          <div className="exe-container">
            <div className="exe-close-sign" onClick={()=> setShowExerciseModal(false)}>X</div>
            <div className="divCenter">
              <div className="select-name-container divCenter">
                <Select options={exercisesOptions}
                        onChange={(e)=>checkSelection(e)}
                        placeholder="Name of the exercise"
                        defaultValue={(clickedExercise && options.filter(option =>
                          option.value=== getExerciseByID( clickedExercise).name))||''}

                />
              </div>

              <div className="btn-container">
                <div className="prm-btn2" onClick={createExercise}>+</div>
              </div>

            </div>
            <div className="exercises-att-container">
              {activeOption && (clickedExercise
                  ? getExerciseByID(clickedExercise)
                  : getExerciseByName(activeOption)[0]
                    ? getExerciseByName(activeOption)[0]
                    : defaultKeys

              ).attributeKeys.map((d,index) =>
                (<div className="divCenter org-att-container" value={d}>
                  <input
                    className="exercise-container"
                    placeholder={formatString(d)}
                    defaultValue={
                      clickedExercise && getExerciseByID( clickedExercise).attributeValues &&
                      getExerciseByID( clickedExercise).attributeValues[index]
                      ? getExerciseByID( clickedExercise).attributeValues[index]
                      : ""
                    }/>
                  <div className="divCenter flexColumn att-remove-btn"  onClick={(e)=>{removeInputs(e.target)}}>X</div>

                </div>)
              )}
              {activeOption &&  customAttributes}
            </div>
            <div className="divCenter">
              {activeOption && <div className="teri-btn" onClick={addInput}>Add custom attribute</div>}
            </div>
            <div className="divCenter mar-bot-10">
              {activeOption && <div className={`prm-button`} onClick={acceptClick}><div>Accept</div></div>}
            </div>
          </div>
        </div>

      </div>

    </div>


  )
}
export default ExerciseModal