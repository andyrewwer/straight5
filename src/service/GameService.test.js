const {shuffleArray} = require('../Utils');
const {GameService} = require('./GameService.js')
const {PlayerService} = require('./PlayerService.js')
const {Player} = require('../model/Player.js');
const {TokenType} = require('../model/Enums.js')
let playerService;
let gameService;

jest.mock('../Utils', () => ({
  shuffleArray(array) {
    return array }
}
));

beforeEach(() => {
  playerService = new PlayerService(2);
  gameService = new GameService(playerService);
});

test('createDeck creates and calls shuffle', () => {
  gameService.createDeck(2,2);
  expect(gameService.getDeck()).toEqual([{value: 1, seen: false}, {value: 2, seen: false},{value: 1, seen: false}, {value: 2, seen: false}]);
  // TODO check if mock was called
});

test('getTopCardFromDeck given full deck returns top card', () => {
  gameService.setDeck([{value:0, seen:true},{value:1, seen:true},{value:2,seen:true}]);
  const result = gameService.getTopCardFromDeck()
  expect(result).toEqual({value:2, seen:false});
  expect(gameService.getDeck()).toEqual([{value:0, seen:true},{value:1, seen:true}]);
  expect(gameService.getDiscard()).toEqual([]);
});

test('getTopCardFromDeck given empty deck shuffles and returns top card', () => {
  gameService.setDiscard([{value:0, seen:true},{value:1, seen:true},{value:2,seen:true}]);
  const result = gameService.getTopCardFromDeck()
  expect(result).toEqual({value:1, seen:false});
  expect(gameService.getDeck()).toEqual([{value:0, seen:true}]);
  expect(gameService.getDiscard()).toEqual([{value:2,seen:true}]);
});

test('drawCardFromDeck given full deck returns top card', () => {
  gameService.setDeck([{value:0, seen:true},{value:1, seen:true},{value:2,seen:true}]);
  gameService.drawCardFromDeck()
  expect(gameService.getActiveCard()).toEqual({value:2, seen:false});
  expect(gameService.getDeck()).toEqual([{value:0, seen:true},{value:1, seen:true}]);
  expect(gameService.getDiscard()).toEqual([]);
});

test('drawCardFromDeck given empty deck shuffles and returns top card', () => {
  gameService.setDiscard([{value:0, seen:true},{value:1, seen:true},{value:2,seen:true}]);
  gameService.drawCardFromDeck()
  expect(gameService.getActiveCard()).toEqual({value:1, seen:false});
  expect(gameService.getDeck()).toEqual([{value:0, seen:true}]);
  expect(gameService.getDiscard()).toEqual([{value:2,seen:true}]);
});

test('drawCardFromDiscard', () => {
  gameService.setDiscard([0,1,2]);
  gameService.drawCardFromDiscard()
  expect(gameService.getActiveCard()).toBe(2);
  expect(gameService.getDeck()).toEqual([]);
  expect(gameService.getDiscard()).toEqual([0,1]);
});

test('initializeDiscard', () => {
  gameService.setDeck([0,1,2]);
  gameService.initializeDiscard()
  expect(gameService.getDiscard()).toEqual([2]);
});

test('swapIsValid', () => {
  expect(gameService.swapIsValid(5)).toBe(false);
  gameService.setSwapCardIndex(5);
  expect(gameService.swapIsValid(5)).toBe(false);
  gameService.setSwapCardIndex(4);
  expect(gameService.swapIsValid(5)).toBe(true);
});

test('swapCards', () => {
  playerService.setPlayers([new Player([0,1,2], [])]);
  gameService.setSwapCardIndex(0);
  gameService.swapCards(1, 0);

  expect(playerService.getPlayers()[0].getDeck()[0]).toBe(1);
  expect(playerService.getPlayers()[0].getDeck()[1]).toBe(0);
  expect(playerService.getPlayers()[0].getDeck()[2]).toBe(2);
});

test('replaceCard', () => {
  gameService.setActiveCard({seen:false, value: 1});
  playerService.setPlayers([new Player([{seen:false, value: 2}, {seen:false, value: 3}], [])]);
  gameService.replaceCard(1, 0);
  expect(playerService.getPlayers()[0].getDeck()).toEqual([{seen:false, value: 2}, {seen:true, value: 1}]);
  expect(gameService.getDiscard()).toEqual([{seen:false, value: 3}]);
  expect(gameService.getActiveCard()).toEqual({});
});

test('turnCardFaceUp', () => {
  playerService.setPlayers([new Player([{seen:false, value:0}], [])]);
  gameService.setActivePlayerIndex(0);
  const result = gameService.turnCardFaceUp(0);
  expect(playerService.getPlayers()[0].getDeck()[0].seen).toBe(true);
  expect(result).toBe(true);

  expect(gameService.turnCardFaceUp(0)).toBe(false);
});

test('discardActiveCard', () => {
  gameService.setActiveCard('card');
  gameService.discardActiveCard();
  expect(gameService.getDiscard()).toEqual(['card']);
  expect(gameService.getActiveCard()).toEqual({});
});

test('startNewGame', () => {
  gameService.setSwapCardIndex(2);
  gameService.setActiveCard({value: 5, seen: false});
  gameService.setActivePlayerIndex(1);
  gameService.setTokenToClaim(TokenType.THREE_IN_A_ROW);
  gameService.setSwapCardIndex(2);
  gameService.startNewGame(6, 9);
  expect(gameService.getDeck().length).toBe(43);
  expect(playerService.getPlayers().length).toBe(2);
  expect(playerService.getPlayers()[0].getDeck().length).toBe(5);
  expect(playerService.getPlayers()[1].getDeck().length).toBe(5);
  expect(gameService.getDiscard().length).toBe(1);
  expect(playerService.getPlayers()[0].getTokens()).toEqual([]);
  expect(playerService.getPlayers()[1].getTokens()).toEqual([]);
  expect(gameService.getDiscard().length).toBe(1);
  expect(gameService.getSwapCardIndex()).toBe(-1);
  expect(gameService.getActiveCard()).toEqual({});
  expect(gameService.getActivePlayerIndex()).toBe(0);
  expect(gameService.getTokenToClaim()).toBe('');
});

test('activePlayerCanClaimToken', () => {
  gameService.setActivePlayerIndex(0);
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}]);
  expect(gameService.activePlayerCanClaimToken()).toBe(true);
});

test('nextPlayer', () => {
  gameService.setActivePlayerIndex(1);
  gameService.nextPlayer();
  expect(gameService.getActivePlayerIndex()).toBe(0);
  gameService.nextPlayer();
  expect(gameService.getActivePlayerIndex()).toBe(1);
});

test('isValidIndexForToken for runs', () => {
  gameService.setActivePlayerIndex(1);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.setTokenToClaim(TokenType.THREE_IN_A_ROW);
  expect(gameService.isValidIndexForToken(0)).toBe(true);
  expect(gameService.isValidIndexForToken(1)).toBe(true);
  expect(gameService.isValidIndexForToken(2)).toBe(true);
  expect(gameService.isValidIndexForToken(3)).toBe(false);
  expect(gameService.isValidIndexForToken(4)).toBe(false);
  gameService.setTokenToClaim(TokenType.FOUR_IN_A_ROW);
  expect(gameService.isValidIndexForToken(0)).toBe(true);
  expect(gameService.isValidIndexForToken(1)).toBe(true);
  expect(gameService.isValidIndexForToken(2)).toBe(false);
  expect(gameService.isValidIndexForToken(3)).toBe(false);
  expect(gameService.isValidIndexForToken(4)).toBe(false);
});

test('isValidIndexForToken edge cases', () => {
  gameService.setActivePlayerIndex(1);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:false, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.setTokenToClaim(TokenType.THREE_IN_A_ROW);
  expect(gameService.isValidIndexForToken(0)).toBe(false);
  expect(gameService.isValidIndexForToken(1)).toBe(false);
  expect(gameService.isValidIndexForToken(2)).toBe(false);
  expect(gameService.isValidIndexForToken(3)).toBe(false);
  expect(gameService.isValidIndexForToken(4)).toBe(false);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:5},{seen:true, value:4},{seen:true, value:5}]);
  expect(gameService.isValidIndexForToken(0)).toBe(false);
  expect(gameService.isValidIndexForToken(1)).toBe(false);
  expect(gameService.isValidIndexForToken(2)).toBe(false);
  expect(gameService.isValidIndexForToken(3)).toBe(false);
  expect(gameService.isValidIndexForToken(4)).toBe(false);
});


test('claimToken FIVE_IN_A_ROW', () => {
  gameService.createDeck(6, 9);
  gameService.setTokenToClaim(TokenType.FIVE_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.setActivePlayerIndex(1);
  gameService.claimToken();
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.FIVE_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(false);
  expect(gameService.getDiscard()).toEqual([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
});

test('claimToken FULL_HOUSE', () => {
  gameService.createDeck(6, 9);
  gameService.setTokenToClaim(TokenType.FULL_HOUSE);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:5},{seen:true, value:5}]);
  gameService.setActivePlayerIndex(1);
  gameService.claimToken();
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.FULL_HOUSE]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(false);
  expect(gameService.getDiscard()).toEqual([{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:5},{seen:true, value:5}]);
  expect(gameService.getTokenToClaim()).toEqual('');
});

test('claimToken THREE_OF_A_KIND', () => {
  gameService.createDeck(6, 9);
  gameService.setTokenToClaim(TokenType.THREE_OF_A_KIND);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:1},{seen:true, value:1},{seen:true, value:1}]);
  gameService.setActivePlayerIndex(1);
  gameService.claimToken();
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.THREE_OF_A_KIND]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1]).toEqual({seen:true, value:2});
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4]).toEqual({seen:true, value:1});
  expect(gameService.getDiscard()).toEqual([{seen:true, value:1},{seen:true, value:1},{seen:true, value:1}]);
});

test('claimToken THREE_IN_A_ROW[0]', () => {
  gameService.createDeck(6, 9);
  gameService.setTokenToClaim(TokenType.THREE_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.setActivePlayerIndex(1);
  gameService.claimToken(0);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.THREE_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(true);
  expect(gameService.getDiscard()).toEqual([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3}]);
});

test('claimToken THREE_IN_A_ROW[1]', () => {
  gameService.createDeck(6, 9);
  gameService.setTokenToClaim(TokenType.THREE_IN_A_ROW);
  playerService.getPlayers()[0].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.setActivePlayerIndex(0);
  gameService.claimToken(1);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.THREE_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(true);
  expect(gameService.getDiscard()).toEqual([{seen:true, value:2},{seen:true, value:3},{seen:true, value:4}]);
});

test('claimToken THREE_IN_A_ROW[2]', () => {
  gameService.createDeck(6, 9);
  gameService.setTokenToClaim(TokenType.THREE_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.setActivePlayerIndex(1);
  gameService.claimToken(2);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.THREE_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(false);
  expect(gameService.getDiscard()).toEqual([{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);

});

test('claimToken FOUR_IN_A_ROW[0]', () => {
  gameService.createDeck(6, 9);
  gameService.setTokenToClaim(TokenType.FOUR_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.setActivePlayerIndex(1);
  gameService.claimToken(0);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.FOUR_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(true);
  expect(gameService.getDiscard()).toEqual([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4}]);
});

test('claimToken FOUR_IN_A_ROW[1]', () => {
  gameService.createDeck(6, 9);
  gameService.setTokenToClaim(TokenType.FOUR_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.setActivePlayerIndex(1);
  gameService.claimToken(1);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.FOUR_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(false);
  expect(gameService.getDiscard()).toEqual([{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
});

test('canClaimToken THREE_IN_A_ROW basics pass', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}]);
  expect(gameService.canClaimToken(TokenType.THREE_IN_A_ROW)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: false, value:10}, {seen: true, value:5}, {seen: true, value:6}, {seen: true, value:7}, {seen: true, value:9}]);
  expect(gameService.canClaimToken(TokenType.THREE_IN_A_ROW)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: false, value:0}, {seen: false, value:1}, {seen: true, value:4}, {seen: true, value:5}, {seen: true, value:6}]);
  expect(gameService.canClaimToken(TokenType.THREE_IN_A_ROW)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}]);
  expect(gameService.canClaimToken(TokenType.THREE_IN_A_ROW)).toBe(true);
});

test('canClaimToken THREE_IN_A_ROW error cases', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: false, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}]);
  expect(gameService.canClaimToken(TokenType.THREE_IN_A_ROW)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:10}, {seen: true, value:5}, {seen: true, value:7}, {seen: true, value:5}, {seen: true, value:9}]);
  expect(gameService.canClaimToken(TokenType.THREE_IN_A_ROW)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}]);
  playerService.getPlayers()[0].setTokens([TokenType.THREE_IN_A_ROW]);
  expect(gameService.canClaimToken(TokenType.THREE_IN_A_ROW)).toBe(false);

});

test('canClaimToken FOUR_IN_A_ROW basics pass', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:0}]);
  expect(gameService.canClaimToken(TokenType.FOUR_IN_A_ROW)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: false, value:10}, {seen: true, value:5}, {seen: true, value:6}, {seen: true, value:7}, {seen: true, value:8}]);
  expect(gameService.canClaimToken(TokenType.FOUR_IN_A_ROW)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}]);
  expect(gameService.canClaimToken(TokenType.FOUR_IN_A_ROW)).toBe(true);
});

test('canClaimToken FOUR_IN_A_ROW error cases', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: false, value:2}, {seen: true, value:3}, {seen: true, value:0}]);
  expect(gameService.canClaimToken(TokenType.FOUR_IN_A_ROW)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:10}, {seen: true, value:5}, {seen: true, value:7}, {seen: true, value:5}, {seen: true, value:9}]);
  expect(gameService.canClaimToken(TokenType.FOUR_IN_A_ROW)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}]);
  playerService.getPlayers()[0].setTokens([TokenType.FOUR_IN_A_ROW]);
  expect(gameService.canClaimToken(TokenType.FOUR_IN_A_ROW)).toBe(false);
});

test('canClaimToken FIVE_IN_A_ROW basics pass', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}]);
  expect(gameService.canClaimToken(TokenType.FIVE_IN_A_ROW)).toBe(true);
});

test('canClaimToken FIVE_IN_A_ROW error cases', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: false, value:2}, {seen: true, value:3}, {seen: true, value:4}]);
  expect(gameService.canClaimToken(TokenType.FIVE_IN_A_ROW)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:10}, {seen: true, value:5}, {seen: true, value:7}, {seen: true, value:5}, {seen: true, value:9}]);
  expect(gameService.canClaimToken(TokenType.FIVE_IN_A_ROW)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:3}, {seen: true, value:4}]);
  playerService.getPlayers()[0].setTokens([TokenType.FIVE_IN_A_ROW]);
  expect(gameService.canClaimToken(TokenType.FIVE_IN_A_ROW)).toBe(false);
});

test('canClaimToken THREE_OF_A_KIND basics pass', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:0}, {seen: true, value:2}, {seen: true, value:2}, {seen: true, value:2}]);
  expect(gameService.canClaimToken(TokenType.THREE_OF_A_KIND)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: false, value:2}, {seen: true, value:5}, {seen: true, value:6}, {seen: true, value:5}, {seen: true, value:5}]);
  expect(gameService.canClaimToken(TokenType.THREE_OF_A_KIND)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: false, value:0}, {seen: true, value:0}, {seen: false, value:0}, {seen: true, value:0}]);
  expect(gameService.canClaimToken(TokenType.THREE_OF_A_KIND)).toBe(true);
});

test('canClaimToken THREE_OF_A_KIND error cases', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:0}, {seen: false, value:2}, {seen: true, value:2}, {seen: true, value:2}]);
  expect(gameService.canClaimToken(TokenType.THREE_OF_A_KIND)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: false, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}]);
  expect(gameService.canClaimToken(TokenType.THREE_OF_A_KIND)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: false, value:0}, {seen: true, value:0}, {seen: false, value:0}, {seen: true, value:0}]);
  playerService.getPlayers()[0].setTokens([TokenType.THREE_OF_A_KIND]);
  expect(gameService.canClaimToken(TokenType.THREE_OF_A_KIND)).toBe(false);
});

test('canClaimToken FULL_HOUSE basics pass', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:0}, {seen: true, value:0}, {seen: true, value:1}]);
  expect(gameService.canClaimToken(TokenType.FULL_HOUSE)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: true, value:1}, {seen: true, value:1}, {seen: true, value:0}, {seen: true, value:0}, {seen: true, value:1}]);
  expect(gameService.canClaimToken(TokenType.FULL_HOUSE)).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: true, value:5}, {seen: true, value:5}]);
  expect(gameService.canClaimToken(TokenType.FULL_HOUSE)).toBe(true);
});

test('canClaimToken FULL_HOUSE error cases', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:0}, {seen: true, value:0}]);
  expect(gameService.canClaimToken(TokenType.FULL_HOUSE)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:3}, {seen: true, value:3}, {seen: false, value:3}, {seen: true, value:5}, {seen: true, value:5}]);
  expect(gameService.canClaimToken(TokenType.FULL_HOUSE)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: false, value:5}, {seen: true, value:5}]);
  expect(gameService.canClaimToken(TokenType.FULL_HOUSE)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: true, value:5}]);
  expect(gameService.canClaimToken(TokenType.FULL_HOUSE)).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:3}, {seen: true, value:3}, {seen: true, value:3}, {seen: true, value:5}, {seen: true, value:5}]);
  playerService.getPlayers()[0].setTokens([TokenType.FULL_HOUSE]);
  expect(gameService.canClaimToken(TokenType.FULL_HOUSE)).toBe(false);
});

test('allCardsFaceUp', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:0}, {seen: true, value:0}]);
  expect(gameService.activePlayerHasAllCardsFaceUp()).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: false, value:0}, {seen: false, value:1}, {seen: false, value:2}, {seen: false, value:0}, {seen: false, value:0}]);
  expect(gameService.activePlayerHasAllCardsFaceUp()).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}]);
  expect(gameService.activePlayerHasAllCardsFaceUp()).toBe(false);
});
