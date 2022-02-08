const { Sequelize } = require('sequelize');
const colors = require('colors/safe');

// Verify if database is connected 

function Connection() {
    const sequelize = new Sequelize('mariadb://admin:crowd@localhost:3306/crowd');

    try {
      sequelize.authenticate();
      console.log(colors.bgCyan.black(' Conexión en db/admin/node: CORRECTA '));
    } catch (error) {
      console.error(colors.bgRed.white(' Error en db/admin/node: ', error ));
    }    
}

module.exports = Connection