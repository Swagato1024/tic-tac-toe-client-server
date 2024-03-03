const WINNING_SEQUENCES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

class Players {
  #players;

  constructor(player1, player2) {
    this.#players = [player1, player2];
  }

  get currentPlayerName() {
    return this.#players[0].name;
  }

  changeTurn() {
    this.#players.reverse();
  }

  recordMove(move) {
    this.#players[0].updateMoves(move);
  }

  validMove(move) {
    const movesMadeSofar = this.#players
      .flatMap(player => player.movesMade)
      .map(([move]) => move);

    return !movesMadeSofar.includes(move);
  }

  totalMovesMade() {
    return this.#players.flatMap(player => player.movesMade).length;
  }

  movesMade() {
    return Object.fromEntries(
      this.#players.flatMap(player => player.movesMade)
    );
  }

  hasWon() {
    const playerMoves = Object.fromEntries(this.#players[0].movesMade);

    return WINNING_SEQUENCES.some(sequence => {
      return sequence.every(number => number in playerMoves);
    });
  }
}

module.exports = { Players };