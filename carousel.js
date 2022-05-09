const carousel = (()=>{
  // DOM Selectors
  const carousel = document.querySelector(".carousel");
  const items = document.querySelectorAll(".carousel-item");

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
    });
  });

  buttons[0].classList.add("carousel-button-selected");
})();