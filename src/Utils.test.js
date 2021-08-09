const {shuffleArray, getPlayerTextForMoveState, canClaimToken} = require('./Utils.js')

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

test('canClaimToken THREE_IN_A_ROW basics pass', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}], 'THREE_IN_A_ROW', [])).toBe(true);
  expect(canClaimToken([{seen: false, value:10}, {seen: true, value:5}, {seen: true, value:6}, {seen: true, value:7}, {seen: true, value:9}], 'THREE_IN_A_ROW', [])).toBe(true);
  expect(canClaimToken([{seen: false, value:0}, {seen: false, value:1}, {seen: true, value:4}, {seen: true, value:5}, {seen: true, value:6}], 'THREE_IN_A_ROW', [])).toBe(true);
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}], 'THREE_IN_A_ROW', [])).toBe(true);
});

test('canClaimToken THREE_IN_A_ROW error cases', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: false, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}], 'THREE_IN_A_ROW', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:10}, {seen: true, value:5}, {seen: true, value:7}, {seen: true, value:5}, {seen: true, value:9}], 'THREE_IN_A_ROW', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}], 'THREE_IN_A_ROW', ['THREE_IN_A_ROW'])).toBe(false);

});

test('canClaimToken FOUR_IN_A_ROW basics pass', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:0}], 'FOUR_IN_A_ROW', [])).toBe(true);
  expect(canClaimToken([{seen: false, value:10}, {seen: true, value:5}, {seen: true, value:6}, {seen: true, value:7}, {seen: true, value:8}], 'FOUR_IN_A_ROW', [])).toBe(true);
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}], 'FOUR_IN_A_ROW', [])).toBe(true);
});

test('canClaimToken FOUR_IN_A_ROW error cases', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: false, value:2}, {seen: true, value:3}, {seen: true, value:0}], 'FOUR_IN_A_ROW', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:10}, {seen: true, value:5}, {seen: true, value:7}, {seen: true, value:5}, {seen: true, value:9}], 'FOUR_IN_A_ROW', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}], 'FOUR_IN_A_ROW', ['FOUR_IN_A_ROW'])).toBe(false);
});

test('canClaimToken FIVE_IN_A_ROW basics pass', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}], 'FIVE_IN_A_ROW', [])).toBe(true);
});

test('canClaimToken FIVE_IN_A_ROW error cases', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: false, value:2}, {seen: true, value:3}, {seen: true, value:4}], 'FIVE_IN_A_ROW', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:10}, {seen: true, value:5}, {seen: true, value:7}, {seen: true, value:5}, {seen: true, value:9}], 'FIVE_IN_A_ROW', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}], 'FIVE_IN_A_ROW', ['FIVE_IN_A_ROW'])).toBe(false);
});

test('canClaimToken THREE_OF_A_KIND basics pass', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:0}, {seen: true, value:2}, {seen: true, value:2}, {seen: true, value:2}], 'THREE_OF_A_KIND', [])).toBe(true);
  expect(canClaimToken([{seen: false, value:2}, {seen: true, value:5}, {seen: true, value:6}, {seen: true, value:5}, {seen: true, value:5}], 'THREE_OF_A_KIND', [])).toBe(true);
  expect(canClaimToken([{seen: true, value:0}, {seen: false, value:0}, {seen: true, value:0}, {seen: false, value:0}, {seen: true, value:0}], 'THREE_OF_A_KIND', [])).toBe(true);
});

test('canClaimToken THREE_OF_A_KIND error cases', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:0}, {seen: false, value:2}, {seen: true, value:2}, {seen: true, value:2}], 'THREE_OF_A_KIND', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:0}, {seen: false, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}], 'THREE_OF_A_KIND', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:0}, {seen: false, value:0}, {seen: true, value:0}, {seen: false, value:0}, {seen: true, value:0}], 'THREE_OF_A_KIND', ['THREE_OF_A_KIND'])).toBe(false);
});

test('canClaimToken FULL_HOUSE basics pass', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:0}, {seen: true, value:0}, {seen: true, value:1}], 'FULL_HOUSE', [])).toBe(true);
  expect(canClaimToken([{seen: true, value:1}, {seen: true, value:1}, {seen: true, value:0}, {seen: true, value:0}, {seen: true, value:1}], 'FULL_HOUSE', [])).toBe(true);
  expect(canClaimToken([{seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: true, value:5}, {seen: true, value:5}], 'FULL_HOUSE', [])).toBe(true);
});

test('canClaimToken FULL_HOUSE error cases', () => {
  expect(canClaimToken([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:0}, {seen: true, value:0}], 'FULL_HOUSE', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:3}, {seen: true, value:3}, {seen: false, value:3}, {seen: true, value:5}, {seen: true, value:5}], 'FULL_HOUSE', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: false, value:5}, {seen: true, value:5}], 'FULL_HOUSE', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: true, value:5}], 'FULL_HOUSE', [])).toBe(false);
  expect(canClaimToken([{seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: true, value:5}, {seen: true, value:5}], 'FULL_HOUSE', ['FULL_HOUSE'])).toBe(false);
});
