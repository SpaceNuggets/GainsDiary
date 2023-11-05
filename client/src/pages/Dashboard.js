import '../styles/Dashboard.css'
import '../styles/general.css'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import Menu from '../components/Menu'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'


const Dashboard = ({ navigation, route }) => {

  const [showMenu,setShowMenu]=useState(false);

  const [workouts,setWorkouts]=useState();
  const [cookies] = useCookies()
  const userID = cookies.UserID

  const getWorkouts = async () => {
    console.log(userID);
    const nextWeek = new Date();
    nextWeek.setDate(new Date().getDate() + 7);
    try {

      const promise = await axios.get('http://localhost:8000/workouts-next-week', {
        params:{userID:userID,
        fromDate:new Date(),
        toDate:nextWeek}
      })
      console.log(promise.data)
      setWorkouts(promise.data);
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    getWorkouts()


  }, [])


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
            {!workouts  && (<div className="workout-card divCenter flexColumn empty-card">

              <div className="workout-day">Oops :(</div>
              <div className="workout-card-title">Look's like there is nothing planned this week, boss.
                You can check out whole calendar by clicking the button down below:</div>




            </div>
            )}
            {workouts &&
              workouts.slice(0,2).map((row, index) => (
                <div className="workout-card divCenter flexColumn" key={index}>
                  <div className="workout-day">
                    {new Date(row.date).toLocaleString('en-US', { weekday: 'long' })}
                  </div>
                  <div className="workout-card-title">{row.name}</div>
                  <ul>
                    {row.exercises.slice(0,3).map((exercise, exerciseIndex) => (
                      <li key={exerciseIndex}>{exercise.name}</li>
                    ))}
                  </ul>
                  <div className="divCenter">
                    <div className="workout-card-btn prm-button">Read more</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="divCenter">
          <div className="dashboard-button prm-button divCenter flexColumn">
            <div className="divCenter flexColumn">See all the gains</div>
          </div>
        </div>
        <hr className="hr-line"/>
        <div className="next-section-info">Already finished your workout? Record it here:</div>

        <div className="divCenter">
          <div className="dashboard-button prm-button divCenter flexColumn">
            <div className="divCenter flexColumn">See all the gains</div>
          </div>
        </div>
      </div>
      {showMenu && <Menu setShowMenu={setShowMenu} />}
    </>

  )
}

export default Dashboard