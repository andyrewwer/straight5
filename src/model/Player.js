class Player {

  constructor(deck, tokens) {
      this.deck = deck;
      this.tokens = tokens;
  }

  getDeck() {
    return this.deck;
  }

  getTokens() {
    return this.tokens;
  }

  setDeck(deck) {
    this.deck = deck;
  }

  setTokens(tokens) {
    this.tokens = tokens;
  }
}

export {Player};
