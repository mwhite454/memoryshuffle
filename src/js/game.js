
function Card(i){
  this.value = i;
  //state=0 is new, state=1 is flipped once, state = 2 is matched
  this.state = 0;
  //if card is state=2, who got the points
  this.pointsTo = "";
  //who flipped this last and didn't match it
  this.stung = "";
}

function Deck(n){
  this.decksize = n;
  this.cards = [];
  this.graveyard = [];
  this.showCard = function(index){
    var mycard = this.cards[index];
    var played = [mycard.value, parseInt(index)];
    globals.board.state.push(played);
    return mycard.value;
  };
  this.hideMatched = function(){
    var index1 = globals.board.state[0][1];
    var index2 = globals.board.state[1][1];
    var myDeck = globals.board.deck;
    if(globals.playerCount == 1 || globals.turn== 1 ){
      myDeck.cards[index1].pointsTo = "edgar";
      myDeck.cards[index2].pointsTo = "edgar";
    } else {
      myDeck.cards[index1].pointsTo = "lenore";
      myDeck.cards[index2].pointsTo = "lenore";
    }
    myDeck.cards[index1].state = 2;
    myDeck.cards[index2].state = 2;
    myDeck.cards[index1].stung = "";
    myDeck.cards[index2].stung = "";
    var tiles = document.getElementsByClassName('tile');
    var tilesLength = tiles.length;
    //console.log(tiles.length);
    for (var i = 0; i < tilesLength; i++){
      var thisTileIndex = tiles[i].getAttribute("data-index");
      if(thisTileIndex == index1 || thisTileIndex == index2){
        tiles[i].innerHTML = "";
        addClass(tiles[i], "hiddenFade");
      }
    }
    globals.game.scrollDeck();
  };

  this.clearCards = function(){
    var index1 = globals.board.state[0][1];
    var index2 = globals.board.state[1][1];
    var myDeck = globals.board.deck;
    if(globals.playerCount == 1 || globals.turn== 1 ){
      if(myDeck.cards[index1].state == 1){
        myDeck.cards[index1].stung = "edgar";
      }
      if(myDeck.cards[index2].state == 1){
        myDeck.cards[index2].stung = "edgar";
      }
    } else {
      if(myDeck.cards[index1].state == 1){
        myDeck.cards[index1].stung = "lenore";
      }
      if(myDeck.cards[index2].state == 1){
        myDeck.cards[index2].stung = "lenore";
      }
    }
    myDeck.cards[index1].state = 1;
    myDeck.cards[index2].state = 1;
    var tiles = document.getElementsByClassName('tile');
    var tilesLength = tiles.length;
    for (var i = 0; i < tilesLength; i++){
      var thisTileIndex = tiles[i].getAttribute("data-index");
      if(thisTileIndex == index1 || thisTileIndex == index2){
        tiles[i].innerHTML = "";
        removeClass(tiles[i], "playa1");
        removeClass(tiles[i], "playa2");
      }
    }
    globals.game.scrollDeck();
  };

  this.shuffle = function(){
    var i = this.cards.length,
        j = 0,
        temp;
    while(i--){
      j = Math.floor(Math.random()*(i+1));
      temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  };
  this.build = function(){
    var cardValues = this.decksize / 2;
    for(var i=1; i<=cardValues; i++){
      for(var j=0; j<2; j++){
        var card = new Card(i);
        this.cards.push(card);
      }
    }
    this.shuffle();
  };

}

function Board(){
  this.state=[];
  this.deck;
  this.columns;
  this.rows;
  this.turn;
  this.assessState = function(){

    var card1 = globals.board.state[0];
    var card2 = globals.board.state[1];
    var stateCheck;
    if(card1[0] === card2[0] && card1[1]!=card2[1]){
      stateCheck = setTimeout(globals.board.deck.hideMatched, 300);
    } else if (card1[0] === card2[0] && card1[1]==card2[1]){
        notifyTurn("Quoth the Raven - Double click no more!");
        globals.board.state.pop();
        globals.clickCount();
        globals.canClick = true;
    } else {
      stateCheck = setTimeout(globals.board.deck.clearCards, 500);
    }
  };

  this.newDeck = function(){
    this.deck = new Deck(globals.deckSize);
    this.deck.build();
  };

  this.buildBoard = function(){
    this.newDeck();
    this.columns = 4;
    this.rows = Math.ceil(globals.deckSize/this.columns);
    clearBoard();
    makeTiles(this.columns, this.rows);
    globals.game.initScoreCard();
    addTileListen();
  };

}

function Game(){
  this.scrollDeck = function(){
    //console.log("scrolling the Deck");
    var cardsMatched = 0,
        //index 0 is points, index 1 is health update
        ravenUpdate =[0,0],
        edgarUpdate =[0,0],
        lenoreUpdate =[0,0],
        sc = globals.scoreCard;

    for(var i=0; i<globals.deckSize; i++){
      var cards = globals.board.deck.cards;
      if(cards[i].state == 2){
        //console.log(cards[i].pointsTo);
        cardsMatched+=1;
        if(cards[i].pointsTo == "edgar"){
          edgarUpdate[0]+=1;
        } else {
          lenoreUpdate[0]+=1;
        }
      }
      if(cards[i].state == 1 && cards[i].stung.length>1){
        if(cards[i].stung == "edgar"){
          edgarUpdate[1]+=1
        } else {
          lenoreUpdate[1]+=1;
        }
        cards[i].stung = "";
      }
    }
    ravenUpdate[0] = edgarUpdate[1] + lenoreUpdate[1];
    ravenUpdate[1] = globals.deckSize - cardsMatched;
    sc.raven.points = sc.raven.points + ravenUpdate[0];
    sc.raven.health = ravenUpdate[1];
    sc.edgar.points = edgarUpdate[0];
    var edgarStart = sc.edgar.health;
    var lenoreStart = sc.lenore.health;
    sc.edgar.health = sc.edgar.health - edgarUpdate[1];
    sc.lenore.points = lenoreUpdate[0];
    sc.lenore.health = sc.lenore.health - lenoreUpdate[1];
    if(edgarStart>sc.edgar.health || lenoreStart > sc.lenore.health){
      showHit();
    }
    //console.log(cardsMatched + " : " + globals.deckSize);
    //check round state now. If both players are dead Raven Wins.
    //If Raven dies, one of the players wins based on points. Ravens Points just show misses.
    if(globals.deckSize == cardsMatched){
      if(sc.edgar.points > sc.lenore.points){
        sc.edgar.wins+=1;
        showWinner("edgar");
      } else if (sc.edgar.points == sc.lenore.points){
        sc.edgar.wins+=1;
        sc.lenore.wins+=1;
        showWinner("Tie! Love");
      } else {
        sc.lenore.wins+=1;
        showWinner("lenore");
      }
    }  else if(sc.edgar.health<=0 && sc.lenore.health<=0){
      sc.raven.wins+=1;
      showWinner("raven");
    }
    updateScoreCards();
    globals.board.state = [];
    globals.canClick = true;
    //ensure that dead players get skipped
    let edgarCanPlay = (sc.edgar.health>0 && globals.turn==0? true : false);
    let lenoreCanPlay = (sc.lenore.health>0 && globals.turn==1 && globals.playerCount>1);
    if(edgarCanPlay || lenoreCanPlay){
      notifyTurn();
    } else {
      //try to switch player
      globals.turn = (globals.turn == 0 && globals.playerCount>1)? 1 : 0;
      notifyTurn();
    }
/*    if(globals.playerCount>1){
      notifyTurn();
    }*/
  };
  this.initScoreCard = function(){
    var sc = globals.scoreCard;
    sc.roundsPlayed +=1;
    sc.raven.health = globals.deckSize;
    sc.raven.points = 0;
    sc.edgar.health = globals.deckSize;
    sc.edgar.points = 0;
    sc.lenore.health = (globals.playerCount>1 ? (globals.deckSize) : 0);
    sc.lenore.points = 0;
    updateScoreCards();
  }
}

function Player(name){
  this.name = name;
  this.playerClass = (name=="Player 1"? "playa1":"playa2");
}
