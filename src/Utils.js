const {MoveState} = require('./model/Enums.js')

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getPlayerTextForMoveState(moveState, cardIndex) {
  switch (moveState) {
    case MoveState.START_STATE:
      return 'Please draw a card from Deck or Discard'
    case MoveState.CARD_DRAWN:
      return 'Replace card in your hand or choose a discard option';
    case MoveState.DISCARD_CHOSEN:
      return 'Select the first card to turn face up'
    case MoveState.CARD_DISCARDED:
      return 'Select the second card to turn face up or pass'
    case MoveState.SWAP_CHOSEN:
      return 'Select the first card you\'d like  to swap'
    case MoveState.SWAP_IN_PROGRESS:
      return 'Selected ' + cardIndex + '. Please select a second card to swap'
    case MoveState.PRE_END_STATE:
      return 'Please select a token to claim or pass'
    case MoveState.CLAIMING_TOKEN:
      return 'Please select the first card of your run';
    default:
      return 'UNKONWN STATE DETECTED'
  }
}

export {shuffleArray, getPlayerTextForMoveState};
