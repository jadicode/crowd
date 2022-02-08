import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Verified from './img/verified.png'
import ProfileSettings from '../options/ProfileSettings';



const UserProfile = () => {
    const [defaultprofilescreen, setDefaultProfileScreen] = useState(true);
    const [settingsScreen, setSettingsScreen] = useState(false);

    const [followbutton, setFollowButton] = useState (true)
    const [unfollowbutton, setUnfollowButton] =useState (false)

    const [profile, setProfile] = useState('');
    const [posts, setPosts] = useState(['']);
    const params = useParams();

    const [tokendata, setTokenData] = useState(['']);

    function TokenData() {
      const token = localStorage.getItem("CrowdToken");
      const decoded = jwt_decode(token);
      setTokenData(decoded)
    }

    const Profile = () => {
        axios.get(`http://localhost:5000/${params.tag}`)
        .then((response) => {
            setProfile(response.data)
        }) 
        .catch((error) => {
            console.log("Error en la carga del perfil");
        })
    }

    const Posts = () => {
        axios.get(`http://localhost:5000/getprofilepost/${params.tag}/`)
            .then((response) => {
                console.log(response);
                setPosts(response.data);
            })
      }

    const [follow, setFollow] = useState('');

    const Follow = () => {

    axios.post('http://localhost:5000/follow/', {
        follow_author: tokendata.tag,
        user_followed_tag: profile.tag,
        user_followed_id: profile.id
    }).then((response) =>{
        setFollow(response)
    })
    }

    const [checkfollow, setCheckFollow] = useState('');

    const CheckFollow = () =>{
        axios.get(`http://localhost:5000/follow/${params.tag}/`)
        .then((response) => {
            setCheckFollow(response.data);
        })
    }

    const Unfollow = () => {
        axios.delete(`http://localhost:5000/unfollow/`,{
            data: {
                follow_author: tokendata.tag,
                user_followed_tag: profile.tag
            }
        })
        .then((response) =>{
            
        })
    }

    const [following, setFollowing] = useState(0);
    const Following = () => {
        axios.get(`http://localhost:5000/following/${params.tag}/`)
        .then((response) => {
            setFollowing(response.data);
        })
    }

    const [followers, setFollowers] = useState(0);
    const Followers = () => {
        axios.get(`http://localhost:5000/followers/${params.tag}/`)
        .then((response) => {
            setFollowers(response.data);
        })
    }

    function OpenSettings() {
        setDefaultProfileScreen(false)
        setSettingsScreen(true)
    }

    useEffect(() => {
        Profile();
        Posts();
        TokenData();
        CheckFollow();
        Following();
        Followers();
    }, []);


  return (
    <div className='profile'>
        <div className="profile_info">
            <i className="fas fa-user-circle"></i>
            <h3>{profile.name} { 
                profile.role ==="admin" &&
                <i className="fas fa-user-shield"></i>
                } 
                { profile.role === "verified" && 
                <img src={Verified} alt="Verified" />
                }</h3>
                <p>@{profile.tag}</p>
                <div className="profile_actions">
                    { 
                        tokendata.tag === profile.tag 
                        ?
                        <button onClick={OpenSettings}>Editar perfil</button>
                        : 
                        <div className="follow_conditions">
                            { 
                                tokendata.tag === checkfollow.follow_author
                                ? 
                                <button onClick={Unfollow}>Dejar de seguir</button>
                                :
                                <button onClick={Follow}>Seguir</button>
                            }
                        </div>
                    }
                </div>
                <div className="profile_stats">
                    <div className="stats_column">
                        <p>Seguidores</p>
                        <p>{followers.length}</p>
                    </div>
                    <div className="stats_column">
                        <p>Siguiendo</p>
                        <p>{following.length}</p>
                    </div>
                </div> 
        </div>
        <div className="profile_column">
            <hr className='feed-hr'/>
            <h1>Perfil de <span className='profile_feed_name'>{profile.name}</span></h1>
            {
                defaultprofilescreen && 
                <div className="profile_column_two">
                    { tokendata.tag === profile.tag ? 
                <div className={ posts.length === 0 ? "no_posts_yet" : "display_none"}>
                    <p>¡No tienes crowds todavía!</p>
                </div>
            : 
                <div className={ posts.length === 0 ? "no_posts_yet" : "display_none"}>
                    <p>Este usuario no tiene crowds todavía.</p>
                    </div>
            }
            <div className="profile_feed">
            {
                posts.map( post => 
                    <div className='profile_post' key={post.id}>
                        <div className="post_title">
                            <i className="fas fa-user-circle"></i>
                            <div className="post_info_name">
                                <p>{post.name} { 
                                profile.role ==="admin" &&
                                <i className="fas fa-user-shield"></i>
                                } 
                                { profile.role === "verified" && 
                                <img src={Verified} alt="Verified" />
                                }</p>
                                <p>@{post.author}</p>
                            </div>
                        </div>
                        <p className='message'>{post.message}</p>
                        <div className="timestamps">
                            <p>{post.createdAt}</p>
                        </div>
                    </div>    
                )
            }
            </div>
            </div>
            }
            {
                settingsScreen && <ProfileSettings setBack={setDefaultProfileScreen} setStay={setSettingsScreen} tokendata={tokendata}/>
            }
            
        </div>
    </div>
  )
}

export default UserProfile
