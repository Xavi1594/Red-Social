const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');


const app = express();
app.use('/css', express.static(__dirname + '/css'));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'frank',
    password: 'grupo13',
    database: 'grupo13'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión a la base de datos establecida');
});

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
app.post('/registro', (req, res) => {
    const { username, password, confirm_password, email, fullname, city, country, age, university, languages, linkedin, hobbies } = req.body;

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
    })
});

//Configurar la ruta para validar el inicio de sesión
// Configurar ruta de inicio de sesión
app.post('/login', function (req, res) {
    const usuario = req.body.usuario;
    const password = req.body.password;

    // Consultar la base de datos para encontrar el usuario correspondiente
    db.query(`SELECT * FROM usuarios WHERE username = ? OR email = ?`, [usuario, usuario], function (error, results) {
        if (error) throw error;

        if (results.length === 0) {
            // Si no hay resultados, el usuario no existe en la base de datos
            res.status(401).send('El usuario no existe');
        } else {
            // Comprobar si la contraseña es correcta
            const hash = results[0].password;
            bcrypt.compare(password, hash, function (error, result) {
                if (error) throw error;

                if (result) {
                    // La contraseña es correcta, iniciar sesión
                    res.redirect('/dashboard.html');
                } else {
                    // La contraseña es incorrecta
                    res.status(401).send('Contraseña incorrecta');
                }
            });
        }
    });
});

// Inicio del servidor
app.listen(4000, () => {
    console.log('Servidor iniciado en el puerto 4000');
});
