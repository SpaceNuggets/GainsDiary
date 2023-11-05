import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const LoginModal = ({setShowModal}) =>{


  const [login,setLogin]=useState();
  const [password,setPassword]=useState();
  const [error,setError]=useState();
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  let navigate = useNavigate()
  const loginSubmit = async (e) => {
    e.preventDefault()
    try {

      const response = await axios.post(`http://localhost:8000/login`, {login, password })
      sessionStorage.setItem('AuthToken', response.data.authToken)
      setCookie('UserID', response.data.userID)
      const success = response.status === 201
      if (success) {
        console.log("AA")
        navigate('/dashboard')
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data.message ? error.response.data.message : error.response.data);
    }
  }

  return (
    <div className="exe-modal-body">
      <div className="divCenter h100">
        <div className="divCenter flexColumn">
          <div className="exe-container">
            <div className="exe-close-sign" onClick={()=> setShowModal(false)}>X</div>
            <div className="divCenter">
              <form onSubmit={loginSubmit}>
                <input
                  type="text"
                  className="sign-up-input"
                  id="login"
                  name="login"
                  placeholder="Your Username"
                  required={true}
                  onChange={(e)=>{setLogin(e.target.value)}}
                  value={login}
                />
                <input
                  type="password"
                  className="sign-up-input"
                  id="password"
                  name="password"
                  placeholder="Your Password"
                  required={true}
                  onChange={(e)=>{setPassword(e.target.value)}}
                  value={password}
                />
                <div className="divCenter"><input className="prm-button sign-up-btn" type="submit" value="Log in"/></div>
                <p>{error}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}
export default LoginModal