import '../styles/Dashboard.css'
import '../styles/general.css'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import Menu from '../components/Menu'

const Dashboard = () => {

  const [showMenu,setShowMenu]=useState(false);



  return (
    <>
      <Navbar loggedIn={true} setShowMenu={setShowMenu} showMenu={showMenu}/>
      <div className="dashboard-main-section flexColumn divCenter">
        <div className="dashboard-title">
          Welcome, Exenvi
        </div>
        <hr className="hr-line"/>
        <div className="next-section-info">
          Here are some upcoming workouts:
        </div>
        <div className="workout-card-container">
          <div>
            <div className="workout-card divCenter flexColumn empty-card">
              <div className="workout-day">Oops :(</div>
              <div className="workout-card-title">Look's like there is nothing planned this week, boss.
                You can check out whole calendar by clicking the button down below:</div>


            </div>
            {/*<div className="workout-card divCenter flexColumn">*/}
            {/*  <div className="workout-day">Thursday</div>*/}
            {/*  <div className="workout-card-title">Thigh day</div>*/}
            {/*  <ul>*/}
            {/*    <li>Squats</li>*/}
            {/*    <li>Leg presses</li>*/}
            {/*    <li>Calf raises</li>*/}
            {/*  </ul>*/}
            {/*  <div className="divCenter">*/}
            {/*    <div className="workout-card-btn prm-button">Read more</div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </div>
        <div className="divCenter">
          <div className="dashboard-button prm-button divCenter flexColumn">
            <div>See all the gains</div>
          </div>
        </div>
        <hr className="hr-line"/>
        <div className="next-section-info">Already finished your workout? Record it here:</div>

        <div className="divCenter">
          <div className="dashboard-button prm-button divCenter flexColumn">
            <div>See all the gains</div>
          </div>
        </div>
      </div>
      {showMenu && <Menu setShowMenu={setShowMenu} />}
    </>

  )
}

export default Dashboard