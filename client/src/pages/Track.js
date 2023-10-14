import '../styles/Track.css'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Menu from '../components/Menu'
import ExerciseModal from '../components/ExerciseModal'
import Select from 'react-select'
import Creatable from 'react-select/creatable';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';


const Track = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [workoutName, setWorkoutName] =useState();
  const [showExerciseModal,setShowExerciseModal]=useState(false)
  const [clickedExercise, setClickedExercise]=useState(null);
  const [exercises, setExercises]=useState([{
      name:"Squats",
      repetitions: 20,
      sets: 3,
      weight:0,
      "Break Time": "1:30",
      "Water":"200ml"
    }]);
  const options = [
    { value: 'BeastBiceps', label: 'Beast Biceps' },
    { value: 'ThiccThigs', label: 'Thicc Thigs' },
    { value: 'Cardio', label: 'Cardio' }
  ];

  const addExerciseClick = ()=>{
    setClickedExercise(null);
    setShowExerciseModal(true)
  }

  //when clicking exercise button
  const modifyExercise = (e) =>{
    setClickedExercise(e.target.getAttribute("value"));
    setShowExerciseModal(true);
  }
  const removeExercise = (Event,ID) => {
    Event.stopPropagation();
    setExercises((prevExercises) => {
      return prevExercises.filter((exercise) => exercise.id !== ID);
    });
  };

  const acceptClick = ()=>{
    const workout={
      exercises:exercises,
      date:workoutDate,
      name:workoutName,
      id:uuidv4()

    };
    console.log(workout);
  }

  const saveClick = ()=>{
    //TODO: change to actually save
    const workout={
      exercises:exercises,
      date:workoutDate,
      name:workoutName,
      id:uuidv4()

    };
    console.log(workout);
  }
  return (
    <>
      <Navbar loggedIn={true} setShowMenu={setShowMenu} showMenu={showMenu}/>
      <div className="home-main-body">
        {showExerciseModal&& <ExerciseModal setShowExerciseModal={setShowExerciseModal} setExercises={setExercises} exercises={exercises} clickedExercise={clickedExercise}/> }
        <div className="main-panel">
          <div>
          <div className="dashboard-title">
            Finished workout?<br/>Great job!
          </div>
          <hr className="hr-line"/>
          <div className="next-section-info">
            Track it here:
          </div>
            <div className="divCenter exercises-container-body">
          <div className="exercises-container">
            <div className="top-exercises-container">
              <div className="select-name-container divCenter">
                <Creatable options={options} placeholder="Name of the workout"
                           formatCreateLabel={(e) => {return 'Add ' + e + ' workout'}}
                           onChange={(e)=>setWorkoutName(e.value)}
                />
              </div>
              <div className="exercises">
                {exercises.map(d =>
                  (<div className="divCenter">
                    <div className="exercise-container" value={d.id} onClick={(e)=>{modifyExercise(e)}}>{d.name}<div className="remove-exe-btn" onClick={(e)=>removeExercise(e,d.id)}>X</div></div>
                  </div>)
                )}
              </div>
              <div className="divCenter add-exercise-container">
                <div className="prm-button add-exercise-btn" onClick={addExerciseClick}>Add exercise</div>
              </div>
            </div>
            <div className="bottom-exercises-container">
              <div className="divCenter">
                <DatePicker selected={workoutDate} onChange={(date) => setWorkoutDate(date)}/>
              </div>
              <div className="flexSpaceEven">
                <div className="dashboard-button prm-button" onClick={acceptClick}>
                  <div className="divCenter flexColumn">Add</div>
                </div>
                <div className="dashboard-button prm-button" onClick={saveClick}>
                  <div className="divCenter flexColumn">Save</div>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>

      </div>
      {showMenu && <Menu setShowMenu={setShowMenu}/>}
    </>
  )
}
export default Track