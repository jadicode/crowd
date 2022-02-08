import { axios } from 'axios'
import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";

const ProfileSettings = ({setBack, setStay, tokendata}) => {
    const [updateTag, setUpdateTag] = useState('');
    const [updateName, setUpdateName] = useState('');
    const [updateDesc, setUpdateDesc] = useState('');
    const [updateEmail, setUpdateEmail] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    function GoBack() {
        setBack(true)
        setStay(false)
    }
    
    const UpdateData = () => {
        const parametros ={
            id: tokendata.id,
            tag: updateTag,
            password: updatePassword,
            name: updateName,
            description: updateDesc,
            email: updateEmail
        }
        axios.put('http://localhost:5000/update/', 
        parametros
        ).then((response) =>{
        }).catch((err)=>{
            console.log(err);
        })
    }

    useEffect(() => {
    }, []);
  return (
    <div className='profile_settings'>
        <div className="title_settings">
            <p>Modo edición</p>
            <p></p>
        </div>
        <div className="settings_form">
                <label htmlFor="tag">Nombre de usuario</label>
                <input type="text" placeholder={tokendata.tag} onChange={(e) => {setUpdateTag(e.target.value)}}/>

                <label htmlFor="name">Nombre del Perfil</label>
                <input type="text" placeholder={tokendata.name} onChange={(e) => {setUpdateName(e.target.value)}}/>

                <label htmlFor="desc">Descripción</label>
                <input type="text" placeholder={tokendata.description === null ? "No tienes descripción todavía." : tokendata.description} onChange={(e) => {setUpdateDesc(e.target.value)}}/>

                <label htmlFor="email">Correo electrónico</label>
                <input type="email" placeholder={tokendata.email} onChange={(e) => {setUpdateEmail(e.target.value)}}/>

                <label htmlFor="password">Contraseña</label>
                <input type="password" placeholder={tokendata.password} onChange={(e) => {setUpdatePassword(e.target.value)}}/>

                <div className="settings_buttons">
                    <button className='goback' onClick={GoBack}>Volver</button>
                    <button className='update' onClick={UpdateData}>Actualizar</button>
                </div>
        </div>
        
    </div>
  )
}

export default ProfileSettings
