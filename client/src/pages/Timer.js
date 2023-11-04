import '../styles/Timer.css'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import useSound from 'use-sound'
import alarm from '../sounds/alarm.mp3'

const Timer = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [gridData, setGridData] = useState([])
  const [timerData, setTimerData] = useState([])
  const [seconds, setSeconds] = useState()
  const [startDate, setStartDate] = useState()
  const [timeoutID, setTimeoutID] = useState(null)
  const [timeoutProceedID, setTimeoutProceedID] = useState(null)
  const [originalSeconds, setOriginalSeconds] = useState()
  const [timerIndex, setTimerIndex] = useState(0)
  const [currentExercise, setCurrentExercise] = useState()
  const [alarmTimerID, setAlarmTimerID] = useState(null)
  const [play, { stop }] = useSound(alarm, {
    sprite: {
      '2': [1000, 3000],
      '1': [2000, 2000],
      '3': [0, 4000]
    }
  })

  const logMessage = (number) => {
    setTimerIndex(number + 1)
    if (number < timerData.length) {
      const seconds = timerData[number].time
      setStartDate(Date.now())
      setSeconds(seconds)
      setOriginalSeconds(seconds)
      setCurrentExercise(timerData[number].name)

      setTimeoutID(setTimeout(() => {logMessage(number + 1)}, seconds * 1000))
      playDelayedAlarm(seconds)
    } else {
      back()
    }
  }

  function start () {

    if (timeoutID === null) {
      const seconds = timerData[timerIndex].time
      setStartDate(Date.now())
      setCurrentExercise(timerData[timerIndex].name)
      setSeconds(seconds)
      setOriginalSeconds(seconds)
      setTimerIndex(timerIndex + 1)
      setTimeoutID(setTimeout(() => {logMessage(1)}, seconds * 1000))
      playDelayedAlarm(seconds)

    }
  }

  function proceed () {
    const seconds = Math.round(originalSeconds - (Date.now() - startDate) / 1000)
    if (seconds > 0) {
      setSeconds(seconds)
    }

  }

  function pause () {
    if (timeoutID !== null) {
      document.querySelector('.timer-seconds').classList.toggle('paused')
      stop()
      setSeconds(Math.round(originalSeconds - (Date.now() - startDate) / 1000))
      setOriginalSeconds(Math.round(originalSeconds - (Date.now() - startDate) / 1000))
      clearTimeout(timeoutID)
      clearTimeout(alarmTimerID)
      clearTimeout(timeoutProceedID)
      setTimeoutID(null)
      setAlarmTimerID(null)
    }
  }

  function resume () {
    if (timeoutID === null) {
      document.querySelector('.timer-seconds').classList.toggle('paused')
      setStartDate(Date.now())
      setTimeoutID(setTimeout(() => {logMessage(timerIndex)}, seconds * 1000))
      playDelayedAlarm(seconds)
      // setAlarmTimerID(setTimeout(()=>{play({id:"3"})}, (seconds - 3) * 1000))
      setSeconds(seconds)

    }
  }

  const validateValue = (value, minValue, maxValue) => {
    if (isNaN(value)) {
      return minValue
    }
    return Math.min(Math.max(value, minValue), maxValue)
  }

  const collectData = () => {
    const rows = document.querySelectorAll('.row')
    const data = Array.from(rows).map((row) => {
      const name = row.querySelector('[timcontext="name"]')?.value
      const time = validateValue(parseInt(row.querySelector('[timcontext="time"]')?.value, 10), 1, 999)
      const repeat = validateValue(parseInt(row.querySelector('[timcontext="repeat"]')?.value, 10), 1, 99)
      const rest = validateValue(parseInt(row.querySelector('[timcontext="rest"]')?.value, 10), 0, 999)

      return { name, time, repeat, rest }
    })
    const newTimerData = []
    const cycles = parseInt(document.querySelector('#cycles').value)
    for (let j = 0; j < cycles; j++) {
      data.forEach(item => {
        for (let i = 0; i < item.repeat; i++) {
          newTimerData.push({ name: item.name, time: item.time })
          if (item.rest > 0) {
            newTimerData.push({ name: item.name ? `${item.name} - Rest` : `Rest`, time: item.rest })
          }

        }

      })
    }
    console.log(newTimerData)
    setTimerData(newTimerData)

  }
  const playDelayedAlarm = (iSeconds) => {
    if (iSeconds <= 3) {
      play({ id: String(iSeconds) })
    } else {
      setAlarmTimerID(setTimeout(() => {play({ id: '3' })}, (iSeconds - 3) * 1000))
    }
  }
  const back = () => {
    setTimeoutID(null)
    setSeconds(null)
    setTimerIndex(0)
    setCurrentExercise('')
    clearTimeout(timeoutID)
    clearTimeout(alarmTimerID)
    clearTimeout(timeoutProceedID)
    stop()
  }
  const addRow = () => {

    setGridData([...gridData, { name: '', time: 30, repeat: 1, rest: 0 }])

  }

  const deleteRow = (row) => {
    console.log('AA')
    console.log(row.target.parentElement.parentElement)
    row.target.parentElement.parentElement.remove()
  }

  useEffect(() => {
    if (timerData.length > 0) {
      start()
    }
  }, [timerData])
  useEffect(() => {
    setSeconds(seconds)
  }, [timeoutID])
  useEffect(() => {

    if (timeoutID !== null) {
      setTimeoutProceedID(setTimeout(() => proceed(), 1000))
    }

  }, [seconds, startDate])

  return (
    <>
      <Navbar loggedIn={true} setShowMenu={setShowMenu} showMenu={showMenu}/>
      <div className="home-main-body">
        <div className="main-panel">
          <div>
            <div className="dashboard-title">
              Timer
            </div>
            <hr className="hr-line"/>
            <div className="divCenter exercises-container-body">
              <div className="exercises-container">

                <div className="ag-theme-alpine grid-container" style={{ width: 600 }}>
                  {!seconds && (
                    <div>
                      <div className="header">
                        <div className="flexColumn divCenter">Name</div>
                        <div className="flexColumn divCenter">Time</div>
                        <div className="flexColumn divCenter">Repeat</div>
                        <div className="flexColumn divCenter">Rest</div>
                        <div className="flexColumn divCenter">Delete</div>
                      </div>
                      {gridData.map((row, index) => (
                        <div className={('row ') + (index % 2 === 0 ? 'row-even' : 'row-odd')} key={index}>
                          <div className="flexColumn divCenter">
                            <input timcontext="name" defaultValue={row.name}/>
                          </div>
                          <div className="flexColumn divCenter">
                            <input timcontext="time" defaultValue={row.time}/>
                          </div>
                          <div className="flexColumn divCenter">
                            <input timcontext="repeat" defaultValue={row.repeat}/>
                          </div>
                          <div className="flexColumn divCenter">
                            <input timcontext="rest" defaultValue={row.rest}/>
                          </div>
                          <div className="flexColumn divCenter delete-column">
                            <div className="prm-button" onClick={(e) => deleteRow(e)}> Delete</div>
                          </div>
                        </div>
                      ))}
                      <div className="divCenter">
                        <div className="teri-btn add-row-grid" onClick={addRow}>Add</div>
                      </div>
                    </div>
                  )}
                  {seconds &&
                    <div className="timer-container">
                      <div className="timer-title">{currentExercise}</div>
                      <div className="divCenter">
                        <div className="timer-seconds">
                          <div className="seconds" key={seconds + timeoutID}>{seconds} </div>
                        </div>
                      </div>
                      <div className="divCenter">

                        {timeoutID && <div className="prm-button timer-btn" onClick={pause}>Stop</div>}
                        {!timeoutID && <div className="prm-button timer-btn" onClick={resume}>Resume</div>}
                        <div className="teri-btn timer-btn back-btn" onClick={back}>Back</div>
                      </div>

                    </div>}
                </div>

                <div className="divCenter cycles-container">
                  <label htmlFor="cycles">Cycles:</label>
                  <input type="number" min={1} defaultValue={1} id="cycles"/>

                </div>
                <div className="divCenter">
                  <div className="prm-button generate-btn" onClick={collectData}>Generate</div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </>

  )
}

export default Timer