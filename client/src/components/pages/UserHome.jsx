import React from 'react'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Explorar from '../options/Explorar';
import Feed from '../options/FeedHeader';
import Verified from './img/verified.png'

const UserHome = () => {
    const navigate = useNavigate();

    const [tokendata, setTokenData] = useState('');
    /* Screens */
    const [homeScreen, setHomeScreen] = useState(true)
    const [explorarScreen, setExplorarScreen] = useState(false)

    function HomeScreen() {
      setExplorarScreen(false)
      setHomeScreen(true)
    }
    function ExplorarScreen() {
      setExplorarScreen(true)
      setHomeScreen(false)
    }
    
    /* */
    function TokenData() {
      const token = localStorage.getItem("CrowdToken");
      const decoded = jwt_decode(token);
      setTokenData(decoded)
    }
  
    const checkAuth = () => {
        const token = localStorage.getItem('CrowdToken');
        if (!token) {
            navigate('/')
        } else {
            console.log("Tienes token");
        }
    }
    
    localStorage.setItem("CrowdName", tokendata.tag)
    
    useEffect(() =>{
        checkAuth();
        TokenData();
        window.scrollTo(0, 0);
      },[]);

  return (
    <div className='homepage'>
      <div className="home_grid">
        <div className="home_options">
          <div className="home_options_link">
            <button onClick={HomeScreen}><i className="fas fa-home"></i> Inicio</button>
          </div>
          <div className="home_options_link">
            <button onClick={ExplorarScreen}><i className="fas fa-search-location"></i> Explorar</button>
          </div>
          <div className="home_options_link">
            <Link to="/home"><i className="fas fa-globe-europe"></i> General Crowd</Link>
          </div>
          <div className="home_options_link">
            <Link to={`/${tokendata.tag}`}><i className="fas fa-user"></i> Perfil</Link>
          </div>
          <div className="user_options_info">
          <i className="fas fa-user-circle"></i>
            <div className="name_and_user">
              <p>{tokendata.name} { 
              tokendata.role ==="admin" &&
              <i className="fas fa-user-shield"></i>
              } 
              { tokendata.role === "verified" && 
              <img src={Verified} alt="Verified" />
              }</p>
              <p>@{tokendata.tag}</p>
            </div>
          </div>
        </div>
        <div className="feed">
          <hr className='feed-hr' />
          { homeScreen && <Feed/>}
          { explorarScreen && <Explorar/>}
        </div>
      </div>
    </div>
  )
}

export default UserHome
