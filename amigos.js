function mostrarAmigos(amigos) {
  var amigosContainer = document.getElementById('amigos');
  amigosContainer.innerHTML = '';

  amigos.forEach(function (amigo) {
    var amigoCard = document.createElement('div');
    amigoCard.classList.add('amigo-card');

    var nombreUsuario = document.createElement('h2');
    nombreUsuario.classList.add('nombre-usuario');
    nombreUsuario.innerHTML = '<strong>' + amigo.username + '</strong>';
    amigoCard.appendChild(nombreUsuario);

    var detalles = document.createElement('div');
    detalles.classList.add('detalles');

    var nombreCompleto = document.createElement('p');
    nombreCompleto.classList.add('nombre-completo');
    nombreCompleto.innerHTML = amigo.fullname;
    detalles.appendChild(nombreCompleto);

    var edad = document.createElement('p');
    edad.classList.add('edad');
    edad.innerHTML = amigo.age + ' años';
    detalles.appendChild(edad);

    var pais = document.createElement('p');
    pais.classList.add('pais');
    pais.innerHTML = amigo.country;
    detalles.appendChild(pais);

    var agregarAmigoBtn = document.createElement('button');
    agregarAmigoBtn.classList.add('btn');
    agregarAmigoBtn.innerHTML = 'Agregar amigo';
    agregarAmigoBtn.addEventListener('click', function () {
      agregarAmigo(usuarioLogueado.id, amigo.id);
      agregarAmigoBtn.disabled = true;
      agregarAmigoBtn.innerHTML = 'Amigo agregado';
    });
    detalles.appendChild(agregarAmigoBtn);

    var eliminarAmigoBtn = document.createElement('button');
    eliminarAmigoBtn.classList.add('btn');
    eliminarAmigoBtn.innerHTML = 'Eliminar amigo';
    eliminarAmigoBtn.addEventListener('click', function () {
      eliminarAmigo(amigo.id);
      agregarAmigoBtn.disabled = false;
      agregarAmigoBtn.innerHTML = 'Agregar amigo';
      eliminarAmigoBtn.disabled = true;
      alert('Amigo eliminado con éxito');
    });
    detalles.appendChild(eliminarAmigoBtn);
    eliminarAmigoBtn.disabled = true;

    amigoCard.appendChild(detalles);

    amigosContainer.appendChild(amigoCard);
  });
}


fetch('http://localhost:4000/amigos', { credentials: 'include' })
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    throw new Error('No se pudo obtener la lista de amigos');
  })
  .then(function (amigos) {
    mostrarAmigos(amigos);
  })
  .catch(function (error) {
    console.log(response);
    console.log(usuarioLogueado);
    console.error('Ha ocurrido un error:', error.message);
  });

function agregarAmigo(idUsuarioLogueado, idAmigo) {
  fetch('http://localhost:4000/agregar-amigo', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amigo: idAmigo })
  })
    .then(function (response) {
      if (response.ok) {
        console.log('Amigo agregado con éxito');
      } else {
        throw new Error('No se pudo agregar el amigo');
      }
    })
    .catch(function (error) {
      console.error('Ha ocurrido un error:', error.message);
    });
}


function eliminarAmigo(idAmigo) {
  fetch('http://localhost:4000/eliminar-amigo', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amigo: idAmigo })
  })
    .then(function (response) {
      if (response.ok) {
        return response.text();
      }
      throw new Error('No se pudo eliminar el amigo');
    })
    .then(function (message) {
      console.log(message);
    })
    .catch(function (error) {
      console.error('Ha ocurrido un error:', error.message);
    });
}


