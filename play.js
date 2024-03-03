const net = require('node:net');
const { Game } = require('./src/game');
const { GameController } = require('./src/game-controller');
const { Player } = require('./src/player');
const { Players } = require('./src/players');
const { SocketsController } = require('./src/sockets-controller');

const SYMBOLS = ['O', 'X'];

const keymap = {
  q: 0,
  w: 1,
  e: 2,
  a: 3,
  s: 4,
  d: 5,
  z: 6,
  x: 7,
  c: 8,
};

const conductGame = (clients) => {
  const sockets = clients.map(({ client }) => client);
  const playerObjects = clients.map(({ player }) => player);

  const ioController = new SocketsController(sockets, keymap);
  const players = new Players(...playerObjects);
  const game = new Game(players);
  const gameController = new GameController(game, ioController);

  gameController.start();
};

const initiateGame = (clients) => {
  const players = [];
  clients.forEach((client, clientIndex) => {
    client.write('\nEnter your name: ');

    client.once('data', (name) => {
      const player = new Player(name.trim(), SYMBOLS[clientIndex]);
      players.push({ client, player });

      const bothPlayerEnteredName = players.length === 2;

      if (bothPlayerEnteredName) conductGame(players);
    });
  });
};

const main = () => {
  const gameServer = net.createServer();
  gameServer.listen(8000, () => console.log('Tic Tac Toe Server is Live'));
  const clients = { old: [], new: [] };

  gameServer.on('connection', (socket) => {
    socket.setEncoding('utf-8');
    clients.new.push(socket);

    if (clients.new.length === 2) {
      initiateGame(clients.new);
      clients.old.push(...clients.new);
      clients.new = [];
      return;
    }

    clients.new[0].write('Waiting for Another Player\n');
  });
};

main();
