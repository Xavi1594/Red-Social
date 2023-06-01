import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { NavbarComponent } from '../Components/NavbarComponent';
import { FooterComponent } from '../Components/FooterComponent';
import { RegisterFormComponent } from '../Components/RegisterFormComponent';
import { ProfileComponent } from '../Components/ProfileComponent';
import { LoginFormComponent } from '../Components/LoginFormComponent';
import { FriendsComponent } from '../Components/FriendsComponent';
import { PostComponent } from '../Components/PostComponent';
import { NotLoggedNavbarComponent } from '../Components/NotLoggedNavbarComponent';
import { FriendsAddedComponent } from '../Components/FriendsAddedComponent';
import { OtherProfilesComponent } from '../Components/OtherProfilesComponent';
import { UsersListComponent } from '../Components/UsersListComponent';

export const RouterPrincipal = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    // Aquí debes realizar la consulta a la base de datos para obtener los privilegios del usuario actual
    try {
      // Realiza la consulta a tu backend para obtener los privilegios del usuario actual
      const response = await fetch('/api/getUserPrivileges'); // Reemplaza '/api/getUserPrivileges' con la ruta correcta a tu backend

      if (response.ok) {
        const userPrivileges = await response.json();
        setIsAdmin(userPrivileges === 1);
      } else {
        // Error al obtener los privilegios del usuario
        console.error('Error al obtener los privilegios del usuario');
      }
    } catch (error) {
      console.error(error);
    }

    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  useEffect(() => {
    const checkLoggedIn = () => {
      setLoggedIn(!!localStorage.getItem('token'));
    };

    checkLoggedIn();
  }, []);

  return (
    <div>
      <BrowserRouter>
        {loggedIn ? (
          <NavbarComponent loggedIn={loggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
        ) : (
          <NotLoggedNavbarComponent onLogout={handleLogout} />
        )}
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? <Navigate to="/posts" /> : <LoginFormComponent onLogin={handleLogin} />
            }
          />
          <Route path="/registro" element={<RegisterFormComponent />} />
          <Route path="/perfil" element={<ProfileComponent loggedIn={loggedIn} />} />
          <Route path="/amigos" element={<FriendsComponent />} />
          <Route path="/amigosagregados" element={<FriendsAddedComponent />} />
          <Route path="/posts" element={<PostComponent loggedIn={loggedIn} />} />
          <Route path="/amigos/:userId" element={<OtherProfilesComponent />} />
          <Route
            path="/usuarios"
            element={loggedIn && isAdmin ? <UsersListComponent /> : <Navigate to="/" />}
          />
        </Routes>

        <FooterComponent />
      </BrowserRouter>
    </div>
  );
};
