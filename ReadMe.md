#Thy Memories of Lenore
>Quoth the Raven “Nevermore.”

##Two Player Fun
By default the game pits you against the Raven. The Raven is not actively playing; however if you flip a card more than once without getting a match, your health will decrement and the Raven scores a point. If you or a second player's health dips to zero, the Raven wins the round.

##Game Size
Based on the spec, the game initializes with 1 player (brooding ol' Edgar) and 8 cards to match. By clicking on Settings you can include a second human player (represented by dear sweet Lenore). Cooperate to defeat the Raven. You can also alter the size of the game. Technically the deck builder will work with any even number of cards, but the input limits you to a few multiples of four for simplicity's sake.

##Game State
A 'Game' consists of as many rounds as you'd like to play. Each turn the state of the round is assessed by the Game. When the round is finished (100% matches, or players died), the wins and losses are sorted accordingly and stored in the Game State. Refreshing the page will start the game state back at zero; however altering the settings or beginning a new round will not alter the total game state and score board.

###Self Awareness Clause
No code is perfect - these are some things I'd do differently in a refactor.
* CSS positioning - I didn't use any frameworks here (except LESS to preprocess CSS during development). I feel like card placement could be handled better; however I wanted the cards to not be off screen on mobile device or if the screen was resized, so I used flex. This seems to be handled differently in different browsers, so sometimes the stack of cards looks a little off.
* Selector Caching - I wanted to go with ZERO frameworks, just to ensure I could do this in javascript all on my lonesome. I'm doing a fair amount of DOM manipulation with ID's and loops, so I'm sure I'm not approaching in the optimal way. Given more time I would take another look at this.
* Styling Form Elements - I'm not 100% happy with my visuals, this is a bit rushed, but I wanted an old/macabre look. The Form Elements on the settings tab really clash, and have some not 100% awesome jitter behavior in Safari.
** Speaking of styling, don't look at this in any old version of IE. Thanks!
* this.this.this. - Feature Creep is real. I wanted to do something more engaging than a simple 8 card game, so I tried to build it flexible. The features progressed faster than maintenance could for a one weekend build. In revision Deck, Board, and Game could likely be combined more efficiently and possibly into a single constructor. Turn monitoring and assessment would also likely be made a bit more efficient and simplified.
* Image bloat. I drew the imagery myself on an iPad, but did nothing to streamline the size. I think this is hindering load time and would like to optimize them or replace with different icons.   
