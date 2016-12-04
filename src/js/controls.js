var globals = {"showSettings":false,
                "playerCount": 1,
                "deckSize": 8,
                "clickCounter":0,
                "players":[],
                "turn": 0,
                "canClick": true,
                "scoreCard": {"moves": 0,
                              "roundsPlayed":0,
                              "raven":{"wins":0, "health":0, "points":0},
                              "edgar":{"wins":0, "health":0, "points":0},
                              "lenore":{"wins":0, "health":0, "points":0}},
                "clickCount": function(){
                                globals.scoreCard.moves +=1;
                                if(globals.clickCounter>1){
                                  globals.clickCounter = 0;
                                } else {
                                  globals.clickCounter +=1;
                                }
                              }
              };

///Event listeners
window.addEventListener("load", function(){
  globals.game = new Game();
  globals.board = new Board();
  globals.board.buildBoard();
  var player1 = new Player("Player 1");
  globals.players.push(player1);
});

document.getElementById("settingBurger").addEventListener("click", toggleSettings);
document.getElementById("newGame").addEventListener("click", newRound);

document.getElementById("dismissBtn").addEventListener("click", function(event){
  event.preventDefault();
  toggleSettings();
});

document.getElementById("settingBtn").addEventListener("click", function(event){
  event.preventDefault();
  settingsChange();
});

//Control Functions
function addTileListen(){
  var tiles = document.getElementsByClassName('tile');
      var tilesLength = tiles.length;
      for (var i = 0; i < tilesLength; i++){
          tiles[i].addEventListener('click', tileClick, false);
      };
      globals.canClick = true;
}

function newRound(){
  //starts new round with same settings as last
  globals.game = new Game();
  globals.board = new Board();
  globals.board.buildBoard();
}

function tileClick(){
  var whichPlayer = (globals.turn== 0 ? "playa1":"playa2");
  if(globals.canClick){
    globals.clickCount();
    var card = this.getAttribute("data-index");
    var display = globals.board.deck.showCard(card);
    addClass(this, whichPlayer);
    this.innerHTML = display;
    if(globals.clickCounter>1){
      globals.canClick = false;
      globals.board.assessState();
      globals.turn = (globals.playerCount>1 && globals.turn == 0)? 1 : 0;
      globals.clickCount();
    }
  }
}

function showWinner(winner){
  var el = document.getElementById('notification');
  el.innerHTML = winner + " wins!";
  removeClass(el, 'hidden');
  var fadeIt = setTimeout(hideNotification, 1000);
}

function hideNotification(){
  var el = document.getElementById('notification');
  addClass(el, 'hiddenFade');
}

function updateScoreCards(){
  var sc = globals.scoreCard,
      thisCard,
      contents;
  thisCard = document.getElementById("RavenDeets");
  contents = "<li>Wins: " + sc.raven.wins + "</li><li>Health: "+ sc.raven.health + "</li><li>Points: "+ sc.raven.points + "</li>";
  thisCard.innerHTML = contents;
  thisCard = document.getElementById("EdgarDeets");
  contents = "<li>Wins: " + sc.edgar.wins + "</li><li>Health: "+ sc.edgar.health + "</li><li>Points: "+ sc.edgar.points + "</li>";
  thisCard.innerHTML = contents;
  thisCard = document.getElementById("LenoreDeets");
  contents = "<li>Wins: " + sc.lenore.wins + "</li><li>Health: "+ sc.lenore.health + "</li><li>Points: "+ sc.lenore.points + "</li>";
  thisCard.innerHTML = contents;
}

function toggleSettings(){
  var el = document.getElementById('settingsPanel');
  if(globals.showSettings){
    addClass(el, 'noView');
    globals.showSettings = false;
  } else {
    removeClass(el, 'noView');
    globals.showSettings = true;
  }
}

function settingsChange() {
  var radios = document.getElementsByTagName('input');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].type === 'radio' && radios[i].checked) {
      // get value, set checked flag or do whatever you need to
      globals.playerCount = parseInt(radios[i].value);
    }
  }
  //if new player joins game
  if(globals.playerCount > 1){
    var player2 = new Player("Player 2");
    globals.players.push(player2);
    var lenore = document.getElementById("lenore");
    removeClass(lenore, "hidden");
  } else {
    var lenore = document.getElementById("lenore");
    addClass(lenore, "hiddenFade");
  }
  globals.deckSize = parseInt(document.getElementById("DeckSize").value);
  globals.board = new Board();
  globals.board.buildBoard();
  toggleSettings();
  //console.log(globals);
}

function clearBoard(){
  var gameboard = document.getElementById("gameBoard-Mount");
  while (gameboard.lastChild) {
  gameboard.removeChild(gameboard.lastChild);
  }
}

function makeTiles(cols, rows){
  var counter = 0;
    for(var i=0; i<rows; i++){
      var gameboard = document.getElementById("gameBoard-Mount");
      var makeRow = document.createElement("div");
      makeRow.id = "row" + i;
      addClass(makeRow, "tileRow");
      gameboard.appendChild(makeRow);
      for(var j=0; (j<cols && counter < globals.deckSize); j++){
        var makeTile = document.createElement("span");
        addClass(makeTile, "tile");
        addClass(makeTile, "cardBack");
        makeTile.setAttribute("data-index", counter);
        makeRow.appendChild(makeTile);
        counter+= 1;
      }
    }
}

function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}
