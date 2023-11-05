import '../styles/Navbar.css'
import Logo from '../images/GDLogo.svg'

import { useState } from 'react'
import LoginModal from './LoginModal'

const Navbar = ({setShowMenu, showMenu, loggedIn}) =>{

  const [showLoginModal,setShowLoginModal]=useState();

  const menuClick= () =>{
    setShowMenu(!showMenu);
  }

  const loginClick = () =>{
    setShowLoginModal(true)
  }
  return (
    <div className="navbar-body">
      {showLoginModal && <LoginModal setShowModal={setShowLoginModal}/>}
      <div className="logo-container">
        <img className="gd-logo" src={Logo} alt="Logo"/>
      </div>
      <div className="menu-items">
        <div>Services</div>
        <div>About</div>
        <div>Contact</div>
        {loggedIn && <div onClick={menuClick}>Menu</div>}
        {!loggedIn && <div onClick={loginClick}>Log in</div> }
      </div>

    </div>


  )
}
export default Navbar