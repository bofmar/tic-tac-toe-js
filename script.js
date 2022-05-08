const board = (()=>{
  let boardArray = ["","","","","","","","",""];
  let currentPlayer = "x";

  //DOM selectors
  const htmlBoard = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");

  //Event Binders
  cells.forEach(cell => cell.addEventListener("click",_commitMove));

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

  function _reset(){
    boardArray = ["","","","","","","","",""];
    for(let i = 0; i < cells.length; i++){
      cells[i].classList.remove("x");
      cells[i].classList.remove("circle");
    }
    currentPlayer = "x";
  }

  function _commitMove(e){
    if(currentPlayer === "x"){
      e.target.classList.add("x");
      boardArray[e.target.dataset.index] = "x";
    }
    else{
      e.target.classList.add("circle");
      boardArray[e.target.dataset.index] = "o";
    }
    _changePlayer();
  }

  function _changePlayer(){
    if(currentPlayer === "x"){
      currentPlayer = "o";
      htmlBoard.classList.add("circle");
      htmlBoard.classList.remove("x");
    }
    else{
      currentPlayer = "x";
      htmlBoard.classList.add("x");
      htmlBoard.classList.remove("circle");
    }
  }

  function getBoard(){
    return boardArray;
  }

  return {
    getBoard
  };
})();