function mostrarUsuariosRegistrados(usuarios) {
  var registradosSection = document.querySelector('.registrados-section');
  registradosSection.innerHTML = '';

  usuarios.forEach(function (usuario) {
    var usuarioCard = document.createElement('div');
    usuarioCard.classList.add('usuario-card', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mx-auto');

    var nombreUsuario = document.createElement('h2');
    nombreUsuario.classList.add('nombre-usuario');
    nombreUsuario.innerHTML = '<strong>' + usuario.username + '</strong>';
    usuarioCard.appendChild(nombreUsuario);

    var detalles = document.createElement('div');
    detalles.classList.add('detalles');

    var nombreCompleto = document.createElement('p');
    nombreCompleto.classList.add('nombre-completo');
    nombreCompleto.innerHTML = usuario.fullname;
    detalles.appendChild(nombreCompleto);

    var edad = document.createElement('p');
    edad.classList.add('edad');
    edad.innerHTML = usuario.age + ' años';
    detalles.appendChild(edad);

    var pais = document.createElement('p');
    pais.classList.add('pais');
    pais.innerHTML = usuario.country;
    detalles.appendChild(pais);

    // Verificar si el usuario actual es amigo del usuario en el bucle
    var agregarAmigoBtn = document.createElement('button');
    agregarAmigoBtn.classList.add('btn');
    agregarAmigoBtn.innerHTML = 'Agregar amigo';
    agregarAmigoBtn.addEventListener('click', function () {
      agregarAmigo(usuario.id, usuario.nombre);
      agregarAmigoBtn.disabled = true;
      agregarAmigoBtn.innerHTML = 'Ya son amigos';
      alert('Amigo agregado con éxito');
    });

    // Verificar si el usuario actual es amigo del usuario en el bucle
    if (!usuario.amigo) {
      detalles.appendChild(agregarAmigoBtn);
    }

    usuarioCard.appendChild(detalles);
    registradosSection.appendChild(usuarioCard);
  });
}

function cargarUsuariosRegistrados(usuarioLogueadoId) {
  fetch('http://localhost:4000/usuarios/registrados', { credentials: 'include' })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('No se pudo obtener la lista de usuarios registrados');
    })
    .then(function (usuariosRegistrados) {
      mostrarUsuariosRegistrados(usuariosRegistrados);
    })
    .catch(function (error) {
      console.error('Ha ocurrido un error:', error.message);
    });
}

window.addEventListener('load', function () {
  cargarUsuariosRegistrados();
});

function agregarAmigo(idAmigo) {
  fetch(`http://localhost:4000/amigos/agregar/${idAmigo}`, {
    method: 'POST',
    credentials: 'include'
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('No se pudo agregar al amigo');
    })
    .then(function (amigo) {
      cargarUsuariosRegistrados();
      alert('Amigo agregado con éxito');
    })
    .catch(function (error) {
      console.error('Ha ocurrido un error:', error.message);
    });
}

function eliminarAmigo(idAmigo) {
  fetch(`http://localhost:4000/amigos/eliminar/${idAmigo}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('No se pudo eliminar al amigo');
    })
    .then(function (amigo) {
      cargarUsuariosRegistrados();
      alert('Amigo eliminado con éxito');
    })
    .catch(function (error) {
      console.error('Ha ocurrido un error:', error.message);
    });
}
