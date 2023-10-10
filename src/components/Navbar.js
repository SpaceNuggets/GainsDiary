import '../styles/Navbar.css'
import Logo from '../images/GDLogo.svg'

const Navbar = () =>{
  return (
    <div className="navbar-body">
      <div className="logo-container">
        <img className="gd-logo" src={Logo} alt="Logo"/>
      </div>
      <div className="menu-items">
        <div>Services</div>
        <div>About</div>
        <div>Contact</div>
      </div>

    </div>


  )
}


export default Navbar