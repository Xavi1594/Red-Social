const url = "https://jsonplaceholder.typicode.com/posts";
const postList = document.getElementById("post-list");
const likesMap = {};

fetch(url)
  .then(response => response.json())
  .then(posts => {
    posts.forEach(post => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <p>
          <button class="btn btn btn-like" data-id="${post.id}">
           <i class="bi bi-heart-fill text-danger"></i> <span class="like-count">${likesMap[post.id] || post.likes || 0}</span>
          </button>
        </p>
      `;
      postList.appendChild(li);

      const likeButton = li.querySelector(".btn-like");
      likeButton.addEventListener("click", () => {
        likePost(post.id)
          .then(likes => {
            likesMap[post.id] = likes;
            const likeCount = li.querySelector(".like-count");
            likeCount.textContent = likesMap[post.id] || post.likes || 0;
          })
          .catch(error => console.log(error));
      });
    });
  })
  .catch(error => console.log(error));

function likePost(postId) {
  return new Promise((resolve, reject) => {
    const url = `https://jsonplaceholder.typicode.com/posts/${postId}`;
    fetch(url)
      .then(response => response.json())
      .then(post => {
        const likes = (likesMap[postId] || post.likes || 0) + 1;
        likesMap[postId] = likes;
        const updatedPost = { ...post, likes };
        const options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost)
        };
        fetch(url, options)
          .then(response => response.json())
          .then(updatedPost => resolve(updatedPost.likes))
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
}
