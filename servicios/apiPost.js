// posts.js
async function fetchPosts() {
  try {
    const response = await fetch('http://localhost:4000/post');
    const posts = await response.json();

    console.log('Respuesta del servidor:', posts); // Agrega esta línea

    displayPosts(posts);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
  }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('posts-container');

  posts.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    const titleElement = document.createElement('h2');
    titleElement.textContent = post.title;

    const contentElement = document.createElement('p');
    contentElement.textContent = post.content;

    postElement.appendChild(titleElement);
    postElement.appendChild(contentElement);

    postsContainer.appendChild(postElement);
  });
}

fetchPosts();
