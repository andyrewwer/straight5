const { shuffleArray } = require('../Utils.js')
const { CardValues, TokenType } = require('../model/Enums.js')
class GameService {

  constructor(playerService, tokenService, configService, gameState) {
      this.playerService = playerService;
      this.tokenService = tokenService;
      this.configService = configService;
      this.gameState =  gameState;
  }

  createDeck() {
    const repeats = this.configService.getRepeatsPerNumber();
    const max = this.configService.getMaxNumberInDeck();
    const jokers = this.configService.getNumberOfJokers();
    this.getGameState().setDeck([]);
    for (let i = 0; i < repeats; i++) {
      for (let j = 0; j < max; j++) {
        this.getGameState().getDeck().push({value: j+1, seen: false})
      }
    }
    for (let i = 0; i < jokers; i++) {
      this.getGameState().getDeck().push({value: CardValues.WILD, seen:false})
    }
    shuffleArray(this.getGameState().getDeck());
  }

  getTopCardFromDeck() {
    if (this.getGameState().getDeck().length === 0) {
      this.getGameState().setDeck([]);
      for(let i = 0; i < this.getGameState().getDiscard().length; i ++) {
        this.getGameState().getDeck().push(...this.getGameState().getDiscard()[i].splice(0, this.getGameState().getDiscard()[i].length - 1));
      }
      shuffleArray(this.getGameState().getDeck());
    }
    const card = this.getGameState().getDeck().pop();
    card.seen = false;
    return card;
  }

  drawCardFromDeck() {
    this.getGameState().setActiveCard(this.getTopCardFromDeck());
  }

  drawCardFromDiscard(index) {
    if (this.getGameState().getDiscard()[index].length === 0) {
      console.error('SOMETHING went wrong, discard length = 0')
    }
    this.getGameState().setActiveCard(this.getGameState().getDiscard()[index].pop());
  }

  discardPileHas0Cards() {
    for (let i = 0; i < this.configService.getNumberOfDiscards(); i ++) {
      if (this.getGameState().getDiscard()[i].length === 0) {
        return i;
      }
    }
    return -1;
  }

  initializeDiscard() {
    this.getGameState().setDiscard([]);
    for (let i = 0; i < this.configService.getNumberOfDiscards(); i ++) {
      this.getGameState().getDiscard().push([]);
      this.getGameState().getDiscard()[i].push(this.getGameState().getDeck().pop());
    }
  }

  swapIsValid(index) {
    return this.getGameState().getSwapCardIndex() > 0 && this.getGameState().getSwapCardIndex() !== index;
  }

  swapCards(index) {
    const playerCards = this.getActivePlayersDeck();
    const temp = playerCards[index];
    playerCards[index] = playerCards[this.getGameState().getSwapCardIndex()];
    playerCards[this.getGameState().getSwapCardIndex()] = temp;
    this.getGameState().setSwapCardIndex(-1);
  }

  replaceCard(index) {
    const temp = this.getActivePlayersDeck()[index];
    this.getGameState().getActiveCard().seen = true;
    this.getActivePlayersDeck()[index] = this.getGameState().getActiveCard();
    this.getGameState().setActiveCard(temp);
  }

  discardCard(discardIndex) {
    this.getGameState().getDiscard()[discardIndex].push(this.getGameState().getActiveCard());
    this.getGameState().setActiveCard({});
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
    this.playerService.dealCardsToPlayers(this.getGameState().getDeck());
    this.initializeDiscard();
    this.getGameState().setSwapCardIndex(-1);
    this.getGameState().setActiveCard({});
    this.getGameState().setActivePlayerIndex(0);
    this.getGameState().setTokenToClaim('');
  }

  nextPlayer() {
    const activePlayerIndex = this.getGameState().getActivePlayerIndex();
    this.getGameState().setActivePlayerIndex(activePlayerIndex + 1 === this.configService.getNumberOfPlayers() ? 0 : activePlayerIndex + 1);
  }

//TODO call token token service directly from above?
  claimToken(index) {
    //TODO come back to this to pick discard
    //TODO come back to this to pick top card that goes to discard
    const hand = this.getActivePlayersDeck();
    switch (this.getGameState().getTokenToClaim()) {
      case TokenType.FIVE_IN_A_ROW:
      case TokenType.FULL_HOUSE:
        for (let i = 0; i < hand.length; i ++) {
          this.getGameState().getDiscard()[0].push(hand[i]);
          hand[i] = this.getTopCardFromDeck();
        }
        break;
      case TokenType.THREE_OF_A_KIND:
        let indeces = this.tokenService.getAllIndecesForSets(hand, 3)[0];
        for (let i = 0; i < 3; i++) {
            this.getGameState().getDiscard()[0].push(hand[indeces[i]]);
            hand[indeces[i]] = this.getTopCardFromDeck();
          }
        break;
      case TokenType.THREE_IN_A_ROW:
      for (let i = index; i < index + 3; i++) {
        this.getGameState().getDiscard()[0].push(hand[i]);
        hand[i] = this.getTopCardFromDeck();
        hand[i].seen = false;
      }
        break;
      case TokenType.FOUR_IN_A_ROW:
      for (let i = index; i < index + 4; i++) {
        this.getGameState().getDiscard()[0].push(hand[i]);
        hand[i] = this.getTopCardFromDeck();
      }
        break;
      default:
        console.error('something went wrong');
        return
    }
    this.getActivePlayersTokens().push(this.getGameState().getTokenToClaim());
    this.getGameState().setTokenToClaim('');
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

  getGameState()  {
    return this.gameState;
  }

  setGameState(gameState) {
    this.gameState = gameState;
  }

  getActivePlayersTokens() {
    return this.playerService.getPlayers()[this.getGameState().getActivePlayerIndex()].getTokens();
  }

  getActivePlayersDeck() {
    return this.playerService.getPlayers()[this.getGameState().getActivePlayerIndex()].getDeck();
  }
}

export {GameService};
