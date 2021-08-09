const {shuffleArray, canClaimToken} = require('../Utils');
const {GameService} = require('../service/GameService.js')

const gameService = new GameService();
jest.mock('../Utils', () => ({
  shuffleArray(array) {
    return array },
  canClaimToken() {
    return true;
  }
}
));

beforeEach(() => {
  this.gameService = new GameService(2);
})

test('createDeck creates and calls shuffle', () => {
  this.gameService.createDeck(2,2);
  expect(this.gameService.getDeck()).toEqual([{value: 1, seen: false}, {value: 2, seen: false},{value: 1, seen: false}, {value: 2, seen: false}]);
  // const mock = jest.mock('../Utils', () => ({
  //   shuffleArray(array) {
  //     return array }
  // }));
});

test('dealCardsToPlayers deals cards for any player number', () => {
  this.gameService = new GameService(1);
  this.gameService.createDeck(1,5);
  this.gameService.dealCardsToPlayers();
  expect(this.gameService.getPlayers()).toEqual([[{value:5, seen:false},{value:4, seen:false},{value:3, seen:false},{value:2, seen:false},{value:1, seen:false}]]);
  expect(this.gameService.getPlayersTokens()).toEqual([[]]);

  this.gameService = new GameService(2);
  this.gameService.createDeck(1,10);
  this.gameService.dealCardsToPlayers();
  expect(this.gameService.getPlayers()).toEqual([[{value:10, seen:false},{value:9, seen:false},{value:8, seen:false},{value:7, seen:false},{value:6, seen:false}], [{value:5, seen:false},{value:4, seen:false},{value:3, seen:false},{value:2, seen:false},{value:1, seen:false}]]);
  expect(this.gameService.getPlayersTokens()).toEqual([[], []]);

  this.gameService = new GameService(3);
  this.gameService.createDeck(1,15);
  this.gameService.dealCardsToPlayers();
  expect(this.gameService.getPlayers()).toEqual([[{value:15, seen:false},{value:14, seen:false},{value:13, seen:false},{value:12, seen:false},{value:11, seen:false}], [{value:10, seen:false},{value:9, seen:false},{value:8, seen:false},{value:7, seen:false},{value:6, seen:false}], [{value:5, seen:false},{value:4, seen:false},{value:3, seen:false},{value:2, seen:false},{value:1, seen:false}]]);
  expect(this.gameService.getPlayersTokens()).toEqual([[], [], []]);
});

test('drawCardFromDeck given full deck returns top card', () => {
  this.gameService.setDeck([0,1,2]);
  this.gameService.drawCardFromDeck()
  expect(this.gameService.getActiveCard()).toBe(2);
  expect(this.gameService.getDeck()).toEqual([0, 1]);
  expect(this.gameService.getDiscard()).toEqual([]);
});

test('drawCardFromDeck given empty deck shuffles and returns top card', () => {
  this.gameService.setDiscard([0,1,2]);
  this.gameService.drawCardFromDeck()
  expect(this.gameService.getActiveCard()).toBe(1);
  expect(this.gameService.getDeck()).toEqual([0]);
  expect(this.gameService.getDiscard()).toEqual([2]);
});

test('drawCardFromDiscard', () => {
  this.gameService.setDiscard([0,1,2]);
  this.gameService.drawCardFromDiscard()
  expect(this.gameService.getActiveCard()).toBe(2);
  expect(this.gameService.getDeck()).toEqual([]);
  expect(this.gameService.getDiscard()).toEqual([0,1]);
});

test('initializeDiscard', () => {
  this.gameService.setDeck([0,1,2]);
  this.gameService.initializeDiscard()
  expect(this.gameService.getDiscard()).toEqual([2]);
});

test('swapIsValid', () => {
  expect(this.gameService.swapIsValid(5)).toBe(false);
  this.gameService.setSwapCardIndex(5);
  expect(this.gameService.swapIsValid(5)).toBe(false);
  this.gameService.setSwapCardIndex(4);
  expect(this.gameService.swapIsValid(5)).toBe(true);
});

test('swapCards', () => {
  this.gameService.setPlayers([[0, 1, 2]]);
  this.gameService.setSwapCardIndex(0);
  this.gameService.swapCards(1, 0);

  expect(this.gameService.getPlayers()[0][0]).toBe(1);
  expect(this.gameService.getPlayers()[0][1]).toBe(0);
  expect(this.gameService.getPlayers()[0][2]).toBe(2);
});

test('replaceCard', () => {
  this.gameService.setActiveCard({seen:false, value: 1});
  this.gameService.setPlayers([[{seen:false, value: 2}, {seen:false, value: 3}]]);
  this.gameService.replaceCard(1, 0);
  expect(this.gameService.getPlayers()).toEqual([[{seen:false, value: 2}, {seen:true, value: 1}]]);
  expect(this.gameService.getDiscard()).toEqual([{seen:false, value: 3}]);
  expect(this.gameService.getActiveCard()).toEqual({});
});

test('turnCardFaceUp', () => {
  this.gameService.setPlayers([[{seen:false, value:0}]]);
  this.gameService.setActivePlayerIndex(0);
  const result = this.gameService.turnCardFaceUp(0);
  expect(this.gameService.getPlayers()[0][0].seen).toBe(true);
  expect(result).toBe(true);

  expect(this.gameService.turnCardFaceUp(0)).toBe(false);
});

test('discardActiveCard', () => {
  this.gameService.setActiveCard('card');
  this.gameService.discardActiveCard();
  expect(this.gameService.getDiscard()).toEqual(['card']);
  expect(this.gameService.getActiveCard()).toEqual({});
});

test('startNewGame', () => {
  this.gameService = new GameService(1);
  this.gameService.startNewGame();
  expect(this.gameService.getDeck().length).toBe(48);
  expect(this.gameService.getPlayers().length).toBe(1);
  expect(this.gameService.getPlayers()[0].length).toBe(5);
  expect(this.gameService.getDiscard().length).toBe(1);
  expect(this.gameService.getPlayersTokens()).toEqual([[]]);
});

test('activePlayerCanClaimToken', () => {
  // TODO VERYIFY CALLS TO THE mock service
  this.gameService.setActivePlayerIndex(0);
  this.gameService.setPlayers([[0,1,2,3,4]]);
  this.gameService.setPlayersTokens([[]]);
  expect(this.gameService.activePlayerCanClaimToken()).toBe(true);
});

test('nextPlayer', () => {
  this.gameService.setActivePlayerIndex(1);
  this.gameService.nextPlayer();
  expect(this.gameService.getActivePlayerIndex()).toBe(0);
  this.gameService.nextPlayer();
  expect(this.gameService.getActivePlayerIndex()).toBe(1);
});
