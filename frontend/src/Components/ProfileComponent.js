import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileComponent = ({ loggedIn }) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    fullname: '',
    city: '',
    country: '',
    age: '',
    university: '',
    languages: '',
    linkedin: '',
    hobbies: '',
    extraknowledge: '',
  });

  useEffect(() => {
    if (!loggedIn) {
      navigate('/'); // Redirigir a la página de inicio si no se ha iniciado sesión
      return;
    }

    fetch('http://localhost:3000/perfil', { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.error('Error al recuperar los datos del perfil:', error);
      });
  }, [loggedIn, navigate]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    fetch('http://localhost:3000/perfil', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        console.log(text);
        setIsEditMode(false);
      })
      .catch((error) => {
        console.error('Error al guardar los cambios del perfil:', error);
      });
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container my-5">
      {loggedIn ? (
        <>
          <div className="row justify-content-center">
            <div className="col-6 col-md-4">
              <img
                src="./img/2021031202544061e0e3f25c3041f849de6b510817fb34.jpg"
                className="img-fluid rounded-circle mt-3"
                width="200"
                alt="Foto de perfil"
              />
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Nombre de usuario:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.username}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">E-Mail:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="text"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.email}</p>
              )}
            </div>
          </div>


          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Nombre completo:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="text"
                  name="fullname"
                  value={profileData.fullname}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.fullname}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Pais de residencia:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.country}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Ciudad de residencia:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.city}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Edad:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.age}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Estudios:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="textbox"
                  name="university"
                  value={profileData.university}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.university}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Idiomas:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="textbox"
                  name="languages"
                  value={profileData.languages}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.languages}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Perfil de LinkedIn:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="text"
                  name="linkedin"
                  value={profileData.linkedin}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.linkedin}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Hobbies:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="textarea"
                  name="hobbies"
                  value={profileData.hobbies}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.hobbies}</p>
              )}
            </div>
          </div>

          <div className="row my-3">
<<<<<<< HEAD
            <div className="col-3 col-md-2 text-muted">Conocimientos extra:</div>
            <div className="col-9 col-md-10">
              {isEditMode ? (
                <input
                  type="text"
                  name="extraknowledge"
                  value={profileData.extraknowledge}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.extraknowledge}</p>
              )}
            </div>
          </div>

          {isEditMode ? (
            <>
              <button onClick={handleSave}>Guardar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </>
          ) : (
            <button onClick={handleEdit}>Editar</button>
          )}
=======
            <div className="col-3 col-md-2 text-muted">Conocimiento extra</div>
            <div className="col-9 col-md-10">
              <p>{datosPerfil.extraknowledge}</p>
            </div>
          </div>
          <button id="eliminar-cuenta" onClick={handleEliminarCuenta}>
            Eliminar cuenta
          </button>
          <p id="mensaje-confirmacion" className="oculto">
            La cuenta ha sido eliminada exitosamente.
          </p>
>>>>>>> 98ed59807a29bef60112c033596e73ecabde935d
        </>
      ) : (
        <p>No se ha iniciado sesión</p>
      )}
    </div>
  );
};
