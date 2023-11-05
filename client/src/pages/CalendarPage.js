import '../styles/CalendarPage.css'
import Logo from '../images/GDLogo.svg'
import { useEffect, useState } from 'react'
import React, { Component } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Navbar from '../components/Navbar'
import Menu from '../components/Menu'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const localizer = momentLocalizer(moment)

const CalendarPage = ({history}) => {

  const navigate = useNavigate();
  const [state,setState] =useState( {
    events: [
      {
        start: moment().toDate(),
        end: moment().toDate(),
        title: 'Some title'
      }
    ]
  });
  const [cookies] = useCookies()
  const userID = cookies.UserID

  const getWorkouts = async () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    try {

      const promise = await axios.get('http://localhost:8000/workouts-next-week', {
        params:{userID:userID,
          fromDate:firstDayOfMonth,
          toDate:lastDayOfMonth}
      })
      setState()
      const transformedData = promise.data.map((row, index) => ({
        id:row,
        start: row.date,
        end: row.date,
        title: row.name ? row.name : "Unnamed"
      }));
      setState({
        events: transformedData
      })
      console.log(transformedData);
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    getWorkouts()

    function displayDate () {
      console.log(';)')
    }

    document.querySelectorAll(".rbc-btn-group > button").forEach((e)=>{
      e.addEventListener("click", displayDate)
    })

  }, [])
  const navigateClick = (e)=>{

    console.log(e)
    navigate('/track', { state: { workout:e.id } })
  }
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <Navbar loggedIn={true} setShowMenu={setShowMenu} showMenu={showMenu}/>

      <div className="calendar-main">
        <div className="flexColumn divCenter">
          <div className="dashboard-title">
            Your Calendar
            <div className="prm-button" onClick={()=>{navigateClick("A")}}>AAAA</div>
          </div>
          <hr className="hr-line"/>
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              defaultDate={new Date()}
              defaultView="month"
              onNavigate={(e)=>{navigateClick(e)}}
              onSelectEvent={(e)=>{navigateClick(e)}}
              events={state.events}
              style={{ height: '70vh', width: '60vw' }}
            />
          </div>
        </div>
      </div>
      {showMenu && <Menu setShowMenu={setShowMenu}/>}
    </>
  )

}
export default CalendarPage