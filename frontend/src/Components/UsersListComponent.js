import React, { useState, useEffect } from 'react';

export const UsersListComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Realiza una solicitud al backend para obtener la lista de usuarios registrados
    fetch('http://localhost:3000/usuarios/registrados') 
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error al obtener la lista de usuarios:', error));
  }, []);

  return (
    <div>
      <h1>Usuarios Registrados</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>Username: {user.username}</p>
            <p>Password: {user.password}</p>
            <p>Email: {user.email}</p>
            <p>Fullname: {user.fullname}</p>
            <p>City: {user.city}</p>
            <p>Country: {user.country}</p>
            <p>Age: {user.age}</p>
            <p>University: {user.university}</p>
            <p>Languages: {user.languages}</p>
            <p>LinkedIn: {user.linkedin}</p>
            <p>Hobbies: {user.hobbies}</p>
            <p>Extra Knowledge: {user.extraknowledge}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
