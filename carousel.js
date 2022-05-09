const carousel = (()=>{
  // DOM Selectors
  const carousel = document.querySelector(".carousel");
  const items = document.querySelectorAll(".carousel-item");
  const title = document.querySelector("#title-player2");
  const descriptions = [{},{
    name: "Claptrap",
    description: "AI - EASY"
    },
    {
      name: "C-3PO",
      description: "AI - EASY"
    },
    {
      name: "Wheatley",
      description: "AI - EASY"
    },
    {
      name: "R2-D2",
      description: "AI - NORMAL"
    },
    {
      name: "Robo",
      description: "AI - NORMAL"
    },
    {
      name: "Aigis",
      description: "AI - NORMAL"
    },
    {
      name: "HAL9000",
      description: "AI - HARD"
    },
    {
      name: "SHODAN",
      description: "AI - HARD"
    },
    {
      name: "GLADOS",
      description: "AI - HARD"
    }
  ]

  const inputFieldPro = `
  <label for="name2"></label>
  <input type="text" id="name2" name="name2" placeholder="Player o">
  `;

  const buttonsHTML = Array.from(items, () => {
    return `<span class="carousel-button"></span>`;
  });

  carousel.insertAdjacentHTML("beforeend", `
    <div class="carousel-nav">
      ${buttonsHTML.join("")}
    </div>
  `);

  const buttons = carousel.querySelectorAll(".carousel-button");

  buttons.forEach((button,index) => {
    button.addEventListener("click", ()=>{
      items.forEach(item => item.classList.remove("carousel-item-selected"));
      buttons.forEach(b => b.classList.remove("carousel-button-selected"));

      items[index].classList.add("carousel-item-selected");
      button.classList.add("carousel-button-selected");

      // check if pc or ai
      if(index === 0){
        title.lastElementChild.remove();
        let newDiv = document.createElement("div");
        newDiv.innerHTML = inputFieldPro;
        title.appendChild(newDiv);
      }
      else{
        title.lastElementChild.remove();
        let newDiv = document.createElement("div");
        newDiv.innerHTML = `
            <p class="description-name">${descriptions[index].name}</p>
            <p class="description-level">${descriptions[index].description}</p>
          `;
        title.appendChild(newDiv);
      }
    });
  });

  buttons[0].classList.add("carousel-button-selected");
})();