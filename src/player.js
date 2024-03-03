class Player {
  #name;
  #icon;
  #moves;

  constructor(name, icon) {
    this.#name = name;
    this.#icon = icon;
    this.#moves = new Set();
  }

  get name() {
    return this.#name;
  }

  get movesMade() {
    return [...(this.#moves)].map(move => [move, this.#icon]);
  }

  updateMoves(playerMove) {
    this.#moves.add(playerMove);
  }
}

module.exports = { Player };