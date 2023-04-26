// Obtener los datos del perfil del usuario
window.onload = function () {
  // Obtener los datos del perfil del usuario
  fetch('/datosperfil')
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(function (datosPerfil) {
      // Actualizar los elementos del HTML con los datos del perfil
      console.log(response);
      document.getElementById('nombre-completo').textContent = datosPerfil.fullname;
      document.getElementById('ciudad').textContent = datosPerfil.city;
      document.getElementById('pais').textContent = datosPerfil.country;
      document.getElementById('edad').textContent = datosPerfil.age;
      document.getElementById('estudios').textContent = datosPerfil.university;
      document.getElementById('idiomas').textContent = datosPerfil.languages;
      document.getElementById('linkedin').textContent = datosPerfil.linkedin;
      document.getElementById('hobbies').textContent = datosPerfil.hobbies;
    })
    .catch(function (error) {
      console.log('Error al recuperar los datos del perfil:');
    });
};


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Agregar evento de clic al botón de eliminar cuenta
document.getElementById("eliminar-cuenta").addEventListener("click", function () {
  var confirmacion = confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.");

  if (confirmacion) {
    // Eliminar cuenta y datos asociados
    usuario = null;
    document.getElementById("nombre-completo").innerHTML = "";
    document.getElementById("pais").innerHTML = "";
    document.getElementById("ciudad").innerHTML = "";
    document.getElementById("edad").innerHTML = "";
    document.getElementById("estudios").innerHTML = "";
    document.getElementById("idiomas").innerHTML = "";
    document.getElementById("linkedin").innerHTML = "";
    document.getElementById("hobbies").innerHTML = "";
    document.getElementById("mensaje-confirmacion").classList.remove("oculto");
  }
});