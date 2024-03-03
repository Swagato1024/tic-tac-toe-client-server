class Game {
  #players;
  #isOver;
  #winner;

  constructor(players) {
    this.#players = players;
    this.#isOver = false;
    this.#winner = null;
  }

  consolidateMove(move) {
    if (!this.#players.validMove(move)) return;

    this.#players.recordMove(move);

    if (this.#players.hasWon()) {
      this.#isOver = true;
      this.#winner = this.#players.currentPlayerName;
      return;
    }

    if (this.#players.totalMovesMade() === 9) {
      this.#isOver = true;
      return;
    }

    this.#players.changeTurn();
  }

  status() {
    return {
      moves: this.#players.movesMade(),
      currentPlayerName: this.#players.currentPlayerName,
      winner: this.#winner,
      isOver: this.#isOver,
    };
  }
}

module.exports = { Game };
