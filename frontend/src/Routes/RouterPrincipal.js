import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { NavbarComponent } from '../Components/NavbarComponent';
import { FooterComponent } from '../Components/FooterComponent';
import { RegisterFormComponent } from '../Components/RegisterFormComponent';
import { ProfileComponent } from '../Components/ProfileComponent';
import { LoginFormComponent } from '../Components/LoginFormComponent';
import { FriendsComponent } from '../Components/FriendsComponent';
import { PostComponent } from '../Components/PostComponent';

export const RouterPrincipal = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <div>
      <BrowserRouter>
        <NavbarComponent loggedIn={loggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LoginFormComponent onLogin={handleLogin} />} />
          <Route path="/registro" element={<RegisterFormComponent />} />
          <Route path="/perfil" element={<ProfileComponent loggedIn={loggedIn} />} />
          <Route path="/amigos" element={<FriendsComponent />} />
          <Route path="/posts" element={<PostComponent />} />
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </div>
  );
};
