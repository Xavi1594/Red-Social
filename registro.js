const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const profilePic = document.getElementById('profile-pic').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const email = document.getElementById('email').value;
    const fullName = document.getElementById('full-name').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const age = document.getElementById('age').value;
    const university = document.getElementById('university').value;
    const languages = document.getElementById('languages').value;
    const linkedinProfile = document.getElementById('linkedin-profile').value;
    const hobbies = document.getElementById('hobbies').value;
    const termsAndConditions = document.getElementById('terms-and-conditions').checked;

    // Validar la contraseña y confirmar la contraseña
        if (password !== confirmPassword) {
            document.getElementById('confirm-password').setCustomValidity('Las contraseñas no coinciden');
            const errorElement = document.getElementById('confirm-password-error');
            errorElement.innerHTML = 'Las contraseñas no coinciden';
        } else {
            document.getElementById('confirm-password').setCustomValidity('');
        }

        // Validar la edad
        if (isNaN(age) || age === '') {
            document.getElementById('age').setCustomValidity('Ingrese una edad válida');
            const errorElement = document.getElementById('edad-error');
            errorElement.innerHTML = 'La edad ingresada no es válida';
        } else {
            document.getElementById('age').setCustomValidity('');
        }

        // Validar el correo electrónico
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email').setCustomValidity('Ingrese un correo electrónico válido');
            const errorElement = document.getElementById('email-error');
            errorElement.innerHTML = 'El email ingresado no es válido';
        } else {
            document.getElementById('email').setCustomValidity('');
        }

        //Valkidar perfil de Linkedin
        const linkedinRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i;;
        if (!linkedinRegex.test(linkedinProfile)) {
            document.getElementById('linkedin-profile').setCustomValidity('Ingrese un URL válido');
            const errorElement = document.getElementById('linkedin-error');
            errorElement.innerHTML = 'El URL ingresado no es válido';
        } else {
            document.getElementById('linkedin-profile').setCustomValidity('');
        }

        // Validar la aceptación de términos y condiciones
        if (!termsAndConditions) {
            document.getElementById('terms-and-conditions').setCustomValidity('Debe aceptar los términos y condiciones');
            const errorElement = document.getElementById('terms-error');
            errorElement.innerHTML = 'Debe aceptar los términos y condiciones';
        } else {
            document.getElementById('terms-and-conditions').setCustomValidity('');
        }
    
    // Si todos los campos son válidos, guardar la cuenta localmente
    if (document.getElementById('profile-pic').checkValidity() &&
        document.getElementById('username').checkValidity() &&
        document.getElementById('confirm-password').checkValidity() &&
        document.getElementById('email').checkValidity() &&
        document.getElementById('full-name').checkValidity() &&
        document.getElementById('country').checkValidity() &&
        document.getElementById('city').checkValidity() &&
        document.getElementById('age').checkValidity() &&
        document.getElementById('university').checkValidity() &&
        document.getElementById('languages').checkValidity() &&
        document.getElementById('linkedin-profile').checkValidity() &&
        document.getElementById('hobbies').checkValidity() &&
        termsAndConditions) {

        const account = {
            profilePic: profilePic,
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            country: country,
            city: city,
            age: age,
            university: university,
            languages: languages,
            linkedinProfile: linkedinProfile,
            hobbies: hobbies
        };

        // Guardar la cuenta localmente en el almacenamiento del navegador
        localStorage.setItem('account', JSON.stringify(account));

        // Redirigir a la página de inicio de sesión
        window.location.href = 'index.html';
    }
});
