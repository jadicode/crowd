import React, {useState, useEffect} from 'react'
import CrowdIMG from '../pages/img/crowd.png'
import { Link, useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";

const Header = () => {

  const [tokendata, setTokenData] = useState(['']);
  const navigate = useNavigate();

  function TokenData() {
    const token = localStorage.getItem("CrowdToken");
    const decoded = jwt_decode(token);
    setTokenData(decoded)
  }

  function Logout() {
      localStorage.removeItem("CrowdToken");
      localStorage.removeItem("CrowdName");
      navigate("/");
  }

  useEffect(() => {
    TokenData();
  }, []);

  return (
    <div className='header_bg'>
      <div className="header_grid">
          <Link to="/home" className="logo">
              <img src={CrowdIMG} alt="Crowd Logo" />
              <h1>Crowd.</h1>
          </Link>
          <div className="user_settings">
              <button onClick={Logout}><i className="fas fa-sign-out-alt"></i> Cerrar sesión</button>
          </div>
      </div>
    </div>
  )
}

export default Header
