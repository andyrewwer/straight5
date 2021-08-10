class Player {

  constructor(deck, tokens) {
      this.deck = deck;
      this.tokens = tokens; // THREE_IN_A_ROW, FOUR_IN_A_ROW, FIVE_IN_A_ROW, THREE_OF_A_KIND, FULL_HOUSE
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

module.exports = {Player};
