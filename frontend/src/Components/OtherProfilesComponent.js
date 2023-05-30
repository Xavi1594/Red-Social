import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const OtherProfilesComponent = () => {
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const { userId } = useParams();
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    cargarPerfilUsuario(userId);
    cargarFeedbackList(userId);
  }, [userId]);

  const cargarPerfilUsuario = (userId) => {
    fetch(`http://localhost:3000/amigos/${userId}`, { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('No se pudo obtener el perfil del usuario');
      })
      .then((perfilUsuario) => {
        setPerfilUsuario(perfilUsuario);
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };

  const cargarFeedbackList = (userId) => {
    fetch(`http://localhost:3000/feedback/${userId}`, { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('No se pudo obtener la lista de feedback');
      })
      .then((feedbackList) => {
        setFeedbackList(feedbackList);
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };

  const enviarFeedback = () => {
    const idReceiver = userId;
    const idUser = obtenerIdUsuarioLogeado();
    const data = { idReceiver, idUser, feedback };

    fetch('http://localhost:3000/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          console.log('Feedback enviado correctamente');
          setFeedback(''); // Limpiar el campo de feedback después de enviarlo
          cargarFeedbackList(userId); // Actualizar la lista de feedback después de enviarlo
        } else {
          throw new Error('No se pudo enviar el feedback');
        }
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };

  const obtenerIdUsuarioLogeado = () => {
    const idUsuarioLogeado = sessionStorage.getItem('userId'); // Obtener el ID del usuario logeado del sessionStorage
    return idUsuarioLogeado;
  };

  if (!perfilUsuario) {
    return <div>Cargando perfil del usuario...</div>;
  }

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Nombre de usuario: {perfilUsuario.username}</p>
      <p>Email: {perfilUsuario.email}</p>
      <p>Nombre completo: {perfilUsuario.fullname}</p>
      <p>Ciudad: {perfilUsuario.city}</p>
      <p>País: {perfilUsuario.country}</p>
      <p>Edad: {perfilUsuario.age}</p>
      <p>Universidad: {perfilUsuario.university}</p>
      <p>Lenguajes: {perfilUsuario.languages}</p>
      <p>LinkedIn: {perfilUsuario.linkedin}</p>
      <p>Hobbies: {perfilUsuario.hobbies}</p>
      <p>Conocimientos extra: {perfilUsuario.extraknowledge}</p>

      <div>
        <h3>Dejar Feedback y Recomendaciones</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Escribe tu feedback y recomendaciones..."
        ></textarea>
        <button onClick={enviarFeedback}>Enviar Feedback</button>
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
