document.getElementById('new-post-form').addEventListener('submit', createPost);

async function createPost(event) {
  event.preventDefault();

  const title = document.getElementById('new-post-title').value;
  const content = document.getElementById('new-post-content').value;

  const post = { title, content };
  console.log(post);

  try {
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    document.getElementById('new-post-title').value = '';
    document.getElementById('new-post-content').value = '';
    await fetchPosts();
  } catch (error) {
    console.error('Error al crear el post:', error);
  }
}

async function fetchPosts() {
  try {
    const response = await fetch('http://localhost:4000/post');
    const posts = await response.json();

    console.log('Respuesta del servidor:', posts); 
    displayPosts(posts);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
  }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('posts-container');

 
  postsContainer.innerHTML = '';

  posts.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.className = 'post card'; 

    const titleElement = document.createElement('h2');
    titleElement.textContent = post.title;
    titleElement.className = 'card-header'; 

    const contentElement = document.createElement('p');
    contentElement.textContent = post.content;
    contentElement.className = 'card-body'; 

    postElement.appendChild(titleElement);
    postElement.appendChild(contentElement);

    postsContainer.appendChild(postElement);
  });
}


fetchPosts();
