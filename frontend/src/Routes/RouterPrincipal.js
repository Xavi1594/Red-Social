import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
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
import { UsuariosComponent } from '../Components/UsuariosComponent';

export const RouterPrincipal = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('isAdmin'));

  const handleLogin = () => {
    setLoggedIn(true);
    setIsAdmin(!!localStorage.getItem('isAdmin'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
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
          <Route path="/posts" element={<PostComponent loggedIn={loggedIn} />} />
          <Route path="/usuarios" element={<UsuariosComponent />} />
          <Route
            path="/amigos/:userId"
            element={<OtherProfilesComponent loggedIn={loggedIn} />}
          />
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </div>
  );
};
