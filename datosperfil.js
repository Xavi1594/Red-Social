var usuario =
{
    id: 003,
    nombreDeUsuario: "Messi151",
    contraseña: "contraseña3",
    correoElectronico: "Messi@example.com",
    nombreCompleto: "Lionel Messi",
    pais: "Francia",
    ciudad: "Paris",
    edad: 34,
    estudios: "Graduado en la Universidad de la vida, Certificado en Marketing Digital por la escaloneta",
    idiomas: ["Español", "Inglés", "Francés"],
    perfilLinkedIn: "https://www.linkedin.com/in/Messi/",
    hobbies: ["Fútbol, Ganar copas del mundo", "Tomar mate"]
}

var nombreCompleto = document.getElementById("nombre-completo");
var pais = document.getElementById("pais");
var ciudad = document.getElementById("ciudad");
var edad = document.getElementById("edad");
var estudios = document.getElementById("estudios");
var idiomas = document.getElementById("idiomas");
var linkedin = document.getElementById("linkedin");
var hobbies = document.getElementById("hobbies");

// Asigna los valores correspondientes a cada elemento HTML
nombreCompleto.textContent = usuario.nombreCompleto;
pais.textContent = usuario.pais;
ciudad.textContent = usuario.ciudad;
edad.textContent = usuario.edad;
estudios.textContent = usuario.estudios;
idiomas.textContent = usuario.idiomas.join(", ");
linkedin.textContent = usuario.perfilLinkedIn
linkedin.setAttribute("href", usuario.perfilLinkedIn);
hobbies.textContent = usuario.hobbies.join(", ");