import React, { useEffect, useState } from 'react';

export const UsuariosComponent = () => {
  const [csvUrl, setCsvUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3000/usuarioadmin', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status !== 200) {
          console.error('Error al obtener los usuarios');
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
  }, []);

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  return (
    <div>
      <h2>Listado de Usuarios</h2>
      <button onClick={() => window.open(csvUrl)}>Descargar CSV</button>
    </div>
  );
};
