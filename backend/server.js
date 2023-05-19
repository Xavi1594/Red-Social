const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const http = require('http');
// const ejs = require('ejs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
// const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de hashing

// app.use(cors());


const app = express();
app.use('/css', express.static(__dirname + '/css'));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conexión establecida con la base de datos');
});
//////////////////////////////////////////REGISTRO//////////////////////////////////////////////////////////////////////////////////

// Configuración del middleware body-parser para obtener los datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/css/style.css'));

app.use(express.static(__dirname, {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    },
}));

// Configuración de la ruta para el archivo HTML
app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/registro.html');
});

// Configuración de la ruta para manejar el registro de usuarios
app.post('/registro', async (req, res) => {
    const { username, password, email, fullname, city, country, age, university, languages, linkedin, hobbies } = req.body;

    // Validación: nombre de usuario y correo electrónico únicos
    const checkUserSql = 'SELECT * FROM usuarios WHERE username = ? OR email = ?';
    db.query(checkUserSql, [username, email], async (checkUserErr, checkUserResult) => {
        if (checkUserErr) {
            console.error('Error al buscar usuario:', checkUserErr);
            return res.status(500).json({ message: 'Ha ocurrido un error al validar el registro. Por favor, intenta más tarde.' });
        }
        if (checkUserResult.length > 0) {
            const usernameExists = checkUserResult.some((user) => user.username === username);
            const emailExists = checkUserResult.some((user) => user.email === email);
            if (usernameExists) {
                return res.status(400).json({ message: 'El nombre de usuario ya existe. Por favor, elige otro.' });
            }
            if (emailExists) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado. Por favor, utiliza otro.' });
            }
        }

        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const sql = 'INSERT INTO usuarios (username, password, email, fullname, city, country, age, university, languages, linkedin, hobbies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(sql, [username, hashedPassword, email, fullname, city, country, age, university, languages, linkedin, hobbies], (err, result) => {
                if (err) {
                    console.error('Error al insertar usuario:', err);
                    res.status(500).json({ message: 'Ha ocurrido un error al insertar el usuario en la base de datos. Por favor, intenta más tarde.' });
                    return;
                }
                console.log([username, hashedPassword, email, fullname, city, country, age, university, languages, linkedin, hobbies]);
                console.log('Usuario registrado correctamente');
                res.json({ message: 'El usuario ha sido registrado correctamente.' });
            });
        } catch (error) {
            console.error('Error al hashear la contraseña:', error);
            res.status(500).json({ message: 'Ha ocurrido un error al hashear la contraseña. Por favor, intenta más tarde.' });
        }
    });
});

/////////////////////////////////////////////LOGIN/////////////////////////////////////////////////////////////////

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Conexión establecida con la base de datos a login');
  });
  
  app.use(session({
    secret: 'kjT4#LP8dJz6@M!s',
    resave: false,
    saveUninitialized: false,
  }));
  
  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      connection.query(
        'SELECT * FROM usuarios WHERE (username = ? OR email = ?)',
        [username, username],
        async (error, results) => {
          if (error) {
            console.error('Error al buscar usuario:', error);
            return res.status(500).json({ error: true, message: 'Ha ocurrido un error al validar el inicio de sesión. Por favor, intenta más tarde.' });
          }
  
          if (results.length === 0) {
            return res.status(400).json({ error: true, message: 'Usuario o contraseña incorrectos' });
          }
  
          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.password);
  
          if (passwordMatch) {
            const token = jwt.sign({ usuarioId: user.id }, 'kjT4#LP8dJz6@M!s', { expiresIn: '1h' });
            return res.json({ success: true, token });
          } else {
            return res.json({ error: true, message: 'Usuario o contraseña incorrectos.' });
          }
        }
      );
    } else {
      res.json({ error: true, message: 'Por favor, introduce tu nombre de usuario y contraseña.' });
    }
  });
  
  app.use((req, res, next) => {
    if (req.path === '/' || req.path === '/login') {
      next();
    } else {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: true, message: 'Token no proporcionado.' });
      }
  
      jwt.verify(token, 'kjT4#LP8dJz6@M!s', (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: true, message: 'Token inválido.' });
        }
  
        req.usuarioId = decoded.usuarioId;
        next();
      });
    }
  });
  
  app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
  });
  
  app.get("/logout", (req, res) => {
    req.usuarioId = null;
    res.redirect("/");
  });
  
////////////////////////////////////////////////////DATOS DE PERFIL//////////////////////////////////////////////////////////////////////

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));

const connection1 = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection1.connect((err) => {
    if (err) throw err;
    console.log('Conexión establecida con la base de datosa perfil');
});

app.get('/datosperfil', function (req, res) {
    const username = req.session.username;

    if (username) {
        connection1.query(
            'SELECT fullname, city, country, age, university, languages, linkedin, hobbies FROM usuarios WHERE username = ?',
            [username],
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error al obtener los datos del usuario');
                } else {
                    const datosPerfil = {
                        fullname: results[0].fullname,
                        city: results[0].city,
                        country: results[0].country,
                        age: results[0].age,
                        university: results[0].university,
                        languages: results[0].languages,
                        linkedin: results[0].linkedin,
                        hobbies: results[0].hobbies
                    };
                    res.json(datosPerfil);
                }
            }
        );
    } else {
        res.status(401).send('No se ha iniciado sesión');
    }
});

/////////////////////////////////////////////// Borrar Cuenta /////////////////////////////////////////////////////////////////////////////

app.delete('/eliminar-cuenta', function (req, res) {
    const username = req.session.username;

    if (username) {
        connection1.query(
            'DELETE FROM usuarios WHERE username = ?',
            [username],
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error al eliminar la cuenta');
                } else {
                    console.log('La cuenta ha sido eliminada');
                    req.session.destroy();
                    res.send('La cuenta ha sido eliminada');
                }
            }
        );
    } else {
        res.status(401).send('No se ha iniciado sesión');
    }
});

////////////////////////////////////////////////Funcionalidad de la pagina de amistad///////////////////////////////////////////////////////////////////////

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Obtener la lista de usuarios registrados
app.get('/usuarios/registrados', function (req, res) {
    var usuarioLogueado = req.session.username;

    // Realiza la consulta a la base de datos para obtener la lista de usuarios registrados, excluyendo al usuario logueado
    db.query('SELECT * FROM usuarios WHERE username != ?', [usuarioLogueado], function (error, results) {
        if (error) {
            console.error('Ha ocurrido un error:', error.message);
            return res.status(500).json({ message: 'Ha ocurrido un error al obtener la lista de usuarios registrados' });
        }

        // Envía la lista de usuarios registrados como respuesta en formato JSON
        res.status(200).json(results);
    });
});

// Obtener la lista de amigos
app.get('/amigos', function (req, res) {
    var usuarioLogueado = req.session.username;

    // Realiza la consulta a la base de datos para obtener la lista de amigos, excluyendo al usuario logueado
    db.query('SELECT * FROM usuarios WHERE username != ? AND username NOT IN (SELECT usuario FROM amigos WHERE iduser = ?)', [usuarioLogueado, req.session.usuarioId], function (error, results) {
        if (error) {
            console.error('Ha ocurrido un error:', error.message);
            return res.status(500).json({ message: 'Ha ocurrido un error al obtener la lista de amigos' });
        }

        res.status(200).json(results);
    });
});

// Agregar amigo
app.post('/amigos/agregar/:idAmigo', function (req, res) {
    var idAmigo = req.params.idAmigo;
    var usuarioLogueado = req.session.username;
    var idUsuario = req.session.usuarioId;

    // Verificar si ya son amigos
    db.query('SELECT * FROM amigos WHERE iduser = ? AND idAmigo = ?', [idUsuario, idAmigo], function (error, results) {
        if (error) {
            console.error('Ha ocurrido un error:', error.message);
            return res.status(500).json({ message: 'Ha ocurrido un error al agregar al amigo' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Ya son amigos' });
        }

        // Insertar la relación de amistad
        db.query('INSERT INTO amigos (usuario, iduser, idAmigo) VALUES (?, ?, ?)', [usuarioLogueado, idUsuario, idAmigo], function (error, results) {
            if (error) {
                console.error('Ha ocurrido un error:', error.message);
                return res.status(500).json({ message: 'Ha ocurrido un error al agregar al amigo' });
            }

            res.status(200).json({ message: 'Amigo agregado correctamente' });
        });
    });
});

// Eliminar amigo
app.delete('/amigos/eliminar/:idAmigo', function (req, res) {
    const idAmigo = req.params.idAmigo;
    const idUsuario = req.session.usuarioId;

    // Eliminar la relación de amistad
    db.query('DELETE FROM amigos WHERE id = ? AND iduser = ?', [idAmigo, idUsuario], function (error, results, fields) {
        if (error) {
            console.error(error);
            return res.status(500).send('Ha ocurrido un error al eliminar al amigo');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('No se encontró al amigo con el id especificado');
        }

        res.send('Amigo eliminado correctamente');
    });
});

// Cargar amigos ya agregados
app.get('/amigos/agregados', function (req, res) {
    var idUsuario = req.session.usuarioId;

    db.query('SELECT * FROM amigos WHERE iduser = ?', [idUsuario], function (error, results) {
        if (error) {
            console.error('Ha ocurrido un error:', error.message);
            return res.status(500).json({ message: 'Ha ocurrido un error al obtener la lista de amigos' });
        }
        res.status(200).json(results);
    });
});
/////////////////////////////////////////////// Funcion de POST/////////////////////////////////////////////////////////////////////////////////////////////

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));

// routes
app.get('/post', (req, res) => {
    db.query('SELECT id, title, content, usuarioId, createdAt, updatedAt FROM post', (err, results) => {
        if (err) {
            console.error('Error al obtener los posts:', err);
            res.status(500).json({ message: 'Ha ocurrido un error al obtener los posts. Por favor, intenta más tarde.' });
            return;
        }
        res.json(results);
    });
});

app.post('/post', (req, res) => {
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        usuarioId: req.session.usuarioId,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    console.log('Nuevo post:', newPost);
    if (newPost.title && newPost.content) {
        db.query('INSERT INTO post (title, content, usuarioId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)', [newPost.title, newPost.content, newPost.usuarioId, newPost.createdAt, newPost.updatedAt], (err, results) => {
            if (err) {
                console.error('Error al crear el post:', err);
                res.status(500).json({ message: 'Ha ocurrido un error al crear el post. Por favor, intenta más tarde.' });
                return;
            }
            newPost.id = results.insertId;
            res.status(201).json(newPost);
        });
    } else {
        res.status(400).send({ message: 'El post debe tener un título y un contenido.' });
    }
});

////////////////////////////////Inicio de Servidor///////////////////////////////////////////////////

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
