// // Obtener los datos del perfil del usuario
// window.onload = function () {
//   fetch('http://localhost:4000/datosperfil')
//     .then(function (response) {
//       if (!response.ok) {
//         throw Error(response.statusText);
//       }
//       return response.json();
//     })
//     .then(function (datosPerfil) {
//       // Actualizar los elementos del HTML con los datos del perfil
//       document.getElementById('nombre-completo').textContent = datosPerfil.fullname;
//       document.getElementById('ciudad').textContent = datosPerfil.city;
//       document.getElementById('pais').textContent = datosPerfil.country;
//       document.getElementById('edad').textContent = datosPerfil.age;
//       document.getElementById('estudios').textContent = datosPerfil.university;
//       document.getElementById('idiomas').textContent = datosPerfil.languages;
//       document.getElementById('linkedin').textContent = datosPerfil.linkedin;
//       document.getElementById('hobbies').textContent = datosPerfil.hobbies;
//     })
//     .catch(function (error) {
//       console.error('Error al recuperar los datos del perfil:', error);
//     });
// };


// //////////////////////////////////////////////////////////////////////////////////////////////////////
// // Agregar funcion de eliminar cuenta

// document.getElementById('eliminar-cuenta').addEventListener('click', function () {
//   fetch('http://localhost:4000/eliminar-cuenta', {
//     method: 'DELETE',
//   })
//     .then(function (response) {
//       if (!response.ok) {
//         throw Error(response.statusText);
//       }
//       return response.text();
//     })
//     .then(function (text) {
//       console.log(text);
//       window.location.href = '/index.html'; // Redireccionar a la página de inicio de sesión
//     })
//     .catch(function (error) {
//       console.error('Error al eliminar la cuenta:', error);
//     });
// });
