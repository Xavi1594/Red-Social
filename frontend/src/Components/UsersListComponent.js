import React, { useState, useEffect } from 'react';

export const UsersListComponent = () => {
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Verifica si el usuario es administrador antes de obtener la lista de usuarios
        fetch('http://localhost:3000/usuarios/isadmin', { credentials: 'include' })
            .then((response) => response.json())
            .then((data) => {
                setIsAdmin(data.isAdmin);

                // Si el usuario es administrador, realiza la solicitud para obtener la lista de usuarios
                if (data.isAdmin) {
                    fetch('http://localhost:3000/amigos/registrados')
                        .then((response) => response.json())
                        .then((data) => setUsers(data))
                        .catch((error) => console.error('Error al obtener la lista de usuarios:', error));
                }
            })
            .catch((error) => console.error('Error al verificar si el usuario es administrador:', error));
    }, []);

    return (
        <div>
            <h1>Usuarios Registrados</h1>
            {isAdmin ? (
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
            ) : (
                <p>No tienes privilegios de administrador para ver la lista de usuarios.</p>
            )}
        </div>
    );
};

