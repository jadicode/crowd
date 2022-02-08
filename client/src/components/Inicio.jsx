import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import CrowdIMG from '../assets/img/crowd.png'

const Inicio = () => {
  /* Screens */
  const [loginScreen, setLoginScreen] = useState(true);
  const [registerScreen, setRegisterScreen] = useState(false);

  /* Register States */

  const [tagRegister, setTagRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [nameRegister, setNameRegister] = useState('');
  const [emailRegister, setEmailRegister] = useState('');

  /* Login States*/

  const [tagLogin, setTagLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');


  const Register = () =>{
    axios.post('http://localhost:5000/register/',{
      tag: tagRegister,
      password: passwordRegister,
      name: nameRegister,
      email: emailRegister,
      role: "user"
    }).then((response) => {
      console.log(response);
    })
  }

  const Login = () =>{
    axios.post('http://localhost:5000/login/',{
      tag: tagLogin,
      password: passwordLogin
    }).then((response) => {
      if (response.data === "CrowdSecurityDeniedLogin") {
        console.log("Login incorrecto.");
      } else {

        localStorage.setItem("CrowdToken",  response.data)
        navigate('/home')
      }
    })
  }

  const navigate = useNavigate();

  const checkAuth = () => {
      const token = localStorage.getItem('CrowdToken');
      if (!token) {
          navigate('/')
      } else {
          navigate('/home');
      }
  }

  function LoginPress(){
    setLoginScreen(true)
    setRegisterScreen(false)

  }

  function RegisterPress(){
    setLoginScreen(false)
    setRegisterScreen(true)
  }

  useEffect(() =>{
    checkAuth();
    window.scrollTo(0, 0);
  },[]);
  
  return (
    <div className='inicio'>
      <div className="splitted_container">
        <div className="crowd_home_container">
          <div className="crowd_home_title">
            <img src={CrowdIMG} alt='Crowd Logo'/>
            <div className="title_home_text">
              <h1>Crowd.</h1>
              <p>Es lo que está pasando ahora.</p>
            </div>
          </div>
        </div>
        <div className="crowd_login_container">
          <div className="credentials_container">
            <div className="logo_container_credentials">
              <img src={CrowdIMG} alt="Crowd Logo" width={40} />
              <h2>Crowd.</h2>
            </div>
            
            <div className="conditional_press">
              <button className={loginScreen && 'active'} onClick={LoginPress}>Inicia sesión</button>
              <button className={registerScreen && 'active'} onClick={RegisterPress}>Registrarse</button>
            </div>
            {
              loginScreen && 
              <div className="login">
                <label htmlFor="tag">Nombre de usuario</label>
                <input type="text" onChange={(e) => {setTagLogin(e.target.value)}}/>
                <label htmlFor="password">Contraseña</label>
                <input type="password" onChange={(e) => {setPasswordLogin(e.target.value)}}/>
                <a href="problemas">¿Olvidaste tu contraseña?</a>
                <button onClick={Login}>Inicia sesión</button>
              </div>
            }
            {
              registerScreen &&
              <div className="register">
                <label htmlFor="tag">Nombre de usuario</label>
                <input type="text" onChange={(e) => {setTagRegister(e.target.value)}}/>
                <label htmlFor="password">Contraseña</label>
                <input type="password"  onChange={(e) => {setPasswordRegister(e.target.value)}}/>
                <label htmlFor="name">Nombre del perfil</label>
                <input type="text" onChange={(e) => {setNameRegister(e.target.value)}}/>
                <label htmlFor="email">Correo electrónico</label>
                <input type="email"  onChange={(e) => {setEmailRegister(e.target.value)}}/>
                <button onClick={Register}>¡Únete a Crowd!</button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inicio
