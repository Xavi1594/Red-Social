import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const OtherProfilesComponent = () => {
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    cargarPerfilUsuario(userId);
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
    </div>
  );
};
