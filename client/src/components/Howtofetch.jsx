import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Inicio = () => {
  const [usuarios, setUsuarios] = useState([]);

  const ShowUser = () =>{
    axios.get('http://localhost:5000/usuarios/')
        .then((response) => {
            console.log(response.data);
            setUsuarios(response.data);
        })
  }
  useEffect(() => {
    ShowUser();
  }, []);
  return (
    
    <div>
      <p>Prueba</p>
      {
        usuarios.map((data) => {
          return(
            <div key={data.id}>
              <p>{data.tag}</p>
            </div>
          )
        })
      }
    </div>
  )
}

export default Inicio
