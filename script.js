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

const Player = function(){
}

Player.prototype.init = function(name){
  this.name = name;
}

const board = (()=>{
  let boardArray = ["","","","","","","","",""];
  let currentPlayer = "x";


  //DOM selectors
  const htmlBoard = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");

  //Event Binders
  pubsub.subscribe("gameStart", revealBoard);
  pubsub.subscribe("newRound", resetBoard);
  pubsub.subscribe("gameReset", resetGame);
  cells.forEach(cell => cell.addEventListener("click",commitMove));

  //Methods
  function revealBoard(){
    htmlBoard.classList.remove("hidden");
  }

  function resetBoard(){
    boardArray = ["","","","","","","","",""];
    for(let i = 0; i < cells.length; i++){
      cells[i].classList.remove("x");
      cells[i].classList.remove("circle");
    }
    currentPlayer = "x";
    htmlBoard.classList.remove("circle");
    htmlBoard.classList.add("x");
  }

  function resetGame(){
    resetBoard();
    htmlBoard.classList.add("hidden");
  }

  function commitMove(e){
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
    gameOverCheck();
  }

  function changePlayer(){
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

  function gameOverCheck(){
    if(checkRows() || checkColumns() || checkDiagonals()){
      pubsub.publish("gameOver", currentPlayer);
    }
    else if(boardArray.some(element => element === "") === false){
      currentPlayer = "draw";
      pubsub.publish("gameOver", currentPlayer);
    }
    else{
      changePlayer();
    }
  }

  function checkRows(){
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

  function checkColumns(){
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

  function checkDiagonals(){
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
})();

const score = (() => {
  let xScore = 0;
  let oScore = 0;

  const score = document.querySelector(".score");

  pubsub.subscribe("gameOver", updateScore);
  pubsub.subscribe("gameReset", resetScore);

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

  function resetScore(){
    xScore = 0;
    oScore = 0;
    score.innerText = `${xScore} - ${oScore}`;
  }
})();

const gameOverModal = (()=>{
  const modal = document.querySelector(".game-over");
  const resetButton = document.getElementById("reset");
  const backButton = document.getElementById("back");
  const whoWonMessage = modal.querySelector(".who-won");

  pubsub.subscribe("gameOver", displayVictoryScreen);
  resetButton.addEventListener("click", reset);
  backButton.addEventListener("click", returnToTitle);

  function displayVictoryScreen(victor){
    whoWonMessage.innerText = victoryMessage(victor);
    modal.showModal();
  }

  function victoryMessage(victor){
    if(victor === "x") return `${gameMaster.player1.name} won!`;
    if(victor === "o") return `${gameMaster.player2.name} won!`;
    // TO DO : FIX THE ABOVE SO THAT THE PROPER NAME IS SHOWN
    else return "It's a draw";
  }

  function reset(){
    modal.close();
    pubsub.publish("newRound", null);
  }

  function returnToTitle(){
    modal.close();
    pubsub.publish("gameReset", null);
  }
})();

const titleScreenModule = (()=>{
  const titleScreen = document.querySelector(".title-screen");
  const startButton = document.getElementById("start");
  const p1Input = document.getElementById("name1");
  const p2Input = document.getElementById("name2");

  pubsub.subscribe("gameReset", revealScreen);
  startButton.addEventListener("click", startGame);

  function revealScreen(){
    titleScreen.classList.remove("hidden");
  }

  function startGame(){
    const name1 = p1Input.value || "Player 1";
    const name2 = p2Input.value || "Player 2";

    titleScreen.classList.add("hidden");
    pubsub.publish("gameStart", [name1,name2]);
  }
})();

const gameMaster = (()=> {
  let player1 = new Player();
  let player2 = new Player();

  pubsub.subscribe("gameStart", createPlayers);

  function createPlayers(args){
    player1.init(args[0]);
    player2.init(args[1]);
  }

  return {
    player1,
    player2
  }
})();

const playersAreas = (()=>{
  const displayName1 = document.getElementById("display-name1");
  const displayName2 = document.getElementById("display-name2");

  pubsub.subscribe("gameStart", display);

  function display(){
    displayName1.innerText = gameMaster.player1.name;
    displayName2.innerText = gameMaster.player2.name;
  }
})();

// TO DO
// Move appropriate functions from board to game.
// Add carousel to select opponent
// Add ai players.
// Easy will just pick the first available move.
// Normal picks at random.
// Hard uses min-max.
// Each ai level will have three different representatives with their own name, image and taunts.
// Add final touches: modify the look of the game, add a favicon, add a title.