const {Player} = require('../model/Player.js');

class PlayerService {

  constructor(numPlayers) {
    this.numPlayers = numPlayers;
    this.players = [];
    for (let i = 0; i < numPlayers; i ++) {
      this.players.push(new Player([], []));
    }
  }

  dealCardsToPlayers(deck) {
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < this.getPlayers().length; i ++) {
        this.players[i].getDeck().push(deck.pop());
      }
    }
  }

  getPlayers() {
    return this.players;
  }

  setPlayers(players) {
    this.players = players;
  }

  getNumberOfPlayers() {
    return this.numPlayers;
  }
}

export {PlayerService};
