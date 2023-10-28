import Home from './pages/Home'
import Dashboard from './pages/Dashboard';
import Track from './pages/Track';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {useCookies} from "react-cookie";
import { ToastContainer } from 'react-toastify'
import CalendarPage from './pages/CalendarPage'
import GraphPage from './pages/GraphPage'
const token=sessionStorage.getItem("AuthToken")

const App = () =>{

  const [cookies,setCookie,removeCookie]=useCookies(['user']);
  const token=sessionStorage.getItem("AuthToken")
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/calendar" element={<CalendarPage/>}/>
        <Route path="/track" element={<Track/>}/>
        <Route path="/graph" element={<GraphPage/>}/>
      </Routes>

    </BrowserRouter>
    <ToastContainer />
    </div>
  );
}
export default App;
