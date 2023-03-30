const cardRow = document.getElementById("card-row");

fetch("https://randomuser.me/api/?results=20")
  .then((response) => response.json())
  .then((data) => {
    let cardCount = 0;
    let cardRow = document.createElement("div");
    cardRow.classList.add("row");
    for (let i = 0; i < 20; i++) {
      const cardColumn = document.createElement("div");
      cardColumn.classList.add("col-md-3", "my-3");
      const card = document.createElement("div");
      card.classList.add("card", "h-100");
      const cardBody = document.createElement("div");
      cardBody.classList.add(
        "card-body",
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center"
      );
      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      cardTitle.textContent = `${data.results[i].name.first} ${data.results[i].name.last}`;
      const cardSubtitle = document.createElement("h6");
      cardSubtitle.classList.add("card-subtitle", "mb-2", "text-muted");
      const cardImage = document.createElement("img");
      cardImage.classList.add("card-img-top", "my-3");
      cardImage.setAttribute("src", `${data.results[i].picture.large}`);
      cardImage.setAttribute("alt", "Foto de perfil");
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add(
        "d-flex",
        "justify-content-center",
        "w-100"
      );
      const acceptButton = document.createElement("button");
      acceptButton.classList.add("btn", "btn-success", "mx-2");
      acceptButton.textContent = "Aceptar";

      const rejectButton = document.createElement("button");
      rejectButton.classList.add("btn", "btn-danger", "mx-2");
      rejectButton.textContent = "Rechazar";

      buttonContainer.appendChild(acceptButton);
      buttonContainer.appendChild(rejectButton);
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardSubtitle);
      cardBody.appendChild(cardImage);
      cardBody.appendChild(buttonContainer);
      card.appendChild(cardBody);
      cardColumn.appendChild(card);
      cardRow.appendChild(cardColumn);
      cardCount++;
      if (cardCount === 4) {
        cardCount = 0;
        document.getElementById("card-row").appendChild(cardRow);
        cardRow = document.createElement("div");
        cardRow.classList.add("row");
      }
    }
    if (cardCount > 0) {
      document.getElementById("card-row").appendChild(cardRow);
    }
  })
  .catch((error) => console.error(error));
