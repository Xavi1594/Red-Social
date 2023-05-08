function amigos() {
    function getFriends() {
      fetch('http://localhost:4000/amigos')
        .then(response => {
          return response.json();
        })
        .then(data => {
          const amigosDiv = document.getElementById('usuarios');
          amigosDiv.innerHTML = data.map(friend => `
            <div class="card">
              <h2><strong>${friend.username}</strong></h2>
              <p>${friend.fullname}</p>
              <p>${friend.email}</p>
              <p>${friend.age}</p>
            </div>
          `).join('');
        })
        .catch(error => {
          console.log(error);
        });
    }
  
    return {
      getFriends: getFriends
    };
  }
  