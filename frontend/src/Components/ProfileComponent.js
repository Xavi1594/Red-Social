import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProfileComponent = ({ loggedIn }) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    fullname: "",
    city: "",
    country: "",
    age: "",
    university: "",
    languages: "",
    linkedin: "",
    hobbies: "",
    extraknowledge: "",
    user_img: "",
  });
  const [originalProfileData, setOriginalProfileData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
      return;
    }

    fetch("http://localhost:3000/perfil", { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProfileData(data);
        setOriginalProfileData(data);
      })
      .catch((error) => {
        console.error("Error al recuperar los datos del perfil:", error);
      });
  }, [loggedIn, navigate]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (!validateFields()) {
      return;
    }
  
    fetch("http://localhost:3000/perfil", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
        setIsEditMode(false);
        setOriginalProfileData(profileData);
      })
      .catch((error) => {
        console.error("Error al guardar los cambios del perfil:", error);
      });
  };
  
  const handleCancel = () => {
    setProfileData(originalProfileData);
    setIsEditMode(false);
    setErrorMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const validateFields = () => {
    return true;
  };

  return (
    <div className="container my-5">
      {loggedIn ? (
        <>
 <div className="row justify-content-center">
  <div className="col-6 col-md-4">
    <img
      src={profileData.user_img}
      className="img-fluid rounded mt-3"
      style={{ width: "260px", height: "220px" }}
      width="200"
      alt="Foto de perfil"
    />
    {isEditMode && (
      <div className="form-group">
        <label htmlFor="profile-image-url">URL de la foto de perfil:</label>
        <input
          type="text"
          id="profile-image-url"
          name="user_img"
          value={profileData.user_img}
          onChange={handleChange}
          className="form-control"
        />
      </div>
    )}
  </div>
</div>


       

          <div className="row my-3">
            <div className="col-12">
              <p className="font-weight-bold">
                <b>Nombre de usuario:</b>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.username}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>E-Mail:</b>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.email}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Nombre completo:</b>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    name="fullname"
                    value={profileData.fullname}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.fullname}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Pais de residencia:</b>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    name="country"
                    value={profileData.country}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.country}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Ciudad de residencia:</b>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.city}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Edad:</b>{" "}
                {isEditMode ? (
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.age}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Estudios:</b>{" "}
                {isEditMode ? (
                  <input
                    type="textbox"
                    name="university"
                    value={profileData.university}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.university}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Idiomas:</b>{" "}
                {isEditMode ? (
                  <input
                    type="textbox"
                    name="languages"
                    value={profileData.languages}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.languages}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Perfil de LinkedIn:</b>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.linkedin}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Hobbies:</b>{" "}
                {isEditMode ? (
                  <textarea
                    name="hobbies"
                    value={profileData.hobbies}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.hobbies}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              <p>
                <b>Conocimientos extra:</b>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    name="extraknowledge"
                    value={profileData.extraknowledge}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <span>{profileData.extraknowledge}</span>
                )}
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12">
              {isEditMode ? (
                <>
                  <button className="btn btn-primary mr-2" onClick={handleSave}>
                    Guardar
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancelar
                  </button>
                </>
              ) : (
                <button className="btn btn-primary w-25" onClick={handleEdit}>
                  Editar
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>No se ha iniciado sesión</p>
      )}
    </div>
  );
};
