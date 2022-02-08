import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Verified from '../pages/img/verified.png'

const Explorar = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState('');
    const ShowUser = () =>{
      axios.get('http://localhost:5000/usuarios/')
          .then((response) => {
              setUsuarios(response.data);
          })
    }
    useEffect(() => {
      ShowUser();
    }, []);
  return (
    <div className='explorar'>
        <h1>Explorar</h1>
        <div className="search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Búsqueda por @..." onChange={event => {setSearch(event.target.value)}}/>
        </div>
        {
            usuarios.length === "" &&(
                <p>No hay ningún usuario registrado en Crowd :(. </p>
            )
        }
        {
        usuarios.length > 0 && (
            usuarios.filter((usuarios) => {
                if (search === ""){
                    return usuarios
                } else if(usuarios.tag.toLowerCase().includes(search.toLowerCase())){
                    return usuarios
                }
            }).map( usuarios => 
                <div key={usuarios.id}>
                    <Link className='explorar_profile' to={`/${usuarios.tag}`}>
                     <i className="fas fa-user-circle"></i>
                     <div className="explorar_desc">
                         <p>{usuarios.name} {usuarios.role === "admin" && <i className="fas fa-user-shield"></i>} {usuarios.role === "verified" && <img src={Verified} alt="Verified" />}</p>
                         <p>@{usuarios.tag}</p>
                     </div>
                    </Link>
                </div>
            )
        )
        }   
    </div>
  )
}

export default Explorar
