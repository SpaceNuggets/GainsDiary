import '../styles/GraphPage.css'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Chart } from 'react-charts'
import { type } from '@testing-library/user-event/dist/type'
import { AxisOptions } from 'react-charts'
import Select from 'react-select'

const GraphPage = () => {
  const [option, setOption] = useState('weight')
  const [displayGraph, setDisplayGraph]=useState(false);
  const [year, setYear]=useState();
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
  const getGraphData = ()=>{
    //TODO: Change to get data from api
    const dataReceived=[
      {
        label: 'Squats - '+option,
        data: [
          {
            date: new Date('December 10, 1995'),

            weight: 20,
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
    setData(dataReceived);
    const uniqueKeys = new Set();
    for (const obj of dataReceived) {
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
    console.log(attributes  );


  }

  const exerciseOptions = [
    { value: 'squats', label: 'Squats' },
    { value: 'push-up', label: 'Push ups' },
    { value: 'running', label: 'Running' }
  ]
  const yearOptions= [
    {value:"0",label:"All years"},
    {value:"2023",label:"2023"},
    {value: "2022",label: "2022"},
    {value:"2021",label: "2021"}
  ]
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
  const aa=()=>{
    setOption("sets")
    console.log(option);
  }
  return (
    <>
      <Navbar loggedIn={true} setShowMenu={setShowMenu} showMenu={showMenu}/>
      <div className="home-main-body graph-page">
        <div>
          <div className="main-panel divCenter flexColumn">
            <div className="dashboard-title" onClick={aa}>
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
                {year &&
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