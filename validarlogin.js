function validarLogin() {
  const usuario = document.getElementById('nombre-de-usuario-o-correo').value;
  const password = document.getElementById('contraseña').value;

  // Realizar solicitud POST al servidor para verificar la autenticación
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, password }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      if (data.autenticado) {
        // Si el inicio de sesión es exitoso, redireccionar a la página de dashboard
        window.location.href = './dashboard.html';
      } else {
        // Mostrar mensaje de error en caso contrario
        document.getElementById('mensaje-de-error').innerText = data.mensaje;
      }
    })
    .catch(error => console.error(error));
}
