export const ActionType = {
  PASS: 'PASS',
  SWAP: 'SWAP',
  CHANGE_TURN: 'CHANGE_TURN',
  TURN_FACE_UP: 'TURN_FACE_UP',
  CLAIM_TOKEN: 'CLAIM_TOKEN',
  REPLACE_CARD: 'REPLACE_CARD'
}

export const AppMode = {
  START_STATE: 'START_STATE',
  GAME: 'GAME',
  PLAYER_WIN: 'PLAYER_WIN'
}

export const DrawType = {
  DECK: 'DECK',
  DISCARD: 'DISCARD'
}

export const MoveState = {
  START_STATE:  'START_STATE',
  CARD_DRAWN: 'CARD_DRAWN',
  DISCARD_CHOSEN: 'DISCARD_CHOSEN',
  TURN_FACE_UP_CHOSEN: 'TURN_FACE_UP_CHOSEN',
  TURN_FACE_UP_IN_PROGRESS: 'TURN_FACE_UP_IN_PROGRESS',
  SWAP_CHOSEN: 'SWAP_CHOSEN',
  SWAP_IN_PROGRESS: 'SWAP_IN_PROGRESS',
  PRE_END_STATE: 'PRE_END_STATE',
  CLAIMING_TOKEN: 'CLAIMING_TOKEN',
  CHANGE_TURN_STATE: 'CHANGE_TURN_STATE',
}

export const TokenSetType = {
  STRAIGHT: 'STRAIGHT',
  SET: 'SET',
  FULL_HOUSE: 'FULL_HOUSE'
}

export const TokenType = {
  THREE_IN_A_ROW: {
    value: 'THREE_IN_A_ROW',
    viewValue: 'THREE IN A ROW',
    type: TokenSetType.STRAIGHT,
    length: 3
  },
  FOUR_IN_A_ROW: {
    value: 'FOUR_IN_A_ROW',
    viewValue: 'FOUR IN A ROW',
    type: TokenSetType.STRAIGHT,
    length: 4
  },
  FIVE_IN_A_ROW: {
    value: 'FIVE_IN_A_ROW',
    viewValue: 'FIVE IN A ROW',
    type: TokenSetType.STRAIGHT,
    length: 5
  },
  THREE_OF_A_KIND: {
    value: 'THREE_OF_A_KIND',
    viewValue: 'THREE OF A KIND',
    type: TokenSetType.SET,
    length: 3
  },
  FULL_HOUSE: {
    value: 'FULL_HOUSE',
    viewValue: 'FULL HOUSE',
    type: TokenSetType.FULL_HOUSE,
    length: 5
  }
}

export const CardValues = {
  WILD: 'WILD'
}
