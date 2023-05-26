const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
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

// Configuración de la sesión
app.use(
  session({
    secret: process.env.JWT_SECRET || 'my-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Registro
app.post('/registro', (req, res) => {
  const { username, password, email, fullname, city, country, age, university, languages, hobbies, linkedin, extraknowledge } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error al hashear la contraseña:', err);
      return res.status(500).json({ message: 'Ha ocurrido un error al registrar el usuario. Por favor, intenta más tarde.' });
    }

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

      const sql = 'INSERT INTO usuarios (username, password, email, fullname, city, country, age, university, languages, linkedin, hobbies, extraknowledge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(sql, [username, hashedPassword, email, fullname, city, country, age, university, languages, linkedin, hobbies, extraknowledge], (err, result) => {
        if (err) {
          console.error('Error al insertar usuario:', err);
          return res.status(500).json({ message: 'Ha ocurrido un error al insertar el usuario en la base de datos. Por favor, intenta más tarde.' });
        }
        console.log([username, hashedPassword, email, fullname, city, country, age, university, languages, linkedin, hobbies, extraknowledge]);
        console.log('Usuario registrado correctamente');
        res.json({ message: 'El usuario ha sido registrado correctamente.' });
      });
    });
  });
});

// Login
app.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    db.query(
      'SELECT * FROM usuarios WHERE username = ? OR email = ?',
      [username, username],
      (error, results, fields) => {
        if (error) {
          console.error('Error al buscar usuario:', error);
          return res.status(500).json({ login: false, error: 'Ha ocurrido un error al iniciar sesión. Por favor, intenta más tarde.' });
        }
        if (results.length > 0) {
          const storedPassword = results[0].password;
          bcrypt.compare(password, storedPassword, function(err, isMatch) {
            if (err) {
              console.error('Error al verificar la contraseña:', err);
              return res.status(500).json({ login: false, error: 'Ha ocurrido un error al iniciar sesión. Por favor, intenta más tarde.' });
            }
            if (isMatch === true) {
              req.session.loggedin = true;
              req.session.username = results[0].username;
              req.session.usuarioId = results[0].id;
              res.json({ login: true, id: results[0].id });
            } else {
              res.status(400).json({ login: false, error: 'Usuario o contraseña incorrectos' });
            }
          });
        } else {
          res.status(400).json({ login: false, error: 'Usuario o contraseña incorrectos' });
        }
        
      }
    );
  } else {
    res.status(400).json({ login: false, error: 'Por favor, introduce tu nombre de usuario y contraseña' });
  }
});

// Cerrar sesión
app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: 'Sesión finalizada correctamente.' });
    }
  });
});

// Obtener la lista de usuarios registrados
app.get('/usuarios/registrados', function (req, res) {
  var userId = req.session.usuarioId;
  db.query(
    'SELECT usuarios.*, CASE WHEN amigos.idAmigo IS NOT NULL THEN 1 ELSE 0 END AS amigo FROM usuarios LEFT JOIN amigos ON usuarios.id = amigos.idAmigo AND amigos.iduser = ? WHERE usuarios.id != ?',
    [userId, userId],
    function (error, results) {
      if (error) {
        console.error('Ha ocurrido un error:', error.message);
        return res.status(500).json({ message: 'Ha ocurrido un error al obtener la lista de usuarios registrados' });
      }
      res.status(200).json(results);
    }
  );
});

// Obtener la lista de amigos
app.get('/amigos', function (req, res) {
  var userId = req.session.usuarioId;
  db.query(
    'SELECT * FROM usuarios WHERE id != ? AND id NOT IN (SELECT idAmigo FROM amigos WHERE iduser = ?)',
    [userId, userId],
    function (error, results) {
      if (error) {
        console.error('Ha ocurrido un error:', error.message);
        return res.status(500).json({ message: 'Ha ocurrido un error al obtener la lista de amigos' });
      }
      res.status(200).json(results);
    }
  );
});

// Agregar amigo
app.post('/amigos/agregar/:idAmigo', function (req, res) {
  var idAmigo = req.params.idAmigo;
  var userId = req.session.usuarioId;

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
  const userId = req.session.usuarioId;

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
  var userId = req.session.usuarioId;

  db.query('SELECT * FROM amigos WHERE iduser = ?', [userId], function (error, results) {
    if (error) {
      console.error('Ha ocurrido un error:', error.message);
      return res.status(500).json({ message: 'Ha ocurrido un error al obtener la lista de amigos' });
    }
    res.status(200).json(results);
  });
});

// Obtener la lista de posts
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

// Crear un nuevo post
app.post('/posts', (req, res) => {
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    usuarioId: req.session.usuarioId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log('Nuevo post:', newPost);
  if (newPost.title && newPost.content) {
    db.query(
      'INSERT INTO post (title, content, usuarioId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [newPost.title, newPost.content, newPost.usuarioId, newPost.createdAt, newPost.updatedAt],
      (err, results) => {
        if (err) {
          console.error('Error al crear el post:', err);
          res.status(500).json({ message: 'Ha ocurrido un error al crear el post. Por favor, intenta más tarde.' });
          return;
        }
        newPost.id = results.insertId;
        res.status(201).json(newPost);
      }
    );
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

// Editar un post por su ID
app.put('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const updatedAt = new Date();

  if (!title && !content) {
    res.status(400).json({ message: 'Debes proporcionar al menos un campo (título o contenido) para editar el post.' });
    return;
  }

  const sql = 'UPDATE post SET title = ?, content = ?, updatedAt = ? WHERE id = ?';
  db.query(sql, [title, content, updatedAt, postId], (err, result) => {
    if (err) {
      console.error('Error al editar el post:', err);
      res.status(500).json({ message: 'Ha ocurrido un error al editar el post. Por favor, intenta más tarde.' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'No se encontró el post con el ID especificado.' });
      return;
    }

    res.json({ message: 'El post ha sido editado correctamente.' });
  });
});

// Obtener datos de perfil
app.get('/perfil', function (req, res) {
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

app.delete('/eliminarcuenta', function (req, res) {
  const username = req.session.username;

  if (username) {
    db.query(
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




// Endpoint para obtener el perfil del usuario
app.get('/perfil', function (req, res) {
  const username = req.session.username;

  if (username) {
    db.query(
      'SELECT * FROM usuarios WHERE username = ?',
      [username],
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).send('Error al obtener el perfil');
        } else {
          if (results.length > 0) {
            const profile = results[0];
            res.json({
              username: profile.username,
              email: profile.email,
              fullname: profile.fullname,
              city: profile.city,
              country: profile.country,
              age: profile.age,
              university: profile.university,
              languages: profile.languages,
              linkedin: profile.linkedin,
              hobbies: profile.hobbies,
              extraknowledge: profile.extraknowledge
            });
          } else {
            res.status(404).send('Perfil no encontrado');
          }
        }
      }
    );
  } else {
    res.status(401).send('No se ha iniciado sesión');
  }
});

// Endpoint para actualizar el perfil del usuario
app.put('/perfil', function (req, res) {
  const username = req.session.username;
  const profileData = req.body;

  if (username) {
    db.query(
      'UPDATE usuarios SET ? WHERE username = ?',
      [profileData, username],
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).send('Error al actualizar el perfil');
        } else {
          console.log('Perfil actualizado correctamente');
          res.send('Perfil actualizado correctamente');
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
