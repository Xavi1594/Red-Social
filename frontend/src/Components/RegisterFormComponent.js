import React, { useState } from 'react';


export const RegisterFormComponent = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        fullname: '',
        city: '',
        country: '',
        age: '',
        university: '',
        languages: '',
        linkedin: '',
        hobbies: '',
        extraknowledge: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            username,
            password,
            confirmPassword,
            email,
            fullname,
            city,
            country,
            age,
            university,
            languages,
            linkedin,
            hobbies,
            extraknowledge
        } = formData;

        const regexEmail = /^\S+@\S+\.\S+$/;
        const regexLinkedIn = /^(https?:\/\/)?([\w\d]+\.)?linkedin\.com\/.+$/;
        const regexname = /^[a-zA-Z\u00f1\u00d1\u00e7\u00c7\s]+$/;

        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            setError(true);
            return;
        }

        if (password.length < 6 || password.length > 16) {
            setMessage('La contraseña debe tener entre 6 y 16 caracteres');
            setError(true);
            return;
        }

        if (hobbies.length > 300) {
            setMessage('El campo Hobbies no puede superar los 300 caracteres');
            setError(true);
            return
        }

        if (extraknowledge.length > 300) {
            setMessage('El campo Conocimientos extra no puede superar los 300 caracteres');
            setError(true);
            return
        }

        if (age < 16) {
            setMessage('No tiene edad suficiente para acceder a este sitio web');
            setError(true);
            return;
        }

        if (!regexEmail.test(email)) {
            setMessage('Ingrese un correo electrónico válido');
            setError(true);
            return;
        }

        if (linkedin && !regexLinkedIn.test(linkedin)) {
            setMessage('Ingrese una URL de LinkedIn válida');
            setError(true);
            return;
        }

        if (!regexname.test(fullname)) {
            setMessage('Ingrese un nombre válido (solo letras)');
            setError(true);
            return;
        }

        if (!regexname.test(city)) {
            setMessage('Ingrese una ciudad válida (solo letras)');
            setError(true);
            return;
        }

        if (!regexname.test(country)) {
            setMessage('Ingrese un país válido (solo letras)');
            setError(true);
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
            extraknowledge
        };

        try {
            const response = await fetch('http://localhost:3000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            console.log(formData.extraknowledge);
            if (response.ok) {
                setMessage(responseData.message);
                setError(false);
            } else {
                setMessage(responseData.message);
                setError(true);
            }

            setTimeout(function () {
                window.location.href = "/";
            }, 2000);

        } catch (error) {
            setMessage('Ha ocurrido un error en el servidor. Por favor, intenta más tarde.');
            setError(true);
        }
    };


    return (
        <div className="container formulario mb-2 mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 mt-5">
                    <h2 className="text-center text-bg-warning p-3 mt-2">Formulario de Registro</h2>
                    <form className="form-registro p-3" id="form-registro" onSubmit={handleSubmit}>
                        {message && <div className={error ? 'error' : 'success'}>{message}</div>}
                        <div className="form-group">
                            <label htmlFor="username">Nombre de usuario</label>
                            <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input type="password" className="form-control" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">E-Mail</label>
                            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fullname">Nombre completo</label>
                            <input type="text" className="form-control" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">País de residencia</label>
                            <input type="text" className="form-control" id="country" name="country" value={formData.country} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Ciudad de residencia</label>
                            <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Edad</label>
                            <input type="number" className="form-control" id="age" name="age" value={formData.age} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="university">Estudios (Universitarios y certificaciones)</label>
                            <textarea className="form-control" id="university" rows="3" name="university" value={formData.university} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="languages">Idiomas</label>
                            <input type="text" className="form-control" id="languages" name="languages" value={formData.languages} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="linkedin">Perfil de LinkedIn</label>
                            <input type="text" className="form-control" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hobbies">Hobbies</label>
                            <textarea className="form-control" id="hobbies" rows="3" name="hobbies" value={formData.hobbies} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="extraknowledge">Conocimientos extra</label>
                            <textarea className="form-control" id="extraknowledge" rows="3" name="extraknowledge" value={formData.extraknowledge} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-3">Registrarse</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterFormComponent;


