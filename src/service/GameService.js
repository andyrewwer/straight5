const { shuffleArray, canClaimToken } = require('../Utils.js')

class GameService {

  constructor(numPlayers, deck = [], discard = [], players = [], swapCardIndex = -1, activeCard = {}, playersTokens = [], activePlayerIndex = 0) {
      this.numPlayers = numPlayers;
      this.deck = deck;
      this.discard = discard;
      this.players = players;
      this.swapCardIndex = swapCardIndex;
      this.activeCard = activeCard;
      this.playersTokens = playersTokens;// THREE_IN_A_ROW, FOUR_IN_A_ROW, FIVE_IN_A_ROW, THREE_OF_A_KIND, FULL_HOUSE
      this.activePlayerIndex = activePlayerIndex;
  }

  createDeck(repeats = 6, max = 9) {
    this.deck = [];
    for (let i = 0; i < repeats; i++) {
      for (let j = 0; j < max; j++) {
        this.deck.push({value: j+1, seen: false})
      }
    }
    shuffleArray(this.deck);
  }

  dealCardsToPlayers() {
    this.setPlayers([]);
    this.setPlayersTokens([]);
    for (let i = 0; i < this.numPlayers; i ++) {
      this.players.push([])
      this.getPlayersTokens().push([]);
      for (let j = 0; j < 5; j ++) {
        this.players[i].push(this.getDeck().pop());
      }
    }
    return this.players;
  }

  drawCardFromDeck() {
    if (this.getDeck().length === 0) {
      this.setDeck(shuffleArray(this.getDiscard().splice(0, this.getDiscard().length - 1)));
    }
    this.setActiveCard(this.getDeck().pop());
  }

  drawCardFromDiscard() {
    if (this.getDiscard().length === 0) {
      console.error('SOMETHING went wrong,  discard length = 0')
    }
    this.setActiveCard(this.getDiscard().pop());
  }

  initializeDiscard() {
    this.discard.push(this.deck.pop());
  }

  swapIsValid(index) {
    return this.getSwapCardIndex() > 0 && this.getSwapCardIndex() !== index;
  }

  swapCards(index) {
    const playerCards = this.getPlayers()[this.getActivePlayerIndex()];
    const temp = playerCards[index];
    playerCards[index] = playerCards[this.swapCardIndex];
    playerCards[this.swapCardIndex] = temp;
    this.setSwapCardIndex(-1);
  }

  replaceCard(index) {
    this.getActiveCard().seen = true;
    this.getDiscard().push(this.getPlayers()[this.getActivePlayerIndex()][index])
    this.getPlayers()[this.getActivePlayerIndex()][index] = this.getActiveCard();
    this.setActiveCard({});
  }

  turnCardFaceUp(index) {
    const card = this.getPlayers()[this.getActivePlayerIndex()][index];
    if (this.getPlayers()[this.getActivePlayerIndex()][index].seen === true) {
      return false;
    }
    card.seen = true;
    return true;
  }

  discardActiveCard() {
    this.getDiscard().push(this.getActiveCard());
    this.setActiveCard({});
  }

  startNewGame() {
    this.createDeck();
    this.dealCardsToPlayers();
    this.initializeDiscard();
  }

  activePlayerCanClaimToken() {
    const activePlayer = this.getPlayers()[this.getActivePlayerIndex()];
    return canClaimToken(activePlayer, 'THREE_IN_A_ROW', this.getActivePlayersTokens()) ||
     canClaimToken(activePlayer, 'FOUR_IN_A_ROW', this.getActivePlayersTokens()) ||
     canClaimToken(activePlayer, 'FIVE_IN_A_ROW', this.getActivePlayersTokens()) ||
     canClaimToken(activePlayer, 'THREE_OF_A_KIND', this.getActivePlayersTokens()) ||
     canClaimToken(activePlayer, 'FULL_HOUSE', this.getActivePlayersTokens());
  }

  nextPlayer() {
    this.setActivePlayerIndex(this.getActivePlayerIndex() + 1 === this.numPlayers ? 0 : this.getActivePlayerIndex() + 1);
  }

  getActivePlayersTokens() {
    return this.getPlayersTokens()[this.getActivePlayerIndex()];
  }

  getDeck() {
    return this.deck;
  }

  getDiscard() {
    return this.discard;
  }

  getPlayers() {
    return this.players;
  }

  getSwapCardIndex() {
    return this.swapCardIndex;
  }

  getActiveCard() {
    return this.activeCard;
  }

  getPlayersTokens() {
    return this.playersTokens;
  }

  getActivePlayerIndex() {
    return this.activePlayerIndex;
  }

  setDeck(deck) {
    this.deck = deck;
  }

  setDiscard(discard) {
    this.discard = discard;
  }

  setPlayers(players) {
    this.players = players;
  }

  setSwapCardIndex(swapCardIndex) {
    this.swapCardIndex = swapCardIndex;
  }

  setActiveCard(activeCard) {
    this.activeCard = activeCard;
  }

  setPlayersTokens(playersTokens) {
    this.playersTokens = playersTokens;
  }

  setActivePlayerIndex(activePlayerIndex) {
    this.activePlayerIndex = activePlayerIndex;
  }
}

module.exports = {GameService};
