const board = (()=>{
  const boardArray = ["","","x","o","x","o","x","",""];

  //DOM selectors
  const htmlBoard = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");

  //Methods
  function _display(){
    boardArray.map((item, index) => {
      if(item === "x"){
        cells[index].classList.add("x");
      }
      if(item === "o"){
        cells[index].classList.add("circle");
      }
    });
  }

  return {_display};
})();