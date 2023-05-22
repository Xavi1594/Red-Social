import React, { useEffect, useState } from 'react';

export const PostComponent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (event) => {
    event.preventDefault();

    const post = { title, content };

    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        const json = await response.json();
        // Guardar el ID en el localStorage
        localStorage.setItem('postId', json.id);

        setTitle('');
        setContent('');
        await fetchPosts();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al crear el post:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      const posts = await response.json();
      setPosts(posts);
    } catch (error) {
      console.error('Error al obtener los posts:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPosts();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  };

  const editPost = async (postId, updatedTitle, updatedContent) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTitle,
          content: updatedContent,
        }),
      });

      if (response.ok) {
        await fetchPosts();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al editar el post:', error);
    }
  };

  return (
    <main className="container">
      <div className="row">
        <div className="col-12 col-lg-3 mt-5">
          <div className="accordion mt-5" id="accordionExample">
            {/* Contenido del panel izquierdo (si es necesario) */}
          </div>
        </div>
        <div className="col-12 col-lg-6 mt-5">
          <div className="card mt-5 py-2">
            <form id="new-post-form" onSubmit={createPost}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="new-post-title"
                  placeholder="Título del post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  id="new-post-content"
                  rows="3"
                  placeholder="Contenido del post"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Publicar
              </button>
            </form>

            <div className="mb-4" id="posts-container">
              {posts.map((post, index) => (
                <div key={index} className="post card mb-3">
                  <h2 className="card-header">{post.title}</h2>
                  <p className="card-body">{post.content}</p>
                  <div className="card-footer">
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={() => editPost(post.id, 'Nuevo título', 'Nuevo contenido')}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deletePost(post.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-3 mt-5"></div>
      </div>
    </main>
  );
};
