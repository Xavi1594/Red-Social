import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export const UsuariosComponent = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3000/lista', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const exportToExcel = (data, filename, fields) => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: fields });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
    XLSX.writeFile(workbook, filename);
  };

  const handleDownloadExcel = () => {
    exportToExcel(usuarios, 'usuarios.xlsx', ['id', 'username', 'email']);
  };

  return (
    <div>
      <h2>Listado de Usuarios</h2>
      <button onClick={handleDownloadExcel}>Descargar en Excel</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
