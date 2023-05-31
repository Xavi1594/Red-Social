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
        {loggedIn ? (
          <NavbarComponent loggedIn={loggedIn} onLogout={handleLogout} />
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
