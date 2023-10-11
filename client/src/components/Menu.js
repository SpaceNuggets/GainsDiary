import '../styles/Menu.css'
import { useNavigate } from 'react-router-dom'
const Menu = ({setShowMenu,clickedMenu}) =>{

  const closeMenu = () =>{

    setShowMenu(false);
  }
  const goToItem = (e)=>{
    console.log(e.getAttribute("value"));
    navigate("/"+e.getAttribute("value"))
  }
  let navigate = useNavigate()

  return (
    <div className="menu-body">
      <div className="close-sign" onClick={closeMenu}>X</div>
     <div className="menu-items-container">
       <div className="main-menu-item" onClick={(e)=>goToItem(e.target)}><div value="dashboard">Dashboard</div></div>
       <div className="main-menu-item"><div>Track the gains</div></div>
       <div className="main-menu-item" onClick={(e)=>goToItem(e.target)}><div value="calendar">Plan the gains</div></div>
       <div className="main-menu-item"><div>Graph the gains</div></div>
       <div className="main-menu-item"><div>Settings</div></div>
     </div>

    </div>


  )
}


export default Menu