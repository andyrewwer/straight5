const { shuffleArray } = require('../Utils.js')
const { TokenType } = require('../model/Enums.js')
class GameService {

  constructor(playerService, tokenService, configService) {
      this.playerService = playerService;
      this.tokenService = tokenService;
      this.configService = configService;

      this.deck = [];
      this.discard = [[]];
      this.swapCardIndex = -1;
      this.activeCard = {};
      this.activePlayerIndex = 0;
      this.tokenToClaim = '';
  }

  createDeck() {
    const repeats = this.configService.getRepeatsPerNumber();
    const max = this.configService.getMaxNumberInDeck();
    this.deck = [];
    for (let i = 0; i < repeats; i++) {
      for (let j = 0; j < max; j++) {
        this.deck.push({value: j+1, seen: false})
      }
    }
    shuffleArray(this.deck);
  }

  getTopCardFromDeck() {
    if (this.getDeck().length === 0) {
      this.setDeck([]);
      for(let i = 0; i < this.getDiscard().length; i ++) {
        this.getDeck().push(...this.getDiscard()[i].splice(0, this.getDiscard()[i].length - 1));
      }
      shuffleArray(this.getDeck());
    }
    const card = this.getDeck().pop();
    card.seen = false;
    return card;
  }

  drawCardFromDeck() {
    this.setActiveCard(this.getTopCardFromDeck());
  }

  drawCardFromDiscard(index) {
    if (this.getDiscard()[index].length === 0) {
      console.error('SOMETHING went wrong, discard length = 0')
    }
    this.setActiveCard(this.getDiscard()[index].pop());
  }

  discardPileHas0Cards() {
    for (let i = 0; i < this.configService.getNumberOfDiscards(); i ++) {
      if (this.getDiscard()[i].length === 0) {
        return i;
      }
    }
    return -1;
  }

  initializeDiscard() {
    this.setDiscard([]);
    for (let i = 0; i < this.configService.getNumberOfDiscards(); i ++) {
      this.getDiscard().push([]);
      this.getDiscard()[i].push(this.getDeck().pop());
    }
  }

  swapIsValid(index) {
    return this.getSwapCardIndex() > 0 && this.getSwapCardIndex() !== index;
  }

  swapCards(index) {
    const playerCards = this.getActivePlayersDeck();
    const temp = playerCards[index];
    playerCards[index] = playerCards[this.swapCardIndex];
    playerCards[this.swapCardIndex] = temp;
    this.setSwapCardIndex(-1);
  }

  replaceCard(index) {
    const temp = this.getActivePlayersDeck()[index];
    this.getActiveCard().seen = true;
    this.getActivePlayersDeck()[index] = this.getActiveCard();
    this.setActiveCard(temp);
  }

  discardCard(discardIndex) {
    this.getDiscard()[discardIndex].push(this.getActiveCard());
    this.setActiveCard({});
  }

  turnCardFaceUp(index) {
    const card = this.getActivePlayersDeck()[index];
    if (this.getActivePlayersDeck()[index].seen === true) {
      return false;
    }
    card.seen = true;
    return true;
  }

  startNewGame() {
    this.createDeck();
    this.playerService.dealCardsToPlayers(this.getDeck());
    this.initializeDiscard();
    this.setSwapCardIndex(-1);
    this.setActiveCard({});
    this.setActivePlayerIndex(0);
    this.setTokenToClaim('');
  }

  nextPlayer() {
    this.setActivePlayerIndex(this.getActivePlayerIndex() + 1 === this.configService.getNumberOfPlayers() ? 0 : this.getActivePlayerIndex() + 1);
  }

//TODO call token token service directly from above?
  claimToken(index) {
    //TODO come back to this to pick discard
    //TODO come back to this to pick top card
    const deck = this.getActivePlayersDeck();
    switch (this.getTokenToClaim()) {
      case TokenType.FIVE_IN_A_ROW:
      case TokenType.FULL_HOUSE:
        for (let i = 0; i < deck.length; i ++) {
          this.getDiscard()[0].push(deck[i]);
          deck[i] = this.getTopCardFromDeck();
        }
        break;
      case TokenType.THREE_OF_A_KIND:
        let indeces = this.tokenService.getAllIndecesForSets(deck, 3)[0];
        for (let i = 0; i < 3; i++) {
            this.getDiscard()[0].push(deck[indeces[i]]);
            deck[indeces[i]] = this.getTopCardFromDeck();
          }
        break;
      case TokenType.THREE_IN_A_ROW:
      for (let i = index; i < index + 3; i++) {
        this.getDiscard()[0].push(deck[i]);
        deck[i] = this.getTopCardFromDeck();
        deck[i].seen = false;
      }
        break;
      case TokenType.FOUR_IN_A_ROW:
      for (let i = index; i < index + 4; i++) {
        this.getDiscard()[0].push(deck[i]);
        deck[i] = this.getTopCardFromDeck();
      }
        break;
      default:
        console.error('something went wrong');
        return
    }
    this.getActivePlayersTokens().push(this.getTokenToClaim());
    this.setTokenToClaim('');
  }

  activePlayerHasAllCardsFaceUp() {
    const playerDeck = this.getActivePlayersDeck()
    for (let i = 0; i < playerDeck.length; i++) {
      if (!playerDeck[i].seen) {
        return false;
      }
    }
    return true;
  }

  getActivePlayersTokens() {
    return this.playerService.getPlayers()[this.getActivePlayerIndex()].getTokens();
  }

  getActivePlayersDeck() {
    return this.playerService.getPlayers()[this.getActivePlayerIndex()].getDeck();
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

export {GameService};
