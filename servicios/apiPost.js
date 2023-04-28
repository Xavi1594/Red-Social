const commentsList = document.getElementById("comments-list");

// función para verificar si el usuario ya ha dado un like al comentario
function hasUserLikedComment(commentId) {
  const likedComments = JSON.parse(localStorage.getItem("likedComments")) || [];
  return likedComments.includes(commentId);
}

// función para agregar el comentario al array de comentarios que le gustan al usuario
function addUserLike(commentId) {
  const likedComments = JSON.parse(localStorage.getItem("likedComments")) || [];
  likedComments.push(commentId);
  localStorage.setItem("likedComments", JSON.stringify(likedComments));
}

fetch("https://jsonplaceholder.typicode.com/comments")
  .then(response => response.json())
  .then(data => {
    data.slice(0, 20).forEach(comment => { 
      const li = document.createElement("li");
      li.classList.add("list-group-item", "d-flex", "align-items-center", "p-2", "shadow");
      li.innerHTML = `
        <img  src="https://picsum.photos/50" alt="Imagen del autor" class="rounded-circle me-2">
        <div>
          <strong>${comment.name}</strong>
          <p class="m-0">${comment.body}</p>
        </div>
        <button class="btn btn-outline-primary btn-sm ms-auto like-btn" data-comment-id="${comment.id}">❤</button>
        <span class="ms-2 like-count">${comment.likeCount || 0}</span>
      `;
      commentsList.appendChild(li);

      // evento me gusta 
      const likeButtons = document.querySelectorAll(".like-btn");

      likeButtons.forEach(button => {
        const commentId = button.getAttribute("data-comment-id");

        if (hasUserLikedComment(commentId)) {
          // deshabilita el botón de me gusta si el usuario ya ha dado like
          button.disabled = true;
        }

        button.addEventListener("click", () => {
          if (!hasUserLikedComment(commentId)) {
            // incrementa el contador de me gusta
            const likeCountElement = button.nextElementSibling;
            const likeCount = parseInt(likeCountElement.textContent) + 1;
            likeCountElement.textContent = likeCount;

            // agrega el comentario al array de comentarios que le gustan al usuario
            addUserLike(commentId);

            // deshabilita el botón de me gusta
            button.disabled = true;
          }
        });
      });
    });
  });
