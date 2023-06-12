import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { NavbarComponent } from '../Components/NavbarComponent';
import { FooterComponent } from '../Components/FooterComponent';
import { RegisterFormComponent } from '../Components/RegisterFormComponent';
import { ProfileComponent } from '../Components/ProfileComponent';
import { LoginFormComponent } from '../Components/LoginFormComponent';
import { FriendsComponent } from '../Components/FriendsComponent';
import { PostComponent } from '../Components/PostComponent';
import { NotLoggedNavbarComponent } from '../Components/NotLoggedNavbarComponent';
import FriendsAddedComponent from '../Components/FriendsAddedComponent';
import { OtherProfilesComponent } from '../Components/OtherProfilesComponent';
import { UsuariosComponent } from '../Components/UsuariosComponent';

export const RouterPrincipal = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('token');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (token, isAdmin) => {
    localStorage.setItem('token', token);
    setToken(token);
    setLoggedIn(true);
    setIsAdmin(isAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <div>
      <BrowserRouter>
        {loggedIn ? (
          <NavbarComponent loggedIn={loggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
        ) : (
          <NotLoggedNavbarComponent onLogout={handleLogout} />
        )}
        <Routes>
          <Route path="/" element={<LoginFormComponent onLogin={handleLogin} />} />
          <Route path="/registro" element={<RegisterFormComponent />} />
          <Route path="/perfil" element={<ProfileComponent loggedIn={loggedIn} />} />
          <Route path="/amigos" element={<FriendsComponent />} />
          <Route path="/amigosagregados" element={<FriendsAddedComponent />} />
          {loggedIn && (
            <Route path="/posts" element={<PostComponent loggedIn={loggedIn} />} />
          )}
          <Route
            path="/amigos/:userId"
            element={<OtherProfilesComponent loggedIn={loggedIn} />}
          />
          
            <Route path="/usuarios" element={<UsuariosComponent />} />
        
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </div>
  );
};
