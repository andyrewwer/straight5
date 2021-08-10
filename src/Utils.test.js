const {shuffleArray, getPlayerTextForMoveState} = require('./Utils.js')

test('shuffleArray shuffles array', () => {
  let array = [1, 2, 3, 4, 5, 6, 7];
  shuffleArray(array);
  expect(array).not.toEqual([1, 2, 3, 4, 5, 6, 7]);
  expect(array).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6, 7]));
});

test('getPlayerTextForMoveState', () => {
  expect(getPlayerTextForMoveState('StartState')).toBe('Please draw a card from Deck or Discard');
  expect(getPlayerTextForMoveState('SwapInProgress', 100)).toBe('Selected 100. Please select a second card to swap');
  expect(getPlayerTextForMoveState('RANDOM_STATE')).toBe('UNKONWN STATE DETECTED');
});
