const { shuffleArray } = require('../Utils.js')

class GameService {

  constructor(numPlayers, playerService) {
      this.numPlayers = numPlayers;
      this.playerService = playerService;

      this.deck = [];
      this.discard = [];
      this.swapCardIndex = -1;
      this.activeCard = {};
      this.activePlayerIndex = 0;
      this.tokenToClaim = '';
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

  getTopCardFromDeck() {
    if (this.getDeck().length === 0) {
      this.setDeck(shuffleArray(this.getDiscard().splice(0, this.getDiscard().length - 1)));
    }
    const card = this.getDeck().pop();
    card.seen = false;
    return card;
  }

  drawCardFromDeck() {
    this.setActiveCard(this.getTopCardFromDeck());
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
    const playerCards = this.getActivePlayersDeck();
    const temp = playerCards[index];
    playerCards[index] = playerCards[this.swapCardIndex];
    playerCards[this.swapCardIndex] = temp;
    this.setSwapCardIndex(-1);
  }

  replaceCard(index) {
    this.getActiveCard().seen = true;
    this.getDiscard().push(this.getActivePlayersDeck()[index])
    this.getActivePlayersDeck()[index] = this.getActiveCard();
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

  discardActiveCard() {
    this.getDiscard().push(this.getActiveCard());
    this.setActiveCard({});
  }

  startNewGame() {
    this.createDeck();
    this.playerService.dealCardsToPlayers(this.getDeck());
    this.initializeDiscard();
  }

  activePlayerCanClaimToken() {
    return this.canClaimToken('THREE_IN_A_ROW') ||
     this.canClaimToken('FOUR_IN_A_ROW') ||
     this.canClaimToken('FIVE_IN_A_ROW') ||
     this.canClaimToken('THREE_OF_A_KIND') ||
     this.canClaimToken('FULL_HOUSE');
  }

  canClaimToken(token) {
    const deck = this.getActivePlayersDeck();
    const existing_tokens = this.getActivePlayersTokens();
    if (existing_tokens.includes(token)) {
      return false;
    }

    switch (token) {
      case 'THREE_IN_A_ROW':
        for (let j = 0; j < 3; j ++) {
          let won = true;
          if (!deck[j].seen) {
            continue
          }
          for (let i = j+1; i < 3+j; i ++) {
            if (!deck[i].seen || deck[i].value !== deck[i-1].value + 1) {
              won = false;
              break;
            }
          }
          if (won) {
            return true
          }
        }
        return false;
      case 'FOUR_IN_A_ROW':
        for (let j = 0; j < 2; j ++) {
          let won = true;
          if (!deck[j].seen) {
            continue
          }
          for (let i = j+1; i < 4+j; i ++) {
            if (!deck[i].seen || deck[i].value !== deck[i-1].value + 1) {
              won = false;
              break;
            }
          }
          if (won) {
            return true
          }
        }
        return false;
      case 'FIVE_IN_A_ROW':
        if (!deck[0].seen) {
          return false
        }
        for (let i = 1; i < 5; i ++) {
          if (!deck[i].seen || deck[i].value !== deck[i-1].value + 1) {
            return false
          }
        }
        return true;
      case 'THREE_OF_A_KIND':
        let three_map = {};
        for (let i = 0; i < 5; i++) {
          if (!deck[i].seen) {
            continue;
          }
          if (!three_map[deck[i].value]) {
            three_map[deck[i].value] = 0
          }
          three_map[deck[i].value] = three_map[deck[i].value] + 1
        }

        for (let key of Object.keys(three_map)) {
          if (three_map[key] >= 3) {
            return true;
          }
        }
        return false;
      case 'FULL_HOUSE':
        let fh_map = {};
        for (let i = 0; i < 5; i++) {
          if (!deck[i].seen) {
            continue;
          }
          if (!fh_map[deck[i].value]) {
            fh_map[deck[i].value] = 0
          }
          fh_map[deck[i].value] = fh_map[deck[i].value] + 1
        }
        const keys = Object.keys(fh_map);
        if (keys.length !== 2) {
          return false;
        }
        return (fh_map[keys[0]] === 2 && fh_map[keys[1]] === 3) || (fh_map[keys[0]] === 3 && fh_map[keys[1]] === 2)
    }
    return false;
  }

  nextPlayer() {
    this.setActivePlayerIndex(this.getActivePlayerIndex() + 1 === this.numPlayers ? 0 : this.getActivePlayerIndex() + 1);
  }

  isValidIndexForToken(index) {
    const deck = this.getActivePlayersDeck();
    if (["THREE_OF_A_KIND", "FULL_HOUSE", "FIVE_IN_A_ROW"].includes(this.getTokenToClaim())) {
      return this.canClaimToken(deck, this.getTokenToClaim(), this.getActivePlayersTokens());
    }
    if (this.getTokenToClaim() === 'THREE_IN_A_ROW') {
      // if index is 3 that is 4th card. 3+4 not enough cards for THREE_IN_A_ROW
      if (!deck[index].seen || index >= 3) {
        return false;
      }
      let prev = deck[index].value;
      for (let i = index + 1; i < index + 3; i++) {

        if (!deck[i].seen || deck[i].value !== ++prev)  {
          return false;
        }
      }
      return true;
    }
    if (this.getTokenToClaim() === 'FOUR_IN_A_ROW') {
      // if index is 2 that is 3rd card. 2+3+4 not enough cards for THREE_IN_A_ROW
      if (!deck[index].seen || index >= 2) {
        return false;
      }
      let prev = deck[index].value;
      for (let i = index + 1; i < index + 4; i++) {

        if (!deck[i].seen || deck[i].value !== ++prev)  {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  claimToken(index) {
    const deck = this.getActivePlayersDeck();
    switch (this.getTokenToClaim()) {
      case 'FIVE_IN_A_ROW':
      case 'FULL_HOUSE':
        for (let i = 0; i < deck.length; i ++) {
          this.getDiscard().push(deck[i]);
          deck[i] = this.getTopCardFromDeck();
        }
        break;
      case 'THREE_OF_A_KIND':
        let three_map = {};
        for (let i = 0; i < 5; i++) {
          if (!deck[i].seen) {
            continue;
          }
          if (!three_map[deck[i].value]) {
            three_map[deck[i].value] = []
          }
          three_map[deck[i].value].push(i);
          if (three_map[deck[i].value].length >= 3) {
            const list = three_map[deck[i].value];
            for (let j = 0; j < list.length; j ++) {
              this.getDiscard().push(deck[list[j]]);
              deck[list[j]] = this.getTopCardFromDeck();
            }
            break;
          }
        }
        break;
      case 'THREE_IN_A_ROW':
      for (let i = index; i < index + 3; i++) {
        this.getDiscard().push(deck[i]);
        deck[i] = this.getTopCardFromDeck();
        deck[i].seen = false;
      }
        break;
      case 'FOUR_IN_A_ROW':
      for (let i = index; i < index + 4; i++) {
        this.getDiscard().push(deck[i]);
        deck[i] = this.getTopCardFromDeck();
      }
        break;
      default:
        console.error('something went wrong');
        return
    }
    this.getActivePlayersTokens().push(this.getTokenToClaim());
    this.setTokenToClaim('');

    // discard cards from index
    // push token to player
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

module.exports = {GameService};
