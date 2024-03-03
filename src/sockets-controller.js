const FORCE_QUIT_SEQUENCES = ['p'];

class SocketsController {
  #sockets;
  #keymap;
  #currentSocketIndex;
  #onLegalMove;
  #onIllegalMove;

  constructor(sockets, keymap) {
    this.#sockets = sockets;
    this.#keymap = keymap;
    this.#currentSocketIndex = 0;
  }

  onMoveEntered(sendMoveToGame) {
    this.#onLegalMove = sendMoveToGame;
  }

  onIllegalMoveEntered(repromptPlayer) {
    this.#onIllegalMove = repromptPlayer;
  }

  #generateBoard(moves) {
    let board = '\x1Bc';

    for (let i = 0; i < 9; i += 3) {
      const row = [i, i + 1, i + 2].map((x) => moves[x] || ' ').join('|');
      board += row + '\n';
    }

    return board;
  }

  #promptNextPlayer(name) {
    const socket = this.#sockets[this.#currentSocketIndex];
    socket.write(`Enter your move: ${name}\n`);
  }

  #displayWaitingMsg(name) {
    const socket = this.#sockets[(this.#currentSocketIndex + 1) % 2];
    socket.write(`Its ${name}'s Move\n`);
  }

  #renderResult(winner) {
    const result = winner ? `${winner} Won!!\n` : "It's a draw\n";

    this.#sockets.forEach((socket) => {
      socket.write(result);
    });
  }

  render({ moves, currentPlayerName, isOver, winner }) {
    const board = this.#generateBoard(moves);

    this.#sockets.forEach((socket) => {
      socket.write(board);
    });

    if (isOver) {
      this.#renderResult(winner);
      return;
    }

    this.#promptNextPlayer(currentPlayerName);
    this.#displayWaitingMsg(currentPlayerName);
  }

  #onPlayerQuit(socket) {
    const opponentPLayerSocket =
      this.#sockets[(this.#currentSocketIndex + 1) % 2];
    socket.write(`You Quited The Game, Opponent Wins\n`);
    opponentPLayerSocket.write('Opponent Left the Game, You Won\n');

    opponentPLayerSocket.end();
    socket.end();
  }

  #sendDataToGame(data, socket) {
    switch (true) {
      case FORCE_QUIT_SEQUENCES.includes(data):
        this.#onPlayerQuit(socket);
        break;
      case this.#keymap[data] === undefined:
        this.#onIllegalMove();
        socket.write(`${data} move is illegal\n`);
        break;
      default:
        this.#currentSocketIndex = (this.#currentSocketIndex + 1) % 2;
        this.#onLegalMove(this.#keymap[data]);
    }
  }

  start() {
    this.#sockets.forEach((socket, socketIndex) => {
      socket.on('data', (data) => {
        if (socketIndex === this.#currentSocketIndex) {
          this.#sendDataToGame(data.trim(), socket);
        }
      });
    });
  }

  stop() {
    this.#sockets.forEach((socket) => {
      socket.end();
    });
  }
}

module.exports = { SocketsController };
