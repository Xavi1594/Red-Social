const commentsList = document.getElementById("comments-list");

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
        <button class="btn btn-outline-primary btn-sm ms-auto like-btn">❤</button>
        <span class="ms-2 like-count">0</span>
      `;
      commentsList.appendChild(li);

      // evento me gusta 
      const likeButtons = document.querySelectorAll(".like-btn");

      likeButtons.forEach(button => {
        let likeCount = 0;

        button.addEventListener("click", () => {
          // Incrementa el contador
          likeCount++;

          // actualiza el contador de me gusta
          const likeCountElement = button.nextElementSibling;
          likeCountElement.textContent = likeCount;
        });
      });
    });
  });
