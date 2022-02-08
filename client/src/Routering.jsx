import React from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Routes } from 'react-router';
import Inicio from './components/Inicio';
import UserHome from './components/pages/UserHome';
import Header from './components/static/Header';
import Error404 from './components/status/Error404';
import UserProfile from './components/pages/UserProfile';

function Routering() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Inicio></Inicio>}/>
        <Route path='/home' element={[<Header/>, <UserHome/>]}/>
        <Route path='/:tag' element={[<Header/>, <UserProfile/>]}/>
        <Route path="*" exact element={<Error404/>}/>
      </Routes>
    </Router>
  )
}

export default Routering
