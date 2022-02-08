// ########### //
// NPM IMPORTS //
// ########### //
const express = require("express");
var cors = require('cors');
const colors = require('colors/safe');
const {Sequelize, Model, DataTypes} = require('sequelize')
const jwt = require('jsonwebtoken')

// ######### //
// NPM FILES //
// ######### //
const dbconnection = require('./database/connection.js');
const cookieParser = require("cookie-parser");
// Setup

const app = express();

// ************************ //
// Parseo el clientea JSON. //
// ************************ //

app.use(cors());
app.use(express.json());
app.use(cookieParser());
// PARSING application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ############# //
// Base de Datos //
// ############# //
const sequelize = new Sequelize('mariadb://admin:crowd@localhost:3306/crowd');
dbconnection();


// ################### //
// Classes & EndPoints //
// ################### //
class Usuarios extends Model{}

Usuarios.init({
tag:{
    type: DataTypes.STRING,
    allowNull: false
},
password:{
    type: DataTypes.STRING,
    allowNull: false
},
name:{
    type: DataTypes.STRING,
    allowNull: false
},
description:{
    type: DataTypes.STRING,
    allowNull: true
},
email:{
    type: DataTypes.STRING,
    allowNull: false
},
role:{
    type: DataTypes.STRING,
    allowNull: true
}
}, {
sequelize, 
modelName: 'Usuarios' 
});


(async () => {
    await sequelize.sync({ force: true });
    const first_fake_user = Usuarios.build({tag: 'crowd', password: 'pestillo', name: "Crowd", email: 'pestillo@pestillo.es', role:'verified'});
    const second_fake_user = Usuarios.build({tag: 'status', password: 'status', name: "Crowd Status", email: 'pestillo@pestillito.es',  role:'admin'});
    const third_fake_user = Usuarios.build({tag: 'elonmusk', password: 'elonmusk', name: "Elon", email: 'elon@musk.es',  role:'user'});
    await first_fake_user.save();
    await second_fake_user.save();
    await third_fake_user.save();
})();

app.get('/verified/', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if (error) {
            res.sendStatus(403)
        } else {
            Usuarios.findAll()
            .then(usuarios => {res.send(usuarios);})
            .catch(err => console.log(err));
        }
    })
});
app.get('/usuarios/', function (req, res) {
    Usuarios.findAll()
    .then(usuarios => {res.send(usuarios);})
    .catch(err => console.log(err));
});

app.get('/:tag', function (req, res) {
    Usuarios.findOne({
        where:{
            tag: req.params.tag,
        }
    })
    .then(usuarios => {res.send(usuarios);})
    .catch(err => console.log(err));
});

// Registro de Usuarios //
app.post('/register/', function (req, res)  {
    const newUser = req.body;
    Usuarios.create(newUser)
      .then(userData => {
        res.send(userData);
      })
      .catch(err => console.log(err));
  });

// Login de Usuarios

app.post('/login', function (req, res) {
    const { tag, password } = req.body;
    Usuarios.findOne({
      where: {
        tag: tag,    
        password: password,
      },
    })
    .then((busqueda) => {
        if (!busqueda) {
            res.json("CrowdSecurityDeniedLogin")
        } else {
            console.log(colors.bgBrightMagenta.black("El usuario: @" + tag + " ha iniciado sesión"));
            jwt.sign({id: busqueda.id, tag: busqueda.tag, password: busqueda.password, name:busqueda.name, description: busqueda.description, email: busqueda.email, role: busqueda.role}, 'secretkey', {expiresIn: '1d'}, (error, token) => {
                res.json(token)
            })
        }
    })
  });

// Update Settings 
app.put('/update/', function (req, res) {
    Usuarios.update( {
      where: { 
          id: req.body
         }
      })
      .then(result => {res.send({updated: result[0]});})
      .catch(err => {console.log(err)});
  });

// Formato del token
// Authorization: Bearear <access_token>
// Verificador de Token

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearear = bearerHeader.split(' ')
        const bearearToken = bearear[1]
        req.token = bearearToken
        // Middleware
        next();
    } else {
        res.json("No tienes un token válido.")
    }
  }



//
/* POSTS */
//


class Posts extends Model{}

Posts.init({
    author:{
        type: DataTypes.STRING,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    message:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
sequelize, 
modelName: 'Posts' 
});

class Likes extends Model{}

Likes.init({
    author:{
        type: DataTypes.STRING,
        allowNull: false
    },
    number:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
sequelize, 
modelName: 'Likes' 
});

class Follows extends Model{}

Follows.init({
    follow_author:{
        type: DataTypes.STRING,
        allowNull: false
    },
    user_followed_tag:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
sequelize, 
modelName: 'Follows' 
});

// Seguir a alguien //

app.post('/follow/', function (req, res)  {
    const newFollow = req.body;
    Follows.create(newFollow)
      .then(post => {
        res.send(post);
      })
      .catch(err => console.log(err));
  });

// Comprobar el seguimiento //

app.get('/follow/:tag', function (req, res) {
    Follows.findOne({
        where:{
            user_followed_tag: req.params.tag,
        }
    })
    .then(usuarios => {res.send(usuarios);})
    .catch(err => console.log(err));
});

// Dejar de seguir //

app.delete('/unfollow/', function (req, res) {
    const { follow_author, user_followed_tag } = req.body;
    Follows.destroy({
      where: { 
        follow_author: follow_author,
        user_followed_tag: user_followed_tag
        }
      })
      .then(result => {res.send({deleted: result});})
      .catch(err => {console.log(err)});
  });

// Obtener tus siguiendo //

app.get('/following/:tag', function (req, res) {
    Follows.findAll({
        where:{
            follow_author: req.params.tag,
        }
    })
    .then(usuarios => {res.send(usuarios);})
    .catch(err => console.log(err));
});

// Obtener tus seguidores //

app.get('/followers/:tag', function (req, res) {
    Follows.findAll({
        where:{
            user_followed_tag: req.params.tag,
        }
    })
    .then(usuarios => {res.send(usuarios);})
    .catch(err => console.log(err));
});


// Obtener Feed Follows
app.get('/feed/follows/:tag/', function (req, res) {
    Follows.findAll({
        where:{
            follow_author: req.params.tag
        }
    })
    .then(follows => {res.send(follows);})
    .catch(err => console.log(err));
});

// Obtener posts para feed

app.get('/feed/posts/:tag', function (req, res) {
    Posts.findAll()
    .then(posts => {res.send(posts);})
    .catch(err => console.log(err));
});


/****************/
// Associations //
/****************/

Usuarios.hasMany(Follows, {foreignKey:'user_followed_id', as:'profile_followed'})
Follows.belongsTo(Follows, {foreignKey:'user_followed_id', as: 'profile_followed'})

Usuarios.hasMany(Posts, {foreignKey: 'fk_user', as: 'post'})
Posts.belongsTo(Usuarios, {foreignKey:'fk_user', as: 'owner'});

Posts.hasMany(Likes, {foreignKey: 'post_id', as: 'post_liked'});
Likes.belongsTo(Posts, {foreignKey: 'post_id', as: 'owner'});


// Crear Post //
app.post('/createpost/', function (req, res)  {
    const newPost = req.body;
    Posts.create(newPost)
      .then(post => {
        res.send(post);
      })
      .catch(err => console.log(err));
  });

app.get('/getprofilepost/:tag/', function (req, res) {
    Posts.findAll({
        where:{
            author: req.params.tag
        }
    })
    .then(posts => {res.send(posts);})
    .catch(err => console.log(err));
});

// ################## //
// PORT CONFIGURATION //
// ################## //

const PORT = 5000
app.listen(PORT, () => {
    console.log(colors.bgBrightGreen.black.bold(`Servidor ejecutado en el puerto: ${PORT} `));
});
