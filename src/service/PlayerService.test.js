const {shuffleArray} = require('../Utils');
const {PlayerService} = require('./PlayerService.js')

let playerService = new PlayerService(2);

beforeEach(() => {
  playerService = new PlayerService(2);
});

test('playerService can create multiple players', ()  =>  {
  expect(playerService.getNumberOfPlayers()).toBe(2);
  expect(playerService.getPlayers().length).toBe(2);
  expect(playerService.getPlayers()).toEqual([{deck: [], tokens: []}, {deck: [], tokens: []}]);
  playerService = new PlayerService(10);
  expect(playerService.getNumberOfPlayers()).toBe(10);
});

test('dealCardsToPlayers', () => {
  const deck = [1,2,3,4,5,6,7,8,9,10,11];
  playerService.dealCardsToPlayers(deck);

  expect(playerService.getPlayers()[0].getDeck()).toEqual([11,9,7,5,3]);
  expect(playerService.getPlayers()[0].getTokens()).toEqual([]);
  expect(playerService.getPlayers()[1].getDeck()).toEqual([10,8,6,4,2]);
  expect(playerService.getPlayers()[1].getTokens()).toEqual([]);
  expect(deck).toEqual([1]);
});
