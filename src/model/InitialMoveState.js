class InitialMoveState {

  constructor(initialDeck, initialDiscard, players) {
      this.initialDeck = initialDeck;
      this.initialDiscard = initialDiscard;
      this.players = players;
  }

  getInitialDeck() {
    return this.initialDeck;
  }

  getInitialDiscard() {
    return this.initialDiscard;
  }

  getPlayers() {
    return this.players;
  }

  setInitialDeck(initialDeck) {
    this.initialDeck = initialDeck;
  }

  setInitialDiscard(initialDiscard) {
    this.initialDiscard = initialDiscard;
  }

  setPlayers(players) {
    this.players = players;
  }
}

export {InitialMoveState};
