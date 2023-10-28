import '../styles/Track.css'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Menu from '../components/Menu'
import ExerciseModal from '../components/ExerciseModal'
import Select from 'react-select'
import Creatable from 'react-select/creatable';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';
import {AgGridReact} from 'ag-grid-react'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import RemoveRowButton from '../components/RemoveRowButton'
const Track = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [workoutName, setWorkoutName] =useState();
  const [showExerciseModal,setShowExerciseModal]=useState(false)
  const [clickedExercise, setClickedExercise]=useState(null);
  const [exercises, setExercises]=useState([
    {name:"Squats",
      id:1,
      attributeKeys:["reps","water","sets","aa"],
      attributeValues:["20","200","2","1"]
    },
    {name:"Push ups",
      id:2,
      attributeKeys:["reps","water","sets","distance"],
      attributeValues:["20","200","2","1"]
    },
    {name:"Push ups",
      id:3,
      attributeKeys:["reps","water","sets","distance"],
      attributeValues:["20","200","2","1"]
    },
    {name:"Push ups",
      id:4,
      attributeKeys:["reps","water","sets","distance"],
      attributeValues:["20","200","2","1"]
    },
    {name:"Push ups",
      id:5,
      attributeKeys:["reps","water","sets","distance"],
      attributeValues:["20","200","2","1"]
    },
    {name:"Push ups",
      id:5,
      attributeKeys:["reps","water","sets","distance"],
      attributeValues:["20","200","2","1"]
    },
    {name:"Push ups",
      id:5,
      attributeKeys:["reps","water","sets","distance"],
      attributeValues:["20","200","2","1"]
    },
    {name:"sss",
      id:5,
      attributeKeys:["reps","water","sets","distance"],
      attributeValues:["20","200","2","1"]
    },{name:"Push ups",
      id:5,
      attributeKeys:["reps","water","sets","distance"],
      attributeValues:["20","200","2","1"]
    }

  ]);
  const options = [
    { value: 'BeastBiceps', label: 'Beast Biceps' },
    { value: 'ThiccThigs', label: 'Thicc Thigs' },
    { value: 'Cardio', label: 'Cardio' }
  ];
  const removeExerciseById = (id) => {
    // Filter the exercises array to remove the exercise with the given id
    const updatedExercises = exercises.filter(exercise => exercise.id !== id);

    // Update the state with the new exercises array
    setExercises(updatedExercises);
  };
  const addExerciseClick = ()=>{
    setClickedExercise(null);
    setShowExerciseModal(true)
  }
  const [rowData, setRowData]=useState();

  const [columnDef, setColumDef]=useState([
    [...new Set(exercises.flatMap(obj => obj.attributeKeys))].map(key => ({ field: key }))
  ]);

  const updateGrid = () =>{
    // Extract unique attributeKeys
    const uniqueAttributeKeys = [...new Set(exercises.flatMap(obj => obj.attributeKeys))];

    // Create columnDef array
    const columnDefTemp = uniqueAttributeKeys.map(key => ({ field: key, width:100 }));
    columnDefTemp.unshift({ field: 'id', hide:true });
    columnDefTemp.unshift({ field: 'name' });


    // Add rowDrag: true to the first object in the columnDef array
    columnDefTemp[0].rowDrag = true;
    columnDefTemp.push({
      headerName: "",
      id:1,
      width: 100,
      cellRenderer: RemoveRowButton,
      cellRendererParams: {
        onDeleteClick: (row) => {
          // Handle the row deletion here
          // For example, you can remove the row from your data source.
          console.log("Delete button clicked for row:", row.id);
          removeExerciseById(row.id);
        },
      },
    });
    setColumDef(columnDefTemp);

    // setColumDef([...new Set(exercises.flatMap(obj => obj.attributeKeys))].map(key => ({ field: key, rowDrag:true })));
    const newJsonArray = exercises.map((item) => {
      const newObj = { name: item.name, id:item.id };
      for (let i = 0; i < item.attributeKeys.length; i++) {
        newObj[item.attributeKeys[i]] = item.attributeValues[i];
      }
      return newObj;
    });
    console.log(columnDefTemp)
    setRowData(newJsonArray)
  }

  //when clicking exercise button
  const modifyExercise = (e) =>{
    setClickedExercise(e.target.getAttribute("value"));
    console.log(columnDef)
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
  const RemoveRowButton = (props) => {
    const { onDeleteClick, data } = props;

    const handleDeleteClick = () => {
      onDeleteClick(data);
    };

    return <div className="prm-button remove-row-btn" onClick={handleDeleteClick}>Delete</div>;
  };

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

  useEffect(() => {
    updateGrid();

  }, [exercises])
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
                <div className="ag-theme-alpine" style={{ width: 600 }}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDef}
                    rowDragManaged={true}
                    animateRows={true}
                    domLayout='autoHeight'
                  ></AgGridReact>
                </div>
                {/*//TODO: change?*/}
                {/*{exercises.map(d =>*/}
                {/*  (<div className="divCenter">*/}
                {/*    <div className="exercise-container" value={d.id} onClick={(e)=>{modifyExercise(e)}}>{d.name}<div className="remove-exe-btn" onClick={(e)=>removeExercise(e,d.id)}>X</div></div>*/}
                {/*  </div>)*/}
                {/*)}*/}
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