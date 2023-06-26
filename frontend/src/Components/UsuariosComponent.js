import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UsuariosComponent = () => {
  const [csvUrl, setCsvUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Para redirigir al usuario a otra ruta
  
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3000/usuarioadmin', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status !== 200) {
          if (response.status === 403) {
            
            alert('No tienes permiso para acceder a esta función');
            navigate('/posts');
          } else {
            console.error('Error al obtener los usuarios');
          }
          return;
        }

        const data = await response.json();

        if (data && data.url) {
          console.log('URL del archivo CSV:', data.url);
          setCsvUrl(data.url);
        } else {
          console.error('Los datos de usuarios no son válidos:', data);
        }
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [navigate]);

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center flex-column align-items-center">
        <h2 className="mb-4">Listado de Usuarios</h2>
        <button className="btn btn-success" onClick={() => window.open(csvUrl)}>Descargar CSV</button>
      </div>
    </div>
  );
}
