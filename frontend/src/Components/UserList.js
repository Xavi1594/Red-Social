import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const UserList = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      // Obtener el token y verificar si el usuario es administrador
      const token = localStorage.getItem('token');
  
      if (token) {
        getUsers();
      }
    }, []);
  
    const getUsers = async () => {
      const token = localStorage.getItem('token');
  
      try {
        const response = await fetch('http://localhost:3000/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener la lista de usuarios');
        }
  
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelData, 'usuarios.xlsx');
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <button onClick={exportToExcel}>Exportar a Excel</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};
