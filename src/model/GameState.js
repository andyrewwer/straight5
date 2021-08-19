class GameState {

  constructor() {
    this.deck = [];
    this.discard = [[]];
    this.swapCardIndex = -1;
    this.activeCard = {};
    this.activePlayerIndex = 0;
    this.tokenToClaim = '';
  }

  getDeck() {
    return this.deck;
  }

  getDiscard() {
    return this.discard;
  }

  getSwapCardIndex() {
    return this.swapCardIndex;
  }

  getActiveCard() {
    return this.activeCard;
  }

  getActivePlayerIndex() {
    return this.activePlayerIndex;
  }

  getTokenToClaim() {
    return this.tokenToClaim;
  }

  setDeck(deck) {
    this.deck = deck;
  }

  setDiscard(discard) {
    this.discard = discard;
  }

  setSwapCardIndex(swapCardIndex) {
    this.swapCardIndex = swapCardIndex;
  }

  setActiveCard(activeCard) {
    this.activeCard = activeCard;
  }

  setActivePlayerIndex(activePlayerIndex) {
    this.activePlayerIndex = activePlayerIndex;
  }

  setTokenToClaim(tokenToClaim) {
    this.tokenToClaim = tokenToClaim;
  }
}

export {GameState};
