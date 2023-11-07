import '../styles/GraphPage.css'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Chart } from 'react-charts'
import { type } from '@testing-library/user-event/dist/type'
import { AxisOptions } from 'react-charts'
import Select from 'react-select'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'

const GraphPage = () => {
  const [option, setOption] = useState('weight')
  const [displayGraph, setDisplayGraph]=useState(false);
  const [year, setYear]=useState();
  const [cookies] = useCookies()
  const userID = cookies.UserID
  const [month, setMonth]=useState();
  type Exercise = {
    date: Date,
    weight: number,
    reps: number
  }

  type Series = {
    label: string,
    data: Exercise[]
  }
  const [chosenExercise, setChosenExercise] = useState(null)
  const  [data: Series[], setData] =useState( [
    {
      label: '',
      data:[]
    }
  ]);
  const getGraphData = async()=>{
    //TODO: Change to get data from api

    try {

      const promise = await axios.get('http://localhost:8000/workouts-exercises-data', {
        params:{
          userID:userID,
          exerciseName:chosenExercise,
          year:year,
          month:month
        }
      })
      console.log(promise.data)
      if(promise.data.length!==0) {
        const convertedData = []

        promise.data.forEach((item) => {
          const date = new Date(item.date);
          console.log("item", item)
          const attributes = item.exercise.attributeKeys;
          const values = item.exercise.attributeValues;

          const dataItem = {
            date,
          };

          for (let i = 0; i < attributes.length; i++) {
            if (!isNaN(parseFloat(values[i]))) {
              dataItem[attributes[i]] = parseFloat(values[i]);
            } else {
              dataItem[attributes[i]] = values[i];
            }
          }

          convertedData.push(dataItem);
        })
        console.log(convertedData)
        const newData = {
          label: chosenExercise,
          data: convertedData
        }
        setData([newData])
        console.log("new data", newData)
        const uniqueKeys = new Set();
        for (const obj of [newData]) {
          console.log("obj",obj)
          if (obj.data && Array.isArray(obj.data)) {
            // Loop through the data array
            for (const dataItem of obj.data) {
              // Extract keys (excluding 'date')

              Object.keys(dataItem).forEach(key => {
                if (key !== 'date') {
                  uniqueKeys.add(key);
                }
              });
            }
          }
        }
        const attributes = Array.from(uniqueKeys).map(key => {
          return { value: key, label: key.charAt(0).toUpperCase() + key.slice(1) };
        });
        setAttributeOptions(attributes);
      }else{
        toast.info("No workouts found for this criteria")
        console.log("AA");
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }


    const dataReceived=[
      {
        label: 'Squats - '+option,
        data: [
          {
            date: new Date('December 10, 1995'),

            weight: 60,
            reps: 30,
            sets:100
          },
          {
            date: new Date('December 19, 1995'),
            weight: 30,
            reps: 40,
            sets:500
          },
          {
            date: new Date('December 31, 1995'),
            weight: 40,
            reps: 60,
            sets:1000
          }
          // ...
        ]
      }]
    // setData (dataReceived);

    // console.log(attributes  );


  }

  const [exerciseOptions,setExerciseOptions] =useState( [])
  const [yearOptions,setYearOptions]= useState([])
  const monthOptions=[
    { "value": 0,"label":"All months"},
    { "value": 1, "label": "January" },
    { "value": 2, "label": "February" },
    { "value": 3, "label": "March" },
    { "value": 4, "label": "April" },
    { "value": 5, "label": "May" },
    { "value": 6, "label": "June" },
    { "value": 7, "label": "July" },
    { "value": 8, "label": "August" },
    { "value": 9, "label": "September" },
    { "value": 10, "label": "October" },
    { "value": 11, "label": "November" },
    { "value": 12, "label": "December" }
  ]
  const [attributeOptions, setAttributeOptions] = useState();

  const [showMenu, setShowMenu] = useState(false)
  const primaryAxis = React.useMemo((
      (): AxisOptions => ({
        getValue: datum => datum.date,
      })),
    []
  )

  const secondaryAxes = React.useMemo(
    (): AxisOptions<Exercise>[] => [
      {
        getValue: datum => datum[option],
      },
    ],
    [option]
  )
  const rerenderGraph = () => {
    console.log("data",data);
    if(data[0].data.length!==0 ) {
      setGraph((
        <Chart
          options={{
            //TODO: Change colors
            defaultColors: ['#008800', '#008800', '#ddaacc', /*Array of colors*/],
            data,
            primaryAxis,
            secondaryAxes,

          }
          }
        />
      ))
      setDisplayGraph(true)
    }

  }

  const changeAttributeClick = (value)=>{
    setOption(value);
  }

  useEffect(() => {
  rerenderGraph();

  }, [data,option])

  const [graph, setGraph] = useState((
    <Chart
      options={{
        //TODO: Change colors
        defaultColors: ['#008800', '#008800', '#ddaacc', /*Array of colors*/],
        data,
        primaryAxis,
        secondaryAxes,

      }
      }
    />
  ))

  const getInitialData= async()=>{
    try {

      const promise = await axios.get('http://localhost:8000/workouts-unique-data', {
        params:{userID:userID}
      })
      console.log(promise.data)
      let newExercisesOptions=[]
      let newYearOptions=[{value:0,label:"All years"}]
      promise.data.exercises.forEach((item)=>{
        newExercisesOptions.push({value:item,label:item})

      })
      promise.data.years.forEach((item)=>{
        newYearOptions.push({value:item._id,label:item._id})
      })
      setExerciseOptions(newExercisesOptions)
      setYearOptions(newYearOptions)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getInitialData();
  },[])

  return (
    <>
      <Navbar loggedIn={true} setShowMenu={setShowMenu} showMenu={showMenu}/>
      <div className="home-main-body graph-page">
        <div>
          <div className="main-panel divCenter flexColumn">
            <div className="dashboard-title">
              Check your progress
            </div>
            <hr className="hr-line"/>
            <div className="next-section-info">
              Show graph for:
            </div>
            <div>
              <div className="divCenter">
              <div className="select-name-container flexSpaceEven">

                <Select options={exerciseOptions} placeholder="Exercise"

                        onChange={(e) => setChosenExercise(e.value)}
                />
                {chosenExercise&& <Select options={yearOptions}
                       placeholder="Year"
                       defaultValue={yearOptions[0]}
                       onChange={(e) => setYear(e.value)}
                />}
                {year && year!=="0"&&<Select options={monthOptions}
                        placeholder="Month"
                        isDisabled={year&&year==="0"}
                        defaultValue={ monthOptions[0]}
                        onChange={(e) => setMonth(e.value)}
                />}
                </div>

              </div>
              <div className="select-name-container divCenter">
              {attributeOptions && <Select options={attributeOptions}
                                           defaultValue={attributeOptions[0]}
                                           onChange={(e) => changeAttributeClick(e.value)}
              />}
              </div>
              <div className="select-name-container divCenter">
                {year>=0 &&
                  <div className="prm-button" onClick={getGraphData}>Accept</div>
                }
              </div>
              {chosenExercise && displayGraph &&<div className="graph-container">
                <div className="divCenter">
                  {graph}
                </div>
              </div>}
            </div>

          </div>
        </div>
      </div>
    </>

  )
}
export default GraphPage