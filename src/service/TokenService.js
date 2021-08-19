const { shuffleArray } = require('../Utils.js')
const { TokenType } = require('../model/Enums.js')

class TokenService {

  constructor() {
  }

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
        const indecesForFullHouse = this.getAllIndecesForSets(deck, 2);
        return indecesForFullHouse.length === 2 && (indecesForFullHouse[0].length + indecesForFullHouse[1].length) === 5
   }
    return false;
  }

  //TODO Refactor away?
  //TODO refactor for three/four/five in a row can be simpler. Maybe change on ENUM side
  isValidIndexForToken(token, deck, index) {
    let possibleIndeces = [];
    switch (token) {
      case TokenType.THREE_IN_A_ROW:
        possibleIndeces = this.getAllIndecesForStraight(deck, 3);
        //get all the possible straights for 3 in a row
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
        const indecesForFullHouse = this.getAllIndecesForSets(deck, 2);
        //no logic here yet
        return indecesForFullHouse.length === 2 && (indecesForFullHouse[0].length + indecesForFullHouse[1].length) === 5
   }

    return false;
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
      if (this.canClaimToken(TokenType.FULL_HOUSE, deck, []))  {
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
      for (let j = i + 1; j < straight_length + i; j ++) {
        if (!deck[j].seen || deck[j].value !== deck[j-1].value + 1) {
          break;
        }
        indeces.push(j)
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

    for (let key of Object.keys(map)) {
      if (map[key].length >= set_length) {
        returnArray.push(map[key]);
      }
    }
    return returnArray
  }
}

export {TokenService};
