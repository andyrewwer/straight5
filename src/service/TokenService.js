const { TokenType,CardValues } = require('../model/Enums.js')

class TokenService {

  playerCanClaimToken(player) {
    return this.canClaimToken(TokenType.THREE_IN_A_ROW, player.getDeck(), player.getTokens()) ||
    this.canClaimToken(TokenType.FOUR_IN_A_ROW, player.getDeck(), player.getTokens()) ||
    this.canClaimToken(TokenType.FIVE_IN_A_ROW, player.getDeck(), player.getTokens()) ||
    this.canClaimToken(TokenType.THREE_OF_A_KIND, player.getDeck(), player.getTokens()) ||
    this.canClaimToken(TokenType.FULL_HOUSE, player.getDeck(), player.getTokens());
  }

  canClaimToken(token, deck, existing_tokens) {
    //TODO does this logic belong here?
    if (existing_tokens.includes(token)) {
      return false;
    }

    switch (token) {
      case TokenType.THREE_IN_A_ROW:
        return this.getAllIndecesForStraight(deck, 3).length > 0
      case TokenType.FOUR_IN_A_ROW:
        return this.getAllIndecesForStraight(deck, 4).length > 0
      case TokenType.FIVE_IN_A_ROW:
        return this.getAllIndecesForStraight(deck, 5).length > 0
      case TokenType.THREE_OF_A_KIND:
        return this.getAllIndecesForSets(deck, 3).length > 0
      case TokenType.FULL_HOUSE:
        return this.isFullHouse(deck)
      default:
        return false;
   }
  }

  //TODO Refactor away?
  //TODO refactor for three/four/five in a row can be simpler. Maybe change on ENUM side
  isValidIndexForToken(token, deck, index) {
    let possibleIndeces = [];
    switch (token) {
      case TokenType.THREE_IN_A_ROW:
        possibleIndeces = this.getAllIndecesForStraight(deck, 3);
        for (let i = 0; i < possibleIndeces.length; i++) {
          if(index === possibleIndeces[i][0]) {
            return true
          }
        }
        return false
      case TokenType.FOUR_IN_A_ROW:
        possibleIndeces = this.getAllIndecesForStraight(deck, 4);
        for (let i = 0; i < possibleIndeces.length; i++) {
          if(index === possibleIndeces[i][0]) {
            return true
          }
        }
        return false
      case TokenType.FIVE_IN_A_ROW:
        possibleIndeces = this.getAllIndecesForStraight(deck, 5);
        for (let i = 0; i < possibleIndeces.length; i++) {
          if(index === possibleIndeces[i][0]) {
            return true
          }
        }
        return false
      case TokenType.THREE_OF_A_KIND:
        possibleIndeces = this.getAllIndecesForSets(deck, 3);
        for (let i = 0; i < possibleIndeces.length; i++) {
          if(possibleIndeces[i].includes(index)) {
            return true
          }
        }
        return false
      case TokenType.FULL_HOUSE:
        return this.isFullHouse(deck)
      default:
        return false;
   }
  }

  getAllIndecesForToken(deck, token) {
    if (token === TokenType.THREE_IN_A_ROW) {
      return this.getAllIndecesForStraight(deck, 3);
    }
    if (token === TokenType.FOUR_IN_A_ROW) {
      return this.getAllIndecesForStraight(deck, 4);
    }
    if (token === TokenType.FIVE_IN_A_ROW) {
      return this.getAllIndecesForStraight(deck, 5);
    }
    if (token === TokenType.THREE_OF_A_KIND) {
      return this.getAllIndecesForSets(deck, 3);
    }
    if (token === TokenType.FULL_HOUSE) {
      if (this.isFullHouse(deck))  {
        return [[0,1,2,3,4]];
      }
    }
    return []
  }

  getAllIndecesForStraight(deck, straight_length) {
    //assumes hand size of 5. If 4 in a row 6 - 4 = 2, 1234 or 2345 so ✅
    const count_options_to_make_straight_length = 6 - straight_length;
    let possible_combinations = []
    for (let i = 0; i < count_options_to_make_straight_length; i ++) {
      let indeces = []
      if (!deck[i].seen) {
        continue
      }
      indeces.push(i)
      let prev_value = deck[i].value;
      if (deck[i].value === CardValues.WILD) {
        prev_value = deck[i+1].value - 1
      }

      for (let j = i + 1; j < straight_length + i; j ++) {
        if (!deck[j].seen) {
          break;
        }
        if (deck[j].value === prev_value + 1 || deck[j].value === CardValues.WILD) {
          indeces.push(j)
          prev_value++;
        }
      }
      if (indeces.length === straight_length) {
        possible_combinations.push(indeces)
      }
    }
    return possible_combinations;
  }

  getAllIndecesForSets(deck, set_length) {
    let returnArray = []
    let map = {};
    for (let i = 0; i < 5; i++) {
      if (!deck[i].seen) {
        continue;
      }
      if (!map[deck[i].value]) {
        map[deck[i].value] = []
      }
      map[deck[i].value].push(i)
    }
    let wildMap = [];
    if (!!map[CardValues.WILD]) {
      wildMap = map[CardValues.WILD];
    }
    for (let key of Object.keys(map)) {
      if (key === CardValues.WILD) {
        if (map[key].length>= set_length) {
          returnArray.push(map[key]);
        }
      } else {
        if (map[key].length + wildMap.length >= set_length) {
          returnArray.push(map[key].concat(wildMap));
        }
      }
    }
    return returnArray
  }

  isFullHouse(deck) {
    let returnArray = []
    let map = {};
    for (let i = 0; i < 5; i++) {
      // with hand size 5, all cards need to be seen
      if (!deck[i].seen) {
        return false;
      }
      if (!map[deck[i].value]) {
        map[deck[i].value] = []
      }
      // Full House has to be 2 cards + WILDS possible
      if (Object.keys(map).length > 3 || Object.keys(map).length === 3 && !Object.keys(map).includes(CardValues.WILD)) {
        return false;
      }
      map[deck[i].value].push(i)
    }
    let wildMap = [];
    // at this point only 3 cards, 2 values + wild.
    if (!!map[CardValues.WILD]) {
      // if two wilds, its FH no matter what (e.g. W W 1 1 2, or W W 1 1 1)
      if (map[CardValues.WILD].length >= 2) {
        return true;
      }
      // if one wilds, and two other numbers its FH no matter what (e.g. W 2 1 1 2, or W 2 1 1 1)
      if (map[CardValues.WILD].length === 1 && Object.keys(map).length === 3) {
        return true;
      }
      // case where there one wild but then four of another value e.g. W 1 1 1 1 ->
      return false;
    }
    const numFirstDigit = map[Object.keys(map)[0]].length;
    const numSecondDigit = map[Object.keys(map)[1]].length;
    return (numFirstDigit === 3 && numSecondDigit === 2)  ||
              (numFirstDigit === 2 && numSecondDigit === 3);
  }
}

export {TokenService};
