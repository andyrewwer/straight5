const {shuffleArray} = require('../Utils');
const {GameService} = require('./GameService.js')
const {GameState} = require('../model/GameState.js')
const {PlayerService} = require('./PlayerService.js')
const {ConfigService} = require('./ConfigService.js')
const {TokenService} = require('./TokenService.js')
const {Player} = require('../model/Player.js');
const {TokenType} = require('../model/Enums.js')
let configService = new ConfigService(6, 9, 2, 2);
const tokenService = new TokenService;
let playerService;
let gameService;
let gameState = new GameState();


jest.mock('../Utils', () => ({
  shuffleArray(array) {
    return array
  }
}
));
//TODO Test for multiple discard piles! Then implement it
beforeEach(() => {
  configService = new ConfigService(6, 9, 2, 2);
  playerService = new PlayerService(configService);
  gameService = new GameService(playerService, tokenService, configService, new GameState());
});

test('createDeck creates and calls shuffle', () => {
  configService = new ConfigService(2, 2, 2, 2);
  playerService = new PlayerService(configService);
  gameService = new GameService(playerService, tokenService, configService, gameState);
  gameService.createDeck();
  expect(gameService.getGameState().getDeck()).toEqual([{value: 1, seen: false}, {value: 2, seen: false},{value: 1, seen: false}, {value: 2, seen: false}]);
  // TODO check if mock was called
});

test('getTopCardFromDeck given full deck returns top card', () => {
  gameService.getGameState().setDeck([{value:0, seen:true},{value:1, seen:true},{value:2,seen:true}]);
  const result = gameService.getTopCardFromDeck()
  expect(result).toEqual({value:2, seen:false});
  expect(gameService.getGameState().getDeck()).toEqual([{value:0, seen:true},{value:1, seen:true}]);
  expect(gameService.getGameState().getDiscard()).toEqual([[]]);
});

test('getTopCardFromDeck given empty deck shuffles and returns top card', () => {
  gameService.getGameState().setDiscard([[{value:0, seen:true},{value:1, seen:true},{value:2,seen:true}]]);
  const result = gameService.getTopCardFromDeck()
  expect(result).toEqual({value:1, seen:false});
  expect(gameService.getGameState().getDeck()).toEqual([{value:0, seen:true}]);
  expect(gameService.getGameState().getDiscard()).toEqual([[{value:2,seen:true}]]);
});

test('drawCardFromDeck given full deck returns top card', () => {
  gameService.getGameState().setDeck([{value:0, seen:true},{value:1, seen:true},{value:2,seen:true}]);
  gameService.drawCardFromDeck()
  expect(gameService.getGameState().getActiveCard()).toEqual({value:2, seen:false});
  expect(gameService.getGameState().getDeck()).toEqual([{value:0, seen:true},{value:1, seen:true}]);
  expect(gameService.getGameState().getDiscard()).toEqual([[]]);
});

test('drawCardFromDeck given empty deck shuffles and returns top card', () => {
  gameService.getGameState().setDiscard([[{value:0, seen:true},{value:1, seen:true},{value:2,seen:true}]]);
  gameService.drawCardFromDeck()
  expect(gameService.getGameState().getActiveCard()).toEqual({value:1, seen:false});
  expect(gameService.getGameState().getDeck()).toEqual([{value:0, seen:true}]);
  expect(gameService.getGameState().getDiscard()).toEqual([[{value:2,seen:true}]]);
});

test('drawCardFromDiscard', () => {
  gameService.getGameState().setDiscard([[0,1,2]]);
  gameService.drawCardFromDiscard(0)
  expect(gameService.getGameState().getActiveCard()).toBe(2);
  expect(gameService.getGameState().getDeck()).toEqual([]);
  expect(gameService.getGameState().getDiscard()).toEqual([[0,1]]);
});

test('initializeDiscard', () => {
  configService = new ConfigService(0,0,0,1);
  gameService = new GameService(playerService, tokenService, configService, gameState)
  gameService.getGameState().setDeck([0,1,2]);
  gameService.initializeDiscard()
  expect(gameService.getGameState().getDiscard()).toEqual([[2]]);

  configService = new ConfigService(0,0,0,2);
  gameService = new GameService(playerService, tokenService, configService, gameState)
  gameService.getGameState().setDeck([0,1,2]);
  gameService.initializeDiscard()
  expect(gameService.getGameState().getDiscard()).toEqual([[2], [1]]);

});

test('swapIsValid', () => {
  expect(gameService.swapIsValid(5)).toBe(false);
  gameService.getGameState().setSwapCardIndex(5);
  expect(gameService.swapIsValid(5)).toBe(false);
  gameService.getGameState().setSwapCardIndex(4);
  expect(gameService.swapIsValid(5)).toBe(true);
});

test('swapCards', () => {
  playerService.setPlayers([new Player([0,1,2], [])]);
  gameService.getGameState().setSwapCardIndex(0);
  gameService.swapCards(1, 0);

  expect(playerService.getPlayers()[0].getDeck()[0]).toBe(1);
  expect(playerService.getPlayers()[0].getDeck()[1]).toBe(0);
  expect(playerService.getPlayers()[0].getDeck()[2]).toBe(2);
});

test('replaceCard and discardCard', () => {
  gameService.getGameState().setDiscard([[],[]])
  gameService.getGameState().setActiveCard({seen:false, value: 1});
  playerService.setPlayers([new Player([{seen:false, value: 2}, {seen:false, value: 3}], [])]);
  gameService.replaceCard(1);
  expect(playerService.getPlayers()[0].getDeck()).toEqual([{seen:false, value: 2}, {seen:true, value: 1}]);
  expect(gameService.getGameState().getDiscard()).toEqual([[], []]);
  expect(gameService.getGameState().getActiveCard()).toEqual({seen:false, value: 3});

  gameService.discardCard(1);
  expect(gameService.getGameState().getActiveCard()).toEqual({});
  expect(gameService.getGameState().getDiscard()).toEqual([[], [{seen:false, value: 3}]]);
});

test('turnCardFaceUp', () => {
  playerService.setPlayers([new Player([{seen:false, value:0}], [])]);
  gameService.getGameState().setActivePlayerIndex(0);
  const result = gameService.turnCardFaceUp(0);
  expect(playerService.getPlayers()[0].getDeck()[0].seen).toBe(true);
  expect(result).toBe(true);

  expect(gameService.turnCardFaceUp(0)).toBe(false);
});

test('discardCard', () => {
  gameService.getGameState().setActiveCard('card');
  gameService.discardCard(0);
  expect(gameService.getGameState().getDiscard()[0]).toEqual(['card']);
  expect(gameService.getGameState().getActiveCard()).toEqual({});
});

test('startNewGame', () => {
  gameService.getGameState().setSwapCardIndex(2);
  gameService.getGameState().setActiveCard({value: 5, seen: false});
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.getGameState().setTokenToClaim(TokenType.THREE_IN_A_ROW);
  gameService.getGameState().setSwapCardIndex(2);
  gameService.startNewGame(6, 9);
  expect(gameService.getGameState().getDeck().length).toBe(42);
  expect(playerService.getPlayers().length).toBe(2);
  expect(playerService.getPlayers()[0].getDeck().length).toBe(5);
  expect(playerService.getPlayers()[1].getDeck().length).toBe(5);
  expect(gameService.getGameState().getDiscard().length).toBe(2);
  expect(gameService.getGameState().getDiscard()[0].length).toBe(1);
  expect(gameService.getGameState().getDiscard()[1].length).toBe(1);
  expect(playerService.getPlayers()[0].getTokens()).toEqual([]);
  expect(playerService.getPlayers()[1].getTokens()).toEqual([]);
  expect(gameService.getGameState().getDiscard().length).toBe(2);
  expect(gameService.getGameState().getDiscard()[0].length).toBe(1);
  expect(gameService.getGameState().getDiscard()[1].length).toBe(1);
  expect(gameService.getGameState().getSwapCardIndex()).toBe(-1);
  expect(gameService.getGameState().getActiveCard()).toEqual({});
  expect(gameService.getGameState().getActivePlayerIndex()).toBe(0);
  expect(gameService.getGameState().getTokenToClaim()).toBe('');
});

test('nextPlayer', () => {
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.nextPlayer();
  expect(gameService.getGameState().getActivePlayerIndex()).toBe(0);
  gameService.nextPlayer();
  expect(gameService.getGameState().getActivePlayerIndex()).toBe(1);
});

test('claimToken FIVE_IN_A_ROW', () => {
  gameService.createDeck(6, 9);
  gameService.getGameState().setTokenToClaim(TokenType.FIVE_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.claimToken();
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.FIVE_IN_A_ROW]);

  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(false);
  expect(gameService.getGameState().getDiscard()).toEqual([[{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]]);
});

test('claimToken FULL_HOUSE', () => {
  gameService.createDeck(6, 9);
  gameService.getGameState().setTokenToClaim(TokenType.FULL_HOUSE);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:5},{seen:true, value:5}]);
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.claimToken();
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.FULL_HOUSE]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(false);
  expect(gameService.getGameState().getDiscard()).toEqual([[{seen:true, value:1},{seen:true, value:1},{seen:true, value:1},{seen:true, value:5},{seen:true, value:5}]]);
  expect(gameService.getGameState().getTokenToClaim()).toEqual('');
});

test('claimToken THREE_OF_A_KIND', () => {
  gameService.createDeck(6, 9);
  gameService.getGameState().setTokenToClaim(TokenType.THREE_OF_A_KIND);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:1},{seen:true, value:1},{seen:true, value:1}]);
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.claimToken();
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.THREE_OF_A_KIND]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1]).toEqual({seen:true, value:2});
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4]).toEqual({seen:true, value:1});
  expect(gameService.getGameState().getDiscard()).toEqual([[{seen:true, value:1},{seen:true, value:1},{seen:true, value:1}]]);
});

test('claimToken THREE_IN_A_ROW[0]', () => {
  gameService.createDeck(6, 9);
  gameService.getGameState().setTokenToClaim(TokenType.THREE_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.claimToken(0);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.THREE_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(true);
  expect(gameService.getGameState().getDiscard()).toEqual([[{seen:true, value:1},{seen:true, value:2},{seen:true, value:3}]]);
});

test('claimToken THREE_IN_A_ROW[1]', () => {
  gameService.createDeck(6, 9);
  gameService.getGameState().setTokenToClaim(TokenType.THREE_IN_A_ROW);
  playerService.getPlayers()[0].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.getGameState().setActivePlayerIndex(0);
  gameService.claimToken(1);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.THREE_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(true);
  expect(gameService.getGameState().getDiscard()).toEqual([[{seen:true, value:2},{seen:true, value:3},{seen:true, value:4}]]);
});

test('claimToken THREE_IN_A_ROW[2]', () => {
  gameService.createDeck(6, 9);
  gameService.getGameState().setTokenToClaim(TokenType.THREE_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.claimToken(2);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.THREE_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(false);
  expect(gameService.getGameState().getDiscard()).toEqual([[{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]]);

});

test('claimToken FOUR_IN_A_ROW[0]', () => {
  gameService.createDeck(6, 9);
  gameService.getGameState().setTokenToClaim(TokenType.FOUR_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.claimToken(0);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.FOUR_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(true);
  expect(gameService.getGameState().getDiscard()).toEqual([[{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4}]]);
});

test('claimToken FOUR_IN_A_ROW[1]', () => {
  gameService.createDeck(6, 9);
  gameService.getGameState().setTokenToClaim(TokenType.FOUR_IN_A_ROW);
  playerService.getPlayers()[1].setDeck([{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]);
  gameService.getGameState().setActivePlayerIndex(1);
  gameService.claimToken(1);
  expect(gameService.getActivePlayersTokens()).toEqual([TokenType.FOUR_IN_A_ROW]);
  expect(gameService.getActivePlayersDeck()[0].seen).toEqual(true);
  expect(gameService.getActivePlayersDeck()[1].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[2].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[3].seen).toEqual(false);
  expect(gameService.getActivePlayersDeck()[4].seen).toEqual(false);
  expect(gameService.getGameState().getDiscard()).toEqual([[{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}]]);
});

test('allCardsFaceUp', () => {
  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: true, value:0}, {seen: true, value:0}]);
  expect(gameService.activePlayerHasAllCardsFaceUp()).toBe(true);

  playerService.getPlayers()[0].setDeck([{seen: false, value:0}, {seen: false, value:1}, {seen: false, value:2}, {seen: false, value:0}, {seen: false, value:0}]);
  expect(gameService.activePlayerHasAllCardsFaceUp()).toBe(false);

  playerService.getPlayers()[0].setDeck([{seen: true, value:0}, {seen: true, value:1}, {seen: true, value:2}, {seen: false, value:0}, {seen: true, value:0}]);
  expect(gameService.activePlayerHasAllCardsFaceUp()).toBe(false);
});

test('discardPileHas0Cards', () => {
  gameService.getGameState().setDiscard([['not-empty'], []]);
  expect(gameService.discardPileHas0Cards()).toBe(1);

  gameService.getGameState().setDiscard([[], ['not-empty']]);
  expect(gameService.discardPileHas0Cards()).toBe(0);

  gameService.getGameState().setDiscard([['not-empty'], ['not-empty']]);
  expect(gameService.discardPileHas0Cards()).toBe(-1);

});
