import React from 'react';
import { Routes, Route, NavLink, BrowserRouter } from 'react-router-dom';
import { NavbarComponent } from '../Components/NavbarComponent';
import { FooterComponent } from '../Components/FooterComponent';
import { RegisterFormComponent }  from '../Components/RegisterFormComponent';
import { ProfileComponent } from '../Components/ProfileComponent';
import { LoginFormComponent } from '../Components/LoginFormComponent';
import { FriendsComponent } from '../Components/FriendsComponent';
import { PostComponent } from '../Components/PostComponent';

export const RouterPrincipal = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
   
          <Route path="/" element={<><NavbarComponent /><LoginFormComponent /><FooterComponent /></>} />
          <Route path="/registro" element={<><NavbarComponent /><RegisterFormComponent /><FooterComponent /></>} />
          <Route path="/perfil" element={<><NavbarComponent /><ProfileComponent /><FooterComponent /></>} />
          <Route path="/amigos" element={<><NavbarComponent /><FriendsComponent /><FooterComponent /></>} />
          <Route path="/posts" element={<><NavbarComponent /><PostComponent /><FooterComponent /></>} />

          

        </Routes>
      </BrowserRouter>
    </div>
  );
};
