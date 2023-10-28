import '../styles/ExerciseModal.css'
import Select from 'react-select/creatable'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const ExerciseModal = ({setShowExerciseModal, setExercises, exercises, clickedExercise}) =>{


  //currently selected select option
  const [activeOption, setActiveOption]=useState(null);

  //to Get select options from
  const options = [
    { value: 'legs-presses', label: 'Legs Presses' },
    { value: 'squats', label: 'Squats' },
    { value: 'calf-raises', label: 'calf raises' }
  ];

  //To get attributes from
  const exercisesOptions = [
    { name:"legs-presses", attributeKeys:["reps","sets","weight","break-time"] },
    {name:"squats", attributeKeys:["reps","sets","weight","water"], attributeValues:[1,2,3,4] },
    {name:"calf-raises", attributeKeys:["reps","sets","weight","break-time","water"], attributeValues: [null,null,null,null,null] }
  ]
  const [customAttributes, setCustomAttributes] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const removeInputs = (target) => {
    target.parentElement.remove();
    setClickCount(clickCount-1);

  };
  let acceptedExercise={};
  const acceptClick = () =>{
    //Set name of exercise
    acceptedExercise={
      ...acceptedExercise,
      name:activeOption
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
    setExercises([...exercises, acceptedExercise]);
    setShowExerciseModal(false);
    console.log(acceptedExercise);

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
    return exercisesOptions.filter((exercise) => exercise.name === exerciseName);
  }

  const getExerciseByID = (exerciseID)=>{
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

  useEffect(() => {
   if(clickedExercise!==null){
     setActiveOption( getExerciseByID( clickedExercise).name);
   }
  }, [clickedExercise]);

  return (
    <div className="exe-modal-body">
      <div className="divCenter h100">
        <div className="divCenter flexColumn">
          <div className="exe-container">
            <div className="exe-close-sign" onClick={()=> setShowExerciseModal(false)}>X</div>
            <div className="divCenter">
              <div className="select-name-container divCenter">
                <Select options={options}
                        onChange={(e)=>checkSelection(e)}
                        placeholder="Name of the exercise"
                        defaultValue={(clickedExercise && options.filter(option =>
                          option.value=== getExerciseByID( clickedExercise).name))||''}

                />
              </div>

              <div className="btn-container">
                <div className="prm-btn2">+</div>
              </div>

            </div>
            <div className="exercises-att-container">
              {activeOption && (clickedExercise
                  ? getExerciseByID(clickedExercise)
                  : getExerciseByName(activeOption)[0]
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