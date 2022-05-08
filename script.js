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
    htmlBoard.classList.remove("circle");
    htmlBoard.classList.add("x");
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
    _gameOverCheck();
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

  function _gameOverCheck(){
    if(_checkRows() || _checkColumns() || _checkDiagonals()){
      console.log(`${currentPlayer} won!`);
      _reset();
    }
    else{
      _changePlayer();
    }
  }

  function _checkRows(){
    for(let i = 0; i < 3; i++){
      let row = []
      for(let j = i*3; j < i * 3 + 3; j++){
        row.push(boardArray[j]);
      }
      if (row.every(field => field === 'x') || row.every(field => field === 'o')) {
        return true;
      }
    }
    return false;
  }

  function _checkColumns(){
    for (let i = 0; i < 3; i++) {
        let column = []
        for (let j = 0; j < 3; j++) {
            column.push(boardArray[i + 3 * j]);
        }

        if (column.every(field => field == 'x') || column.every(field => field == 'o')) {
            return true;
        }
    }
    return false;
  }

  function _checkDiagonals(){
    const diag1 = [boardArray[0],boardArray[4],boardArray[8]];
    const diag2 = [boardArray[6],boardArray[4],boardArray[2]];

    if(diag1.every(field => field === "x") || diag1.every(field => field === "o")){
      return true;
    }
    else if(diag2.every(field => field === "x") || diag2.every(field => field === "o")){
      return true;
    }
    else{
      return false;
    }
  }

  function getBoard(){
    return boardArray;
  }

  return {
    getBoard
  };
})();