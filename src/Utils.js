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

export {shuffleArray, getPlayerTextForMoveState};
