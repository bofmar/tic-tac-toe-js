const board = (()=>{
  let boardArray = ["","","","","","","","",""];
  let currentPlayer = "x";
  let xScore = 0;
  let oScore = 0;

  //DOM selectors
  const htmlBoard = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");
  const modal = document.querySelector(".game-over");
  const resetButton = document.getElementById("reset");
  const whoWonMessage = modal.querySelector(".who-won");
  const score = htmlBoard.querySelector(".score");
  const titleScreen = document.querySelector(".title-screen");
  const startButton = document.getElementById("start");
  const p1Input = document.getElementById("name1");
  const p2Input = document.getElementById("name2");

  //Event Binders
  cells.forEach(cell => cell.addEventListener("click",_commitMove));
  resetButton.addEventListener("click", _reset);
  startButton.addEventListener("click", _startGame);

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
    modal.close();
  }

  function _commitMove(e){
    if(boardArray[e.target.dataset.index] !== ""){
      return
    } // prevent players from playing on top of each other
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
      whoWonMessage.innerText = `${currentPlayer === 'x' ? "Player 1" : "Player 2"} won!`;
      _updateScore();
      modal.showModal();
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

  function _updateScore(){
    if(currentPlayer === "x"){
      xScore++;
    }
    else{
      oScore++;
    }

    score.innerText = `${xScore} - ${oScore}`;
  }

  function _startGame(){
    titleScreen.classList.add("hidden");
    htmlBoard.classList.remove("hidden");
  }
})();

const player = function(name,taunt = "", picture){
  return {name,taunt,picture};
}

// TO DO
// Create the start screen.
// Make the back button return you to start screen.
// Get player's names from the start screen.
// Create game modal.
// Create event handler.
// The modals will communicate with each other through the event handler only.
// Move appropriate functions from board to game.
// Add ai players.
// Easy will just pick the first available move.
// Normal picks at random.
// Hard uses min-max.
// Each ai level will have three different representatives with their own name, image and taunts.
// Add final touches: modify the look of the game, add a favicon, add a title.