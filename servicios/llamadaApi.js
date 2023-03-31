const commentsList = document.getElementById("comments-list");

fetch("https://jsonplaceholder.typicode.com/comments")
  .then(response => response.json())
  .then(data => {
    data.forEach(comment => {
      const li = document.createElement("li");
      li.classList.add("list-group-item", "d-flex", "align-items-center", "p-2", "shadow");
      li.innerHTML = `
        <img  src="https://picsum.photos/50" alt="Imagen del autor" class="rounded-circle me-2">
        <div>
          <strong>${comment.name}</strong>
          <p class="m-0">${comment.body}</p>
        </div>
      `;
      commentsList.appendChild(li);
    });
  });
