function validarLogin() {
  const usernameOrEmail = document.getElementById("nombre-de-usuario-o-correo").value;
  const password = document.getElementById("contraseña").value;

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = this.responseText;
      if (response.startsWith("Usuario o contraseña incorrectos")) {
        document.getElementById("mensaje-de-error").innerHTML = response;
      } else {
        window.location.href = "/dashboard.html";
      }
    }
  };
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(`username=${usernameOrEmail}&password=${password}`);
}
