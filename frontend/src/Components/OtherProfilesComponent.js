import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const OtherProfilesComponent = () => {
  const [profileData, setProfileData] = useState("");
  const { userId } = useParams();
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    cargarPerfilUsuario(userId);
    cargarFeedbackList(userId);
  }, [userId]);

  const cargarPerfilUsuario = (userId) => {
    fetch(`http://localhost:3000/amigos/${userId}`, { credentials: "include" })
      .then((response) => {
        if (response.ok) {
          console.log(response);
          return response.json();
        }
        throw new Error("No se pudo obtener el perfil del usuario");
      })
      .then((profileData) => {
        console.log(profileData);
        console.log(profileData.user_img);
        setProfileData(profileData);
      })
      .catch((error) => {
        console.error("Ha ocurrido un error:", error.message);
      });
  };

  const cargarFeedbackList = (userId) => {
    fetch(`http://localhost:3000/feedback/${userId}`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("No se pudo obtener la lista de feedback");
      })
      .then((feedbackList) => {
        setFeedbackList(feedbackList);
      })
      .catch((error) => {
        console.error("Ha ocurrido un error:", error.message);
      });
  };

  const enviarFeedback = () => {
    const idReceiver = userId;
    const idUser = obtenerIdUsuarioLogeado();
    const data = { idReceiver, idUser, feedback };

    fetch("http://localhost:3000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Feedback enviado correctamente");
          setFeedback("");
          cargarFeedbackList(userId);
        } else {
          throw new Error("No se pudo enviar el feedback");
        }
      })
      .catch((error) => {
        console.error("Ha ocurrido un error:", error.message);
      });
  };

  const obtenerIdUsuarioLogeado = () => {
    const idUsuarioLogeado = sessionStorage.getItem("userId");
    return idUsuarioLogeado;
  };

  if (!profileData) {
    return <div>Cargando perfil del usuario...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="col-6 col-md-4">
        <img
          src={profileData.user_img}
          className="img-fluid rounded mt-3"
          style={{ width: "260px", height: "220px" }}
          alt="Foto de perfil"
        />
      </div>
      <h2>Perfil de Usuario</h2>
      <p>
        <b>Nombre de usuario:</b> {profileData.username}
      </p>
      <p>
        <b>Email:</b> {profileData.email}
      </p>
      <p>
        <b>Nombre completo:</b> {profileData.fullname}
      </p>
      <p>
        <b>Ciudad:</b> {profileData.city}
      </p>
      <p>
        <b>País:</b> {profileData.country}
      </p>
      <p>
        <b>Edad:</b> {profileData.age}
      </p>
      <p>
        <b>Universidad:</b> {profileData.university}
      </p>
      <p>
        <b>
          <span className="font-weight-bold">Lenguajes:</span>{" "}
          {profileData.languages}
        </b>
      </p>
      <p>
        <b>LinkedIn:</b> {profileData.linkedin}
      </p>
      <p>
        <b>Hobbies:</b> {profileData.hobbies}
      </p>
      <p>
        <b>Conocimientos extra:</b> {profileData.extraknowledge}
      </p>

      <div>
        <h3>Dejar Feedback y Recomendaciones</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Escribe tu feedback y recomendaciones..."
          className="form-control"
        ></textarea>
        <button onClick={enviarFeedback} className="btn btn-primary mt-2">
          Enviar Feedback
        </button>
      </div>

      <div>
        <h3>Feedbacks y Recomendaciones dejados</h3>
        {feedbackList.length > 0 ? (
          <ul>
            {feedbackList.map((feedbackItem) => (
              <li key={feedbackItem.id}>
                {feedbackItem.feedback} - {feedbackItem.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron feedback</p>
        )}
      </div>
    </div>
  );
};
