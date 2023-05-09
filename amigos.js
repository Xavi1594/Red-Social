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

    amigoCard.appendChild(detalles);

    amigosContainer.appendChild(amigoCard);
  });
}
