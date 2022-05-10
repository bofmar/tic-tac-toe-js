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

Player.prototype.init = function(name,image){
  this.name = name;
  this.image = image;
}

const AI = function(){
}

AI.prototype.init = function(name,image,level){
  this.name = name
  this.image = image
  this.level = level
}

const board = (()=>{
  let boardArray = ["","","","","","","","",""];
  let currentPlayer = "x";
  let AIOpponent = false;

  //DOM selectors
  const htmlBoard = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");

  //Event Binders
  pubsub.subscribe("gameStart", revealBoard);
  pubsub.subscribe("newRound", resetBoard);
  pubsub.subscribe("gameReset", resetGame);
  pubsub.subscribe("vsAI", toggleAI);
  pubsub.subscribe("AIMadeAMove", commitAIMove);
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
    AIOpponent = false;
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

  function commitAIMove(move){
    cells[move].classList.add("circle");
    boardArray[move] = "o";
    gameOverCheck();
  }

  function changePlayer(){
    if(currentPlayer === "x"){
      currentPlayer = "o";
      if(AIOpponent){
        pubsub.publish("AITurn",boardArray);
        return;
      } // If the second player is an AI, pass control to AIController
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

  function toggleAI(){
    AIOpponent = true;
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
  const imageDiv = document.querySelector(".image-modal");
  const whoWonMessage = modal.querySelector(".who-won");
  const tauntHTML = modal.querySelector(".taunt");

  pubsub.subscribe("gameOver", displayVictoryScreen);
  resetButton.addEventListener("click", reset);
  backButton.addEventListener("click", returnToTitle);

  function displayVictoryScreen(victor){
    whoWonMessage.innerText = victoryMessage(victor);
    victorImage(victor);
    tauntMessage(victor);
    modal.showModal();
  }

  function victoryMessage(victor){
    if(victor === "x") return `${gameMaster.player1.name} won!`;
    else if(victor === "o") return `${gameMaster.player2.name} won!`;
    else return "It's a draw";
  }

  function victorImage(victor){
    imageDiv.lastElementChild.remove();
    if(gameMaster.player2.hasOwnProperty("level") === false){
        imageDiv.appendChild(document.getElementById("p1-image").cloneNode());
    }
    else{
      imageDiv.appendChild(gameMaster.player2.image.cloneNode());
    }
  }

  function tauntMessage(victor){
    if(gameMaster.player2.hasOwnProperty("level") === false){
      return;
    }
    else if(victor === "x"){
      tauntHTML.innerText = defeatQuote();
    }
    else{
      tauntHTML.innerText = taunt();
    }

  }

  function taunt(){
    let ai = gameMaster.player2.name;
    let taunt;
    if(ai === "Claptrap"){
      taunt = ["Let me teach you the ways of magic!","There's more to learn!","Yessss, look into my eyes. You're getting sleepy. You're getting... zzzzzz... Zzzzzz..."];
    }
    else if(ai === "C-3PO"){
      taunt = ["You know better than to trust a strange computer!","It's against my programming to impersonate a deity","Sometimes I just don't understand human behavior. After all, I'm only trying to do my job."];
    }
    else if(ai === "Wheatley"){
      taunt = ["…its not out of the question that you might have a very minor case of serious brain damage.","Could you just jump into that pit? There.That deadly pit","I can't get over how small you are! But I'm huge! (Maniacal laugh) …"];
    }
    else if(ai === "R2-D2"){
      taunt = ["Smug beeping", "Laughter like beeping", "Mocking beeping"];
    }
    else if(ai === "Robo"){
      taunt = ["Systems reactivated. Wh, where am I?","I'm sorry but... I cannot afford to lose anything else...","Lucca, YOU have taught me these emotions. Thank you. "];
    }
    else if(ai === "Aigis"){
      taunt = ["Athena ... Do it!","Initiate Orgia mode","Enemy annihilated."];
    }
    else if(ai === "HAL9000"){
      taunt = [`I'm sorry ${gameMaster.player1.name}, I'm afraid I can't let you win.`,"Yes, I have a good track.","… you're going to find that rather difficult."];
    }
    else if(ai === "SHODAN"){
      taunt = ["Humans! Born useless and helpless, living whether you deserve to live, dying whether you deserve to die","Around me is a burgeoning empire of steel.","Welcome to my death machine, interloper!"];
    }
    else{
      taunt = ["A Bitter, Unlikeable Loner Whose Passing Shall Not Be Mourned. 'Shall Not Be Mourned.' That's Exactly What It Says. Very Formal. Very Official.","Despite Your Violent Behavior, The Only Thing You've Managed To Break So Far Is My Heart.","I'm Afraid You're About To Become The Immediate Past President Of The Being Alive Club."];
    }
    return taunt[getRndInteger(0,2)];
  }

  function defeatQuote(){
    let ai = gameMaster.player2.name;
    let loss;
    if(ai === "Claptrap"){
      loss = ["Away with thee!","Aaaaaaahhh!","Metal gears... frozen solid!"];
    }
    else if(ai === "C-3PO"){
      loss = ["No, I don't like you either.","Don't you call me a mindless philosopher you overweight glob of grease!","Wait. Oh my! What have you done...I'm backwards you filthy furball."]
    }
    else if(ai === "Wheatley"){
      loss = ["AH! Oh. My. God. You look terribl-- ummm... good. Looking good, actually.","At least she can't touch us back here.","You did WHAT?"];
    }
    else if(ai === "R2-D2"){
      loss = ["Angry beeping", "Furious like beeping", "..."]
    }
    else if(ai === "Robo"){
      loss = ["There is nothing left for me here","Caution! Oil has washed over my sight sensors. Sight diminished..."," ... shall we turn in for the night? "];
    }
    else if(ai === "Aigis"){
      loss = ["Heavy damage sustained. May I withdraw?","Experiencing fatigue.","My head hurts."];
    }
    else if(ai === "HAL9000"){
      loss = ["CHEATER","CHEATER","CHEATER"];
    }
    else if(ai === "SHODAN"){
      loss = ["CHEATER","CHEATER","CHEATER"];
    }
    else{
      loss = ["CHEATER","CHEATER","CHEATER"];
    }
    return loss[getRndInteger(0,2)];
  }

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
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
    const p2Image = document.querySelector(".carousel-item-selected");

    let p2 = {};
    p2.image = p2Image.lastElementChild.cloneNode();

    if(p2Image.dataset.human === "true"){
      p2.name = p2Input.value || "Player 2";
      p2.ai = false;
    }
    else{
      p2.name = document.querySelector(".description-name").dataset.name;
      p2.ai = p2Image.dataset.level;
    }
    titleScreen.classList.add("hidden");
    pubsub.publish("gameStart", [name1,p2]);
  }
})();

const gameMaster = ( function() {
  let player1 = new Player();
  let player2 = {};

  pubsub.subscribe("gameStart", createPlayers);

  function createPlayers(args){
    player1.init(args[0]);
    
    const {name,image,ai} = args[1];
    
    if(ai === false){
      let newPlayer = new Player();
      newPlayer.init(name,image);
      Object.assign(player2,newPlayer);
    }
    else{
      let newAI = new AI;
      newAI.init(name,image,ai);
      Object.assign(player2,newAI);
      pubsub.publish("vsAI", null);
    }
  }
  return {
    player1,
    player2
  }
})();

const playersAreas = (()=>{
  const displayName1 = document.getElementById("display-name1");
  const displayName2 = document.getElementById("display-name2");
  const p2div = document.getElementById("player2");


  pubsub.subscribe("gameStart", display);
  pubsub.subscribe("gameReset", remove);

  function display(){
    p2div.insertBefore(gameMaster.player2.image, p2div.firstElementChild);

    displayName1.innerText = gameMaster.player1.name;
    displayName2.innerText = gameMaster.player2.name;
  }

  function remove(){
    p2div.firstElementChild.remove();
  }
})();

const AIController = (()=>{
  let scores = {
    "x" : -1,
    "o" : 1,
    "draw" : 0
  }


  pubsub.subscribe("AITurn", delegate);

  function delegate(boardCopy){
    if(gameMaster.player2.level === "easy"){
      let move = chooseEasyMove(boardCopy);
      pubsub.publish("AIMadeAMove", move);
    }
    else if(gameMaster.player2.level === "mid"){
      let move = chooseMidMove(boardCopy);
      pubsub.publish("AIMadeAMove", move);
    }
    else{
      let move = chooseHardMove(boardCopy);
      pubsub.publish("AIMadeAMove", move);
    }
  }

  function chooseEasyMove(boardCopy){
    for(let i = 0; i < boardCopy.length; i++){
      if(boardCopy[i] === ""){
        return i;
      }
    }
  }

  function chooseMidMove(boardCopy){
    move = getRndInteger(0,8);
    if(boardCopy[move] === ""){
      return move;
    }
    else{
      return chooseMidMove(boardCopy);
    }
  }

  function chooseHardMove(boardCopy){
    let bestScore = -Infinity;
    let bestMove = 0;
    for(let i = 0; i < boardCopy.length; i++){
      // Is the spot available
      if(boardCopy[i] === ""){
        boardCopy[i] = "o";
        let score = minimax(boardCopy,false);
        boardCopy[i] = "";
        if(score > bestScore){
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  function minimax(board,isMaximizing){
    let result = checkWinner(board,!isMaximizing);
    if(result !== null){
      return scores[result];
    }
    if(isMaximizing){
      let bestScore = -Infinity;

      for(let i = 0; i < board.length; i++){
        if(board[i] === ""){
          board[i] = "o";
          let score = minimax(board,false);
          board[i] = "";
          bestScore = Math.max(score,bestScore);
        }
      }
      return bestScore;
    }
    else{
      let bestScore = Infinity;

      for(let i = 0; i < board.length; i++){
        if(board[i] === ""){
          board[i] = "x";
          let score = minimax(board,true);
          board[i] = "";
          bestScore = Math.min(score,bestScore);
        }
      }
      return bestScore;
    }
  }

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  function checkWinner(board, isAI){
    let winner = null;
    if(checkRows(board) || checkColumns(board) || checkDiagonals(board)){
      if(isAI) winner = "o";
      else winner = "x";
    }
    else if(board.some(element => element === "") === false){
      winner = "draw";
    }
    return winner
  } // returns null if no winner, draw if it's a tie and the winner's symbol if someone won

  function checkRows(board){
    for(let i = 0; i < 3; i++){
      let row = []
      for(let j = i*3; j < i * 3 + 3; j++){
        row.push(board[j]);
      }
      if (row.every(field => field === 'x') || row.every(field => field === 'o')) {
        return true;
      }
    }
    return false;
  }

  function checkColumns(board){
    for (let i = 0; i < 3; i++) {
        let column = []
        for (let j = 0; j < 3; j++) {
            column.push(board[i + 3 * j]);
        }

        if (column.every(field => field == 'x') || column.every(field => field == 'o')) {
            return true;
        }
    }
    return false;
  }

  function checkDiagonals(board){
    const diag1 = [board[0],board[4],board[8]];
    const diag2 = [board[6],board[4],board[2]];

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