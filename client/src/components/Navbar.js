import '../styles/Navbar.css'
import Logo from '../images/GDLogo.svg'
import { useState } from 'react'

const Navbar = ({setShowMenu, showMenu, loggedIn}) =>{



  const menuClick= () =>{
    console.log(showMenu);
    setShowMenu(!showMenu);
    console.log(showMenu);
  }
  return (
    <div className="navbar-body">
      <div className="logo-container">
        <img className="gd-logo" src={Logo} alt="Logo"/>
      </div>
      <div className="menu-items">
        <div>Services</div>
        <div>About</div>
        <div>Contact</div>
        {loggedIn && <div onClick={menuClick}>Menu</div>}
      </div>

    </div>


  )
}
export default Navbar