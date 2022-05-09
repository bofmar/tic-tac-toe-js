const pubsub = {
  events: {},
  subscribe: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  unsubscribe: function(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  publish: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};

const board = (()=>{
  let boardArray = ["","","","","","","","",""];
  let currentPlayer = "x";


  //DOM selectors
  const htmlBoard = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");
  const modal = document.querySelector(".game-over");
  const resetButton = document.getElementById("reset");
  const backButton = document.getElementById("back");
  const whoWonMessage = modal.querySelector(".who-won");
  const titleScreen = document.querySelector(".title-screen");
  const startButton = document.getElementById("start");
  const p1Input = document.getElementById("name1");
  const p2Input = document.getElementById("name2");
  const displayName1 = document.getElementById("display-name1");
  const displayName2 = document.getElementById("display-name2");

  //Event Binders
  cells.forEach(cell => cell.addEventListener("click",_commitMove));
  resetButton.addEventListener("click", _reset);
  startButton.addEventListener("click", _startGame);
  backButton.addEventListener("click", _returnToTitle);

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
      whoWonMessage.innerText = victoryMessage();
      pubsub.publish("gameOver", currentPlayer);
      modal.showModal();
    }
    else if(boardArray.some(element => element === "") === false){
      currentPlayer = "draw";
      whoWonMessage.innerText = victoryMessage();
      pubsub.publish("gameOver", currentPlayer);
      modal.showModal();
    }
    else{
      _changePlayer();
    }
  }

  function victoryMessage(){
    if(currentPlayer === "x") return `${displayName1.innerText} won!`;
    if(currentPlayer === "o") return `${displayName2.innerText} won!`;
    // TO DO : FIX THE ABOVE TO BE LESS HACKY
    else return "It's a draw";
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

  function _resetScore(){
    xScore = 0;
    oScore = 0;
    score.innerText = `${xScore} - ${oScore}`;
  }

  function _startGame(){
    const name1 = p1Input.value || "Player 1";
    const name2 = p2Input.value || "Player 2";
    this.player1 = player(name1);
    this.player2 = player(name2);

    displayName1.innerText = this.player1.name;
    displayName2.innerText = this.player2.name;

    titleScreen.classList.add("hidden");
    htmlBoard.classList.remove("hidden");
  }

  function _returnToTitle(){
    _reset();
    _resetScore();
    titleScreen.classList.remove("hidden");
    htmlBoard.classList.add("hidden");
  }
})();

const score = (() => {
  let xScore = 0;
  let oScore = 0;

  const score = document.querySelector(".score");
  pubsub.subscribe("gameOver", updateScore);

  function updateScore(playerWon){
    if(playerWon === "draw") return;
    if(playerWon === "x"){
      xScore++;
    }
    else{
      oScore++;
    }
    score.innerText = `${xScore} - ${oScore}`;
  }
})();

const player = function(name,taunt = "", picture = null){
  return {name,taunt,picture};
}

// TO DO
// Create game module.
// Create event handler.
// The modals will communicate with each other through the event handler only.
// Move appropriate functions from board to game.
// Add carousel to select opponent
// Add ai players.
// Easy will just pick the first available move.
// Normal picks at random.
// Hard uses min-max.
// Each ai level will have three different representatives with their own name, image and taunts.
// Add final touches: modify the look of the game, add a favicon, add a title.