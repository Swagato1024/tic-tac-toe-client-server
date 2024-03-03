## Tic Tac Toe Game

### What the Game consists of?

- There are two player involved
- A board where the player have chances to turn

### What is a player?

- A player is an instance of a player class who has a name and a icon
  - player = new Player('gourab', icon);
- A player can give a move
  - player.move(toBoxNumber)
- A player also has a set of moves that is updated in each valid move
- A player has a status of win or lose

### What is a Board?

- A board is container of all the moves
- It will store the status of all the moves played so far
- Will also can say if it contains a point
- render itself

### What is a Game Controller?

- A Game Controller controls the game.
- It has all information about the board, the players, and the game
- It additionally has the method to take the input from

### INPUT FROM DIFFERENT CLIENTS

- input Controller, last data received from whom?
- 2 clients
  - valid data - send data to game controller and switch
  - Invalid data - send data to client
