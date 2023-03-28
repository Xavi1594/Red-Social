var usuarios = [
    {
        id: 001,
        nombreDeUsuario: "usuario1",
        contraseña: "contraseña1",
        correoElectronico: "usuario1@example.com",
        nombreCompleto: "Juan Pérez",
        pais: "México",
        ciudad: "Ciudad de México",
        edad: 30,
        estudios: "Licenciatura en Informática",
        idiomas: ["español", "inglés"],
        perfilLinkedIn: "https://www.linkedin.com/in/juan-p%C3%A9rez-1234567/",
        hobbies: ["fotografía", "senderismo"]
    },
    {
        id: 002,
        nombreDeUsuario: "usuario2",
        contraseña: "contraseña2",
        correoElectronico: "usuario2@example.com",
        nombreCompleto: "María García",
        pais: "España",
        ciudad: "Madrid",
        edad: 25,
        estudios: "Ingeniería de Sistemas",
        idiomas: ["español", "inglés", "francés"],
        perfilLinkedIn: "https://www.linkedin.com/in/mar%C3%ADa-garc%C3%ADa-7654321/",
        hobbies: ["leer", "viajar"]
    },
    {
        id: 003,
        nombreDeUsuario: "Messi151",
        contraseña: "contraseña3",
        correoElectronico: "Messi@example.com",
        nombreCompleto: "María García",
        pais: "Francia",
        ciudad: "Paris",
        edad: 34,
        estudios: "Graduado en la Universidad de la vida, Certificado en Marketing Digital por la escaloneta",
        idiomas: ["español", "inglés", "francés"],
        perfilLinkedIn: "https://www.linkedin.com/in/Messi/",
        hobbies: ["Fútbol, ganar copas del mundo", "tomar mate"]
    },
];

function validarLogin() {
    var nombreDeUsuarioOCorreo = document.getElementById("nombre-de-usuario-o-correo").value;
    var contraseña = document.getElementById("contraseña").value;

    var usuarioEncontrado = false;

    for (var i = 0; i < usuarios.length; i++) {
        var usuario = usuarios[i];

        if (usuario.nombreDeUsuario === nombreDeUsuarioOCorreo || usuario.correoElectronico === nombreDeUsuarioOCorreo) {
            if (usuario.contraseña === contraseña) {
                // Iniciar sesión y redirigir al usuario a la página correspondiente
                usuarioEncontrado = true;
                window.location.href = "perfil.html";
                return;
            }
            break;
        } else {
            // Mostrar mensaje de error
            document.getElementById("mensaje-de-error").innerHTML = "El nombre de usuario/correo electrónico o la contraseña no son correctos.";
            document.getElementById("mensaje-de-error").style.color = "red";
            return;
        }
    }
    if (!usuarioEncontrado) {
        document.getElementById("mensaje-de-error").innerHTML = "El nombre de usuario/correo electrónico o la contraseña no existen.";
        document.getElementById("mensaje-de-error").style.color = "red";
    }
}