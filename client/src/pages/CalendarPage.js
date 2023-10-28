import '../styles/CalendarPage.css'
import Logo from '../images/GDLogo.svg'
import { useState } from 'react'
import React, { Component } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Navbar from '../components/Navbar'
import Menu from '../components/Menu'

const localizer = momentLocalizer(moment)

const CalendarPage = () => {

  const state = {
    events: [
      {
        start: moment().toDate(),
        end: moment()
          .add(1, 'days')
          .toDate(),
        title: 'Some title'
      }
    ]
  }
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <Navbar loggedIn={true} setShowMenu={setShowMenu} showMenu={showMenu}/>
      <div className="calendar-main">
        <div className="flexColumn divCenter">
          <div className="dashboard-title">
            Your Calendar
          </div>
          <hr className="hr-line"/>
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              defaultDate={new Date()}
              defaultView="month"
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