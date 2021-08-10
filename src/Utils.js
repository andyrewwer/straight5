function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getPlayerTextForMoveState(moveState, cardIndex) {
  switch (moveState) {
    case "StartState":
      return 'Please draw a card from Deck or Discard'
    case "CardDrawn":
      return 'Replace card in your hand or choose a discard option';
    case "DiscardChosen":
      return 'Select the first card to discard or pass'
    case "CardDiscarded":
      return 'Select the second card to discard or pass'
    case "SwapChosen":
      return 'Select the first card you\'d like  to swap'
    case "SwapInProgress":
      return 'Selected ' + cardIndex + '. Please select a second card to swap'
    case "PreEndState":
      return 'Please select a token to claim or pass'
    case "ClaimingToken":
      return 'Please select the first card of your run';
    default:
      return 'UNKONWN STATE DETECTED'
  }
}

function canClaimToken(deck, token, existing_tokens) {
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


module.exports = {shuffleArray, getPlayerTextForMoveState, canClaimToken};
