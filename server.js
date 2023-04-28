const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

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

/////////////////////////////////////////////LOGIN/////////////////////////////////////////////////////////////////

// Configurar sesión
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'frank',
    password: 'grupo13',
    database: 'grupo13'
});

connection.connect();

if (connection) { console.log('base de datos a login establecido') }

app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

// Configurar ruta para la página de login
app.get("/dashboard.html", (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, "dashboard.html"));
    } else {
        res.redirect("/");
    }
});

// Configurar ruta para el proceso de login
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        connection.query(
            `SELECT * FROM usuarios WHERE (username = ? OR email = ?) AND password = ?`,
            [username, username, password],
            (error, results, fields) => {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = results[0].username;
                    res.redirect("/dashboard.html");
                } else {
                    res.send("Usuario o contraseña incorrectos.");
                }
                res.end();
            }
        );
    } else {
        res.send("Por favor, introduce tu nombre de usuario y contraseña.");
        res.end();
    }
});

// Configurar middleware para validar sesión en todas las rutas excepto login
app.use((req, res, next) => {
    if (req.path === "/" || req.path === "/login") {
        next();
    } else if (req.session.loggedin) {
        next();
    } else {
        res.redirect("/");
    }
});

// Configurar ruta para el dashboard
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Configurar ruta para cerrar sesión
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

////////////////////////////////////////////////////DATOS DE PERFIL//////////////////////////////////////////////////////////////////////

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));

const connection1 = mysql.createConnection({
    host: 'localhost',
    user: 'frank',
    password: 'grupo13',
    database: 'grupo13'
});

connection1.connect();

if (connection) { console.log('base de datos a perfil establecido') }

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
                    req.session.destroy(); // Destruir la sesión del usuario
                    res.send('La cuenta ha sido eliminada');
                }
            }
        );
    } else {
        res.status(401).send('No se ha iniciado sesión');
    }
});

/////////////////////////////////////////////// Inicio del servidor////////////////////////////////////////////////////////////////////////

app.listen(4000, () => {
    console.log('Servidor iniciado en el puerto 4000');
});
