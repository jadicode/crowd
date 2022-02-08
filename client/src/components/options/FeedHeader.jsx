import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Verified from '../pages/img/verified.png'
import jwt_decode from "jwt-decode";
import FeedPosts from './FeedPosts';

const Feed = () => {

  const [enviarCrowd, setEnviarCrowd] = useState('Enviar');
  const [tokendata, setTokenData] = useState(['']);

  function TokenData() {
    const token = localStorage.getItem("CrowdToken");
    const decoded = jwt_decode(token);
    setTokenData(decoded)
  }
  const [newPost, setNewPost] = useState('');

  const CreatePost = () => {
    axios.post('http://localhost:5000/createpost/', {
      author: tokendata.tag,
      name: tokendata.name,
      message: newPost,
      fk_user: tokendata.id
    })
    .then((response) => {
      setEnviarCrowd("¡Crowd publicado!")
    })
  }

  useEffect(() => {
    TokenData();
  }, []);


  return (
    <div className='feed_component'>
      <h1>Feed</h1>
      <div className="make_a_post">
        <div className="title_post">
          <i className="fas fa-user-circle"></i>
          <p>Enviando como <span>{tokendata.name} { 
                  tokendata.role ==="admin" &&
                  <i className="fas fa-user-shield"></i>
                  } 
                  { tokendata.role === "verified" && 
                  <img src={Verified} alt="Verified" />
                  }</span></p>
        </div>
        <div className="post_message">
          <textarea maxLength={'300'} type="text" name="post" id="post" placeholder='Comparte con tu crowd...' onChange={(e) => {setNewPost(e.target.value)}}/>
          <button onClick={CreatePost}><i className="fas fa-paper-plane"></i> {enviarCrowd}</button>
        </div>
      </div>
      <FeedPosts></FeedPosts>
    </div>
  )
}

export default Feed
