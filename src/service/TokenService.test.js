const {TokenService} = require('./TokenService.js')
const {CardValues,TokenType} = require('../model/Enums.js')

const tokenService = new TokenService();

test('getAllIndecesForToken getAllIndecesForStraight', () => {
  let deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([[0,1,2,3], [1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[0,1,2], [1,2,3], [2,3,4]]);

  deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([[0,1,2,3]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[0,1,2], [1,2,3]]);

  deck = [{seen:true, value:0},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[1,2,3]]);

  deck = [{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([]);
});

test('getAllIndecesForToken getAllIndecesForStraight WILD', () => {
  let deck = [{seen:true, value:CardValues.WILD},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([[0,1,2,3], [1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[0,1,2], [1,2,3], [2,3,4]]);

  deck = [{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([[0,1,2,3], [1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[0,1,2], [1,2,3], [2,3,4]]);

  deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:CardValues.WILD},{seen:true, value:5}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([[0,1,2,3], [1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[0,1,2], [1,2,3], [2,3,4]]);

  deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([[0,1,2,3], [1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[0,1,2], [1,2,3], [2,3,4]]);

  deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:CardValues.WILD},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([[0,1,2,3]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[0,1,2], [1,2,3]]);

  deck = [{seen:true, value:0},{seen:true, value:CardValues.WILD},{seen:true, value:3},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[1,2,3]]);

  deck = [{seen:true, value:0},{seen:true, value:CardValues.WILD},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([]);
});

test('getAllIndecesForToken getAllIndecesForStraight unseen cases', () => {
  let deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:false, value:5}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([[0,1,2,3]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[0,1,2], [1,2,3]]);

  deck = [{seen:false, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:false, value:5}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[1,2,3]]);

  deck = [{seen:false, value:CardValues.WILD},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:false, value:5}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([[1,2,3]]);

  deck = [{seen:true, value:0},{seen:true, value:2},{seen:false, value:3},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FIVE_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FOUR_IN_A_ROW)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_IN_A_ROW)).toEqual([]);
});

test('getAllIndecesForToken getAllIndecesForSets', () => {
  let deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,1,2,3,4]]);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:2},{seen:true, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([[0,1,2,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,1,2,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,1,2,4]]);

  deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:1},{seen:true, value:2},{seen:true, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,2,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,2,4], [1,3]]);

  deck = [{seen:true, value:0},{seen:true, value:1},{seen:true, value:0},{seen:true, value:1},{seen:true, value:5}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,2], [1,3]]);

  deck = [{seen:true, value:0},{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:5}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([]);
});

test('getAllIndecesForToken, getAllIndecesForSets WILD', () => {
  let deck = [{seen:true, value:1},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([[0,1,2,3,4], [1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,1,2,3,4],[1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,1,2,3,4], [1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([[0,1,2,3,4]]);

  deck = [{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD},{seen:true, value:CardValues.WILD}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([[0,1,2,3,4]]);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:CardValues.WILD}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([]);

  deck = [{seen:true, value:CardValues.WILD},{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([[1,2,3,4, 0]]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([[1,2,3,4, 0]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[1,2,3,4, 0]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[1,2,3,4, 0]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([]);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:CardValues.WILD},{seen:true, value:2},{seen:true, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([[0,1,4,2]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,1,4,2]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,1,4,2], [3,2]]);

  deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:CardValues.WILD},{seen:true, value:2},{seen:true, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,4,2], [1,3,2]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([[0,1,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,4,2], [1,3,2]]);

  deck = [{seen:true, value:0},{seen:true, value:1},{seen:true, value:CardValues.WILD},{seen:true, value:3},{seen:true, value:5}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.FULL_HOUSE)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,2], [1,2], [3,2], [4,2]]);
});

test('getAllIndecesForToken unseen cases', () => {
  let deck = [{seen:true, value:1},{seen:false, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([[0,2,3,4]]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,2,3,4]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,2,3,4]]);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:false, value:1},{seen:false, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([[0,1,2]]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,1,2]]);

  deck = [{seen:true, value:1},{seen:false, value:1},{seen:true, value:1},{seen:false, value:1},{seen:false, value:1}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,2]]);

  deck = [{seen:true, value:1},{seen:false, value:1},{seen:true, value:1},{seen:true, value:5},{seen:true, value:5}];
  expect(tokenService.getAllIndecesForSets(deck, 5)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 4)).toEqual([]);
  expect(tokenService.getAllIndecesForToken(deck, TokenType.THREE_OF_A_KIND)).toEqual([]);
  expect(tokenService.getAllIndecesForSets(deck, 2)).toEqual([[0,2], [3,4]]);
});

test('canClaimToken straights', () => {
  let deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}];
  expect(tokenService.canClaimToken(TokenType.FIVE_IN_A_ROW, deck, [])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.FOUR_IN_A_ROW, deck, [])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.THREE_IN_A_ROW, deck, [])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.FIVE_IN_A_ROW, deck, [TokenType.FIVE_IN_A_ROW])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.FOUR_IN_A_ROW, deck, [TokenType.FIVE_IN_A_ROW])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.THREE_IN_A_ROW, deck, [TokenType.FIVE_IN_A_ROW])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.FIVE_IN_A_ROW, deck, [TokenType.FIVE_IN_A_ROW, TokenType.FOUR_IN_A_ROW])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.FOUR_IN_A_ROW, deck, [TokenType.FIVE_IN_A_ROW, TokenType.FOUR_IN_A_ROW])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.THREE_IN_A_ROW, deck, [TokenType.FIVE_IN_A_ROW, TokenType.FOUR_IN_A_ROW])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.THREE_IN_A_ROW, deck, [TokenType.FIVE_IN_A_ROW, TokenType.FOUR_IN_A_ROW, TokenType.THREE_IN_A_ROW])).toBe(false);

  deck = [{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.canClaimToken(TokenType.FIVE_IN_A_ROW, deck, [])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.FOUR_IN_A_ROW, deck, [])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.THREE_IN_A_ROW, deck, [])).toBe(false);

  deck = [{seen:true, value:1},{seen:true, value:2},{seen:false, value:3},{seen:true, value:4},{seen:true, value:5}];
  expect(tokenService.canClaimToken(TokenType.FIVE_IN_A_ROW, deck, [])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.FOUR_IN_A_ROW, deck, [])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.THREE_IN_A_ROW, deck, [])).toBe(false);
});

test('canClaimToken sets', () => {
  let deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.canClaimToken(TokenType.THREE_OF_A_KIND, deck, [])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.FULL_HOUSE, deck, [])).toBe(true);

  deck = [{seen:true, value:2},{seen:true, value:1},{seen:true, value:1},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.canClaimToken(TokenType.THREE_OF_A_KIND, deck, [])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.FULL_HOUSE, deck, [])).toBe(true);

  deck = [{seen:true, value:2},{seen:true, value:1},{seen:true, value:2},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.canClaimToken(TokenType.THREE_OF_A_KIND, deck, [])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.FULL_HOUSE, deck, [])).toBe(false);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.canClaimToken(TokenType.THREE_OF_A_KIND, deck, [])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.FULL_HOUSE, deck, [])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.THREE_OF_A_KIND, deck, [TokenType.THREE_OF_A_KIND])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.FULL_HOUSE, deck, [TokenType.THREE_OF_A_KIND])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.THREE_OF_A_KIND, deck, [TokenType.FULL_HOUSE])).toBe(true);
  expect(tokenService.canClaimToken(TokenType.FULL_HOUSE, deck, [TokenType.FULL_HOUSE])).toBe(false);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:false, value:1},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.canClaimToken(TokenType.THREE_OF_A_KIND, deck, [])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.FULL_HOUSE, deck, [])).toBe(false);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:false, value:1},{seen:false, value:1},{seen:false, value:1}];
  expect(tokenService.canClaimToken(TokenType.THREE_OF_A_KIND, deck, [])).toBe(false);
  expect(tokenService.canClaimToken(TokenType.FULL_HOUSE, deck, [])).toBe(false);
});

test('isValidIndexForToken straights', () => {
  let deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}];
  expect(tokenService.isValidIndexForToken(TokenType.FIVE_IN_A_ROW, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FIVE_IN_A_ROW, deck, 1)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FIVE_IN_A_ROW, deck, 2)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FIVE_IN_A_ROW, deck, 3)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FIVE_IN_A_ROW, deck, 4)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FOUR_IN_A_ROW, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FOUR_IN_A_ROW, deck, 1)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FOUR_IN_A_ROW, deck, 2)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FOUR_IN_A_ROW, deck, 3)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FOUR_IN_A_ROW, deck, 4)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_IN_A_ROW, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_IN_A_ROW, deck, 1)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_IN_A_ROW, deck, 2)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_IN_A_ROW, deck, 3)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_IN_A_ROW, deck, 4)).toBe(false);

  deck = [{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}];
  expect(tokenService.isValidIndexForToken(TokenType.FIVE_IN_A_ROW, deck, 0)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FOUR_IN_A_ROW, deck, 0)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_IN_A_ROW, deck, 0)).toBe(false);

  deck = [{seen:true, value:1},{seen:true, value:2},{seen:false, value:3},{seen:true, value:4},{seen:true, value:5}];
  expect(tokenService.isValidIndexForToken(TokenType.FIVE_IN_A_ROW, deck, 0)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FOUR_IN_A_ROW, deck, 0)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_IN_A_ROW, deck, 0)).toBe(false);
});

test('isValidIndexForToken sets', () => {
  let deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 1)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 2)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 3)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 4)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, [])).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 1)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 2)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 3)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 4)).toBe(true);

  deck = [{seen:true, value:2},{seen:true, value:1},{seen:true, value:1},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 1)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 2)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 3)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 4)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 1)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 2)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 3)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 4)).toBe(true);

  deck = [{seen:true, value:2},{seen:true, value:1},{seen:true, value:2},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 2)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 3)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 4)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 0)).toBe(false);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:2},{seen:true, value:2}];
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 0)).toBe(true);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 0)).toBe(true);

  deck = [{seen:true, value:1},{seen:true, value:1},{seen:false, value:1},{seen:false, value:1},{seen:false, value:1}];
  expect(tokenService.isValidIndexForToken(TokenType.THREE_OF_A_KIND, deck, 0)).toBe(false);
  expect(tokenService.isValidIndexForToken(TokenType.FULL_HOUSE, deck, 0)).toBe(false);
});
