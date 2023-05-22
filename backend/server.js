const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const http = require('http');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conexión establecida con la base de datos');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

////////////////////////////////////////// REGISTRO /////////////////////////////////////////////////

app.post('/registro', (req, res) => {
  const { username, password, email, fullname, city, country, age, university, languages, linkedin, hobbies } = req.body;

  // Validación: nombre de usuario y correo electrónico únicos
  const checkUserSql = 'SELECT * FROM usuarios WHERE username = ? OR email = ?';
  db.query(checkUserSql, [username, email], (checkUserErr, checkUserResult) => {
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

    const sql = 'INSERT INTO usuarios (username, password, email, fullname, city, country, age, university, languages, linkedin, hobbies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [username, password, email, fullname, city, country, age, university, languages, linkedin, hobbies], (err, result) => {
      if (err) {
        console.error('Error al insertar usuario:', err);
        res.status(500).json({ message: 'Ha ocurrido un error al insertar el usuario en la base de datos. Por favor, intenta más tarde.' });
        return;
      }
      console.log([username, password, email, fullname, city, country, age, university, languages, linkedin, hobbies]);
      console.log('Usuario registrado correctamente');
      res.json({ message: 'El usuario ha sido registrado correctamente.' });
    });
  });
});

////////////////////////////////////////// LOGIN /////////////////////////////////////////////////

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    db.query(
      'SELECT * FROM usuarios WHERE (username = ? OR email = ?) AND password = ?',
      [username, username, password],
      (error, results, fields) => {
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = results[0].username;
          req.session.usuarioId = results[0].id;
          res.json({ login: true, id: results[0].id });
        } else {
          res.status(400).json({ login: false, error: 'Usuario o contraseña incorrectos' });
        }
      }
    );
  } else {
    res.status(400).json({ login: false, error: 'Por favor, introduce tu nombre de usuario y contraseña' });
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
app.get('/usuarios/registrados', function (req, res) {
  var userId = req.session.userId;
  db.query('SELECT * FROM usuarios WHERE id != ?', [userId], function (error, results) {
      if (error) {
          console.error('Ha ocurrido un error:', error.message);
          return res.status(500).json({ message: 'Ha ocurrido un error al obtener la lista de usuarios registrados' });
      }
      res.status(200).json(results);
  });
});

// Obtener la lista de amigos
app.get('/amigos', function (req, res) {
  var userId = req.session.userId;
  db.query('SELECT * FROM usuarios WHERE id != ? AND id NOT IN (SELECT idAmigo FROM amigos WHERE iduser = ?)', [userId, userId], function (error, results) {
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
  var userId = req.session.userId;

  db.query('SELECT * FROM amigos WHERE iduser = ? AND idAmigo = ?', [userId, idAmigo], function (error, results) {
      if (error) {
          console.error('Ha ocurrido un error:', error.message);
          return res.status(500).json({ message: 'Ha ocurrido un error al agregar al amigo' });
      }

      if (results.length > 0) {
          return res.status(400).json({ message: 'Ya son amigos' });
      }

      db.query('INSERT INTO amigos (iduser, idAmigo) VALUES (?, ?)', [userId, idAmigo], function (error, results) {
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
  const userId = req.session.userId;

  db.query('DELETE FROM amigos WHERE idAmigo = ? AND iduser = ?', [idAmigo, userId], function (error, results, fields) {
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
  var userId = req.session.userId;

  db.query('SELECT * FROM amigos WHERE iduser = ?', [userId], function (error, results) {
      if (error) {
          console.error('Ha ocurrido un error:', error.message);
          return res.status(500).json({ message: 'Ha ocurrido un error al obtener la lista de amigos' });
      }
      res.status(200).json(results);
  });
});

/////////////////////////////////////////////// Funcion de POST/////////////////////////////////////////////////////////////////////////////////////////////

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
      usuarioId: req.session.userId,
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

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
