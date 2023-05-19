function validarLogin() {
  const usernameOrEmail = document.getElementById('nombre-de-usuario-o-correo').value;
  const password = document.getElementById('contraseña').value;

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const response = this.responseText;
        const parsedResponse = JSON.parse(response);
        if (parsedResponse.error) {
          document.getElementById('mensaje-de-error').innerHTML = parsedResponse.message;
        } else {
          window.location.href = '/dashboard.html';
        }
      } else {
        document.getElementById('mensaje-de-error').innerHTML = 'Ha ocurrido un error en el servidor';
      }
    }
  };
  xhr.open('POST', 'http://localhost:4000/login', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(`username=${encodeURIComponent(usernameOrEmail)}&password=${encodeURIComponent(password)}`);
}
