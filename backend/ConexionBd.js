const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Permitir CORS

const corsOptions = {
    origin: 'http://localhost:3001',  
    credentials: true,  
};
app.use(cors(corsOptions));

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

app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
  })
);

// Registro
app.post('/registro', (req, res) => {
  const { username, password, email, fullname, city, country, age, university, languages, hobbies, linkedin} = req.body;
  
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

// Login
app.post('/', (req, res) => {
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


app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.json({ message: 'Sesión finalizada correctamente.' });
      }
    });
  });

  app.get('/usuarios/registrados', function (req, res) {
    var userId = req.session.userId;
    db.query('SELECT usuarios.*, CASE WHEN amigos.idAmigo IS NOT NULL THEN 1 ELSE 0 END AS amigo FROM usuarios LEFT JOIN amigos ON usuarios.id = amigos.idAmigo AND amigos.iduser = ? WHERE usuarios.id != ?', [userId, userId], function (error, results) {
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
app.get('/posts', (req, res) => {
    db.query('SELECT id, title, content, usuarioId, createdAt, updatedAt FROM post', (err, results) => {
        if (err) {
            console.error('Error al obtener los posts:', err);
            res.status(500).json({ message: 'Ha ocurrido un error al obtener los posts. Por favor, intenta más tarde.' });
            return;
        }
        res.json(results);
    });
});

app.post('/posts', (req, res) => {
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
// Eliminar un post por su ID
app.delete('/posts/:id', (req, res) => {
    const postId = req.params.id;
  
    const sql = 'DELETE FROM post WHERE id = ?';
    db.query(sql, [postId], (err, result) => {
      if (err) {
        console.error('Error al eliminar el post:', err);
        res.status(500).json({ message: 'Ha ocurrido un error al eliminar el post. Por favor, intenta más tarde.' });
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'No se encontró el post con el ID especificado.' });
        return;
      }
  
      res.json({ message: 'El post ha sido eliminado correctamente.' });
    });
  });
  
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
});app.get('/perfil', function (req, res) {
    const loggedIn = req.session.loggedin;
    const username = req.session.username;
  
    if (loggedIn && username) {
      db.query(
        'SELECT fullname, city, country, age, university, languages, hobbies, linkedin FROM usuarios WHERE username = ?',
        [username],
        function (error, results, fields) {
          if (error) {
            console.error(error);
            res.status(500).send('Error al obtener los datos del usuario');
          } else if (results.length > 0) {
            const datosPerfil = results[0];
            res.json(datosPerfil);
          } else {
            res.status(404).send('Usuario no encontrado');
          }
        }
      );
    } else {
      res.status(401).send('No se ha iniciado sesión');
    }
  });
  
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
