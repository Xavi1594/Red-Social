const registroForm = document.querySelector('#form-registro');
const errorDiv = document.querySelector('.error');
const successDiv = document.querySelector('.success');

const regexEmail = /^\S+@\S+\.\S+$/; // Expresión regular para validar el formato de email
const regexLinkedIn = /^(https?:\/\/)?([\w\d]+\.)?linkedin\.com\/.+$/; // Expresión regular para validar el formato de LinkedIn URL

registroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form data
    const formData = new FormData(registroForm);
    const username = formData.get('username');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    const email = formData.get('email');
    const fullname = formData.get('fullname');
    const city = formData.get('city');
    const country = formData.get('country');
    const age = formData.get('age');
    const university = formData.get('university');
    const languages = formData.get('languages');
    const linkedin = formData.get('linkedin');
    const hobbies = formData.get('hobbies');
    const terms = formData.get('terms');

    // Validations
    if (password !== confirmPassword) {
        errorDiv.innerHTML = 'Las contraseñas no coinciden';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (password.length < 6 || password.length > 16) {
        errorDiv.innerHTML = 'La contraseña debe tener entre 6 y 16 caracteres';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (age < 16) {
        errorDiv.innerHTML = 'No tiene edad suficiente para acceder a este sitio web';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (age >= 120) {
        errorDiv.innerHTML = 'Ingrese una edad valida';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (!regexEmail.test(email)) {
        errorDiv.innerHTML = 'Ingrese un correo electrónico válido';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (linkedin && !regexLinkedIn.test(linkedin)) {
        errorDiv.innerHTML = 'Ingrese una URL de LinkedIn válida';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (!terms) {
        errorDiv.innerHTML = 'Debe aceptar los términos y condiciones';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(fullname)) {
        errorDiv.innerHTML = 'Ingrese un nombre válido (solo letras)';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(city)) {
        errorDiv.innerHTML = 'Ingrese una ciudad válida (solo letras)';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(country)) {
        errorDiv.innerHTML = 'Ingrese un pais válido (solo letras)';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    const data = {
        username,
        password,
        email,
        fullname,
        city,
        country,
        age,
        university,
        languages,
        linkedin,
        hobbies,
    };

    try {
        const response = await fetch('http://localhost:4000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            successDiv.innerHTML = responseData.message;
            errorDiv.style.display = 'none';
            successDiv.style.display = 'block';
        } else {
            errorDiv.innerHTML = responseData.message;
            successDiv.style.display = 'none';
            errorDiv.style.display = 'block';
        }

        // Redirigir a la página deseada después de un breve retraso (por ejemplo, 2 segundos)
        setTimeout(function () {
            window.location.href = "index.html";
        }, 2000);

    } catch (error) {
        errorDiv.innerHTML = 'Ha ocurrido un error en el servidor. Por favor, intenta más tarde.';
        successDiv.style.display = 'none';
        errorDiv.style.display = 'block';
    }
});
