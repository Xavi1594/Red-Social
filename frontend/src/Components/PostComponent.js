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
      const response = await fetch('http://localhost:3000/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
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
      const response = await fetch('http://localhost:3000/post');
      const posts = await response.json();
      setPosts(posts);
    } catch (error) {
      console.error('Error al obtener los posts:', error);
    }
  };

  return (
    <main className="container">
      <div className="row">
        <div className="col-12 col-lg-3 mt-5 ">
        <div class="accordion mt-5" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                La copa del mundo ⚽
              </button>
          
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <strong>El campeón fue Argentina.</strong> liderada por Lionel Messi, que derrotó en la final por 4-2 en
                los penaltis a quien hasta entonces era la vigente campeona del mundo, Francia, luego de haber empatado
                3-3, siendo la cuarta selección del mundo que se consagra fuera de su continente y la segunda de
                Sudamérica en conseguirlo en Asia. De esta forma, se coronó campeona por tercera vez en su historia
                después de 36 años (la última ocasión había sido en México 1986).


              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                El metaverso 💻
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <strong>¿Qué es y cómo funciona el metaverso?</strong> ¿Qué es y cómo funciona el metaverso?
                En este caso es un nuevo ecosistema virtual y tridimensional (3D) en el que los usuarios pueden
                interactuar entre ellos, trabajar, jugar, estudiar, realizar transacciones económicas, entre muchas
                otras posibilidades. Todo ello de forma descentralizada.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Los bancos quiebran 📉
              </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse
                plugin adds the appropriate classes that we use to style each element. These classes control the overall
                appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go
                within the <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 mt-5 ">
          <div className="card mt-5 py-2 ">
            <form id="new-post-form" onSubmit={createPost}>
              <div className="form-group">
                <input type="text" className="form-control" id="new-post-title" placeholder="Título del post" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <textarea className="form-control" id="new-post-content" rows="3" placeholder="Contenido del post" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Publicar</button>
            </form>

            <div className="mb-4" id="posts-container">
              {posts.map((post, index) => (
                <div key={index} className="post card">
                  <h2 className="card-header">{post.title}</h2>
                  <p className="card-body">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-3 mt-5 ">
         
        </div>
      </div>
    </main>
  );
};


