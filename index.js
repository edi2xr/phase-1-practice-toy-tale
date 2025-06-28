document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const addToyBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");

  let addToy = false;

  // Toggle form visibility
  addToyBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display all toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((res) => res.json())
      .then((toys) => {
        toyCollection.innerHTML = ""; // clear before re-adding
        toys.forEach((toy) => renderToy(toy));
      });
  }

  // Render a single toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => handleLike(toy));

    toyCollection.appendChild(card);
  }

  // Handle like button click
  function handleLike(toy) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes;
        fetchToys(); // re-fetch to update display
      });
  }

  // Handle new toy form submission
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0,
      }),
    })
      .then((res) => res.json())
      .then((newToy) => {
        renderToy(newToy);
        toyForm.reset();
        toyFormContainer.style.display = "none";
        addToy = false;
      });
  });

  // Initial fetch
  fetchToys();
});
