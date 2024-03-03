class GameController {
  #game;
  #IOController;

  constructor(game, IOController) {
    this.#game = game;
    this.#IOController = IOController;
  }

  start() {
    this.#IOController.render(this.#game.status());

    this.#IOController.onMoveEntered((keyPressed) => {
      this.#game.consolidateMove(keyPressed);

      this.#IOController.render(this.#game.status());

      if (this.#game.status().isOver) {
        this.#IOController.stop();
      }
    });

    this.#IOController.onIllegalMoveEntered(() => {
      this.#IOController.render(this.#game.status());
    });

    this.#IOController.start();
  }
}

module.exports = { GameController };
