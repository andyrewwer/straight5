/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Straight5 from './Straight5.js'
const GameService = require('../service/GameService.js')
const PlayerService = require('../service/PlayerService.js')
const {ConfigService} = require('../service/ConfigService.js')
const {GameState} = require('../model/GameState.js')
const {TokenService} = require('../service/TokenService.js')
const {TokenType} = require('../model/Enums.js')
const {Player} = require('../model/Player.js')

const mockHandComponent = jest.fn();
const mockDeckAndDiscardSection = jest.fn();
const mockFooterSection = jest.fn();

// TODO redo this as a unit test

jest.mock('../service/GameService', () => jest.fn());
jest.mock('../service/PlayerService', () => jest.fn());
jest.mock('./game/Hand.js', () => (props) => {
  mockHandComponent(props)
  return  <div data-testid="hand" onClick={() => props.cardPressedCallback(0,0)}/>;
});
jest.mock('./game/DeckAndDiscardSection.js', () => (props) => {
  const {DrawType} = require('../model/Enums.js')
  mockDeckAndDiscardSection(props)
  return  <div data-testid="middle-section">
            <div data-testid="deck-pile-0" onClick={() => props.drawCallback(DrawType.DECK)}/>
            <div data-testid="discard-pile-0" onClick={() => props.drawCallback(DrawType.DISCARD, 1)}/>
          </div>;
});
jest.mock('./game/player-action/FooterSection.js', () => (props) => {
  const {ActionType, TokenType} = require('../model/Enums.js')
  mockFooterSection(props)
  return  <div data-testid="footer-section">
            <div data-testid="footer-section-pass" onClick={() => {props.buttonPressedCallback(ActionType.PASS)}}/>
            <div data-testid="footer-section-faceup" onClick={() => {props.buttonPressedCallback(ActionType.TURN_FACE_UP)}}/>
            <div data-testid="footer-section-swap" onClick={() => {props.buttonPressedCallback(ActionType.SWAP)}}/>
            <div data-testid="footer-section-claimToken-threeOfAKind" onClick={() => {props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.THREE_OF_A_KIND)}}/>
            <div data-testid="footer-section-claimToken-threeInARow" onClick={() => {props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.THREE_IN_A_ROW)}}/>
          </div>;
});

let gameService;
let playerService;
let gameState = new GameState();
const configService = new ConfigService();
configService.reset();
const tokenService = new TokenService(2);

const mockStartNewGame = jest.fn()
const mockDrawCardFromDeck = jest.fn()
const mockDrawCardFromDiscard = jest.fn()
const mockReplaceCard = jest.fn()
const mockResetPlayers = jest.fn()
const mockNextPlayer = jest.fn()
const mockDiscardCard = jest.fn()
const mockTurnCardFaceUp = jest.fn()
const mockSwapIsValid = jest.fn()
const mockSwapCards = jest.fn()
const mockClaimToken = jest.fn()
const mockGetActivePlayersTokens = jest.fn()
const mockActivePlayerHasAllCardsFaceUp = jest.fn()
const mockDiscardPileHas0Cards = jest.fn()
const mockGetPlayers = jest.fn()
const mockGetActivePlayersDeck = jest.fn()

mockDiscardPileHas0Cards.mockReturnValue(-1);
beforeEach(() => {
  GameService.mockImplementation(() => {
    return {
      activePlayerHasAllCardsFaceUp: mockActivePlayerHasAllCardsFaceUp,
      claimToken: mockClaimToken,
      drawCardFromDeck:  mockDrawCardFromDeck,
      drawCardFromDiscard:  mockDrawCardFromDiscard,
      discardCard: mockDiscardCard,
      discardPileHas0Cards: mockDiscardPileHas0Cards,
      getActivePlayersDeck: mockGetActivePlayersDeck,
      getActivePlayersTokens: mockGetActivePlayersTokens,
      nextPlayer: mockNextPlayer,
      replaceCard: mockReplaceCard,
      startNewGame: mockStartNewGame,
      swapCards: mockSwapCards,
      swapIsValid: mockSwapIsValid,
      turnCardFaceUp: mockTurnCardFaceUp
    }
  })

  PlayerService.mockImplementation(() => {
    return {
      resetPlayers: mockResetPlayers,
      getPlayers: mockGetPlayers
    }
  })
  playerService = new PlayerService(configService);
  gameState = new GameState();
  gameService = new GameService(playerService, tokenService, configService, gameState);
});

test('render Start Section', () => {
  const straight5 = render(<Straight5 gameService={gameService} playerService={playerService} configService={configService}  tokenService={tokenService} gameState={gameState}/>);
  expect(screen.getByTestId('start-header')).toBeInTheDocument();
  expect(screen.getByTestId('startButton')).toHaveTextContent('Start New Game');
  expect(screen.getByTestId('header-section')).toBeInTheDocument();

  expect(screen.queryByTestId('game-header')).toBeNull();
  expect(screen.queryByTestId('win-header')).toBeNull();
});

test('renderGameMode sets up screen as expected', () => {
  startGame();

  expect(screen.queryByTestId('start-header')).toBeInTheDocument();
  expect(screen.queryByTestId('rules-section')).toBeNull();
  expect(screen.getAllByTestId('hand').length).toBe(2);
  expect(screen.queryByTestId('middle-section')).toBeInTheDocument();
  expect(screen.queryByTestId('deck-pile-0')).toBeInTheDocument();
  expect(screen.queryByTestId('discard-pile-0')).toBeInTheDocument();
  expect(screen.getByTestId('footer-section')).toBeInTheDocument();
  expect(mockResetPlayers).toHaveBeenCalledTimes(1);
  expect(mockStartNewGame).toHaveBeenCalledTimes(1);
  expect(mockStartNewGame.mock.calls[0].length).toBe(0);

  expect(mockHandComponent).toHaveBeenCalledTimes(2);
  expect(mockHandComponent.mock.calls[0][0]['id']).toEqual(0);
  expect(mockHandComponent.mock.calls[1][0]['id']).toEqual(1);
  expect(mockHandComponent.mock.calls[0][0]['playerService']).toEqual(playerService);
  expect(mockHandComponent.mock.calls[1][0]['playerService']).toEqual(playerService);

  expect(mockDeckAndDiscardSection).toHaveBeenCalledTimes(1);
  expect(mockDeckAndDiscardSection.mock.calls[0].length).toBe(1);
  expect(mockDeckAndDiscardSection.mock.calls[0][0]['gameService']).toBe(gameService);

  expect(mockFooterSection).toHaveBeenCalledTimes(1);
  expect(mockFooterSection.mock.calls[0].length).toBe(1);
  expect(mockFooterSection.mock.calls[0][0]['gameService']).toBe(gameService);
  expect(mockFooterSection.mock.calls[0][0]['moveState']).toBe('START_STATE');
});

test('renderGameMode replaceCard drawDeck', () => {
  mockGetPlayers.mockReturnValue([new Player([{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}], [])]);
  startGame();

  userEvent.click(screen.getByTestId('deck-pile-0'));
  expect(mockDrawCardFromDeck).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockDiscardPileHas0Cards).toHaveBeenCalledTimes(1);
  expect(mockReplaceCard).toHaveBeenCalledTimes(1);
  expect(mockReplaceCard.mock.calls[0][0]).toBe(0);

  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockDiscardCard).toHaveBeenCalledTimes(1);
  expect(mockGetPlayers).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});

test('renderGameMode pass', () => {
  mockGetPlayers.mockReturnValue([new Player([{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}], [])]);

  startGame();
  userEvent.click(screen.getByTestId('discard-pile-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  expect(mockDiscardPileHas0Cards).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockDiscardCard).toHaveBeenCalledTimes(1);
  expect(mockGetPlayers).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(0);
  expect(mockSwapCards).toHaveBeenCalledTimes(0);

});

test('renderGameMode discardsToEmptyDiscard', () => {
  mockDiscardPileHas0Cards.mockReturnValue(0);
  mockGetPlayers.mockReturnValue([new Player([{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}], [])]);
  startGame();
  userEvent.click(screen.getByTestId('discard-pile-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  expect(mockDiscardPileHas0Cards).toHaveBeenCalledTimes(1);
  expect(mockDiscardCard).toHaveBeenCalledTimes(1);

});

test('renderGameMode turnCardFaceUp drawDiscard', () => {
  mockGetPlayers.mockReturnValue([new Player([{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}], [])]);
  mockTurnCardFaceUp.mockReturnValue(true);
  mockActivePlayerHasAllCardsFaceUp.mockReturnValue(false);

  startGame();

  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockDrawCardFromDiscard).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getByTestId('footer-section-faceup'));

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(1);
  expect(mockTurnCardFaceUp.mock.calls[0][0]).toBe(0);
  expect(mockGetPlayers).toHaveBeenCalledTimes(0);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(2);
  expect(mockTurnCardFaceUp.mock.calls[1][0]).toBe(0);

  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockDiscardCard).toHaveBeenCalledTimes(1);
  expect(mockGetPlayers).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});

test('renderGameMode turnCardFaceUp end when all face-up', () => {
  mockGetPlayers.mockReturnValue([new Player([{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}], [])]);
  mockTurnCardFaceUp.mockReturnValue(true);
  mockActivePlayerHasAllCardsFaceUp.mockReturnValue(true);

  startGame();

  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockDrawCardFromDiscard).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getByTestId('footer-section-faceup'));

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(1);
  expect(mockTurnCardFaceUp.mock.calls[0][0]).toBe(0);

  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockDiscardCard).toHaveBeenCalledTimes(1);
  expect(mockGetPlayers).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});


test('renderGameMode swapCards', () => {
  mockGetPlayers.mockReturnValue([new Player([{seen:true, value:0},{seen:true, value:2},{seen:true, value:4},{seen:true, value:4},{seen:true, value:6}], [])]);
  mockSwapIsValid.mockReturnValueOnce(false).mockReturnValueOnce(true);

  startGame();

  userEvent.click(screen.getByTestId('discard-pile-0'));
  userEvent.click(screen.getByTestId('footer-section-swap'));

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockSwapIsValid).toHaveBeenCalledTimes(1);
  expect(mockSwapIsValid.mock.calls[0][0]).toBe(0);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockSwapIsValid).toHaveBeenCalledTimes(2);
  expect(mockSwapCards).toHaveBeenCalledTimes(1);
  expect(mockSwapCards.mock.calls[0][0]).toBe(0);

  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockDiscardCard).toHaveBeenCalledTimes(1);
  expect(mockGetPlayers).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});

test('renderGameMode claimToken threeOfAKind', () => {
  const deck = [{seen:true, value:0},{seen:true, value:0},{seen:true, value:0},{seen:true, value:4},{seen:true, value:6}]
  gameState = new GameState();
  mockGetPlayers.mockReturnValue([new Player(deck, [])]);
  mockGetActivePlayersDeck.mockReturnValue(deck);
  mockGetActivePlayersTokens.mockReturnValue([]);

  startGame();
  userEvent.click(screen.getByTestId('discard-pile-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockGetPlayers).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(0);

  userEvent.click(screen.getByTestId('footer-section-claimToken-threeOfAKind'));
  expect(mockClaimToken).toHaveBeenCalledTimes(1);
  expect(mockClaimToken.mock.calls[0][0]).toBe(0);
  expect(gameState.getTokenToClaim()).toBe(TokenType.THREE_OF_A_KIND);
  expect(mockClaimToken).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});

test('renderGameMode changeTurn', () => {
  const deck = [{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4},{seen:true, value:5}];
  gameState = new GameState()
  gameState.setTokenToClaim(TokenType.THREE_IN_A_ROW);
  mockGetPlayers.mockReturnValue([new Player(deck, [])]);
  mockGetActivePlayersTokens.mockReturnValue([]);
  mockGetActivePlayersDeck.mockReturnValue(deck);

  startGame();
  userEvent.click(screen.getByTestId('discard-pile-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockGetPlayers).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(0);

  userEvent.click(screen.getByTestId('footer-section-claimToken-threeInARow'));
  expect(gameState.getTokenToClaim()).toBe(TokenType.THREE_IN_A_ROW);
  expect(mockClaimToken).toHaveBeenCalledTimes(0);
  expect(mockGetPlayers).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockGetActivePlayersDeck).toHaveBeenCalledTimes(2);
  expect(mockClaimToken).toHaveBeenCalledTimes(1);
  expect(mockClaimToken.mock.calls[0][0]).toBe(0);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});

test('renderGameMode clickPlayerCard in StartState should do nothing', () => {

  startGame();
  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockSwapCards).toHaveBeenCalledTimes(0);
  expect(mockSwapIsValid).toHaveBeenCalledTimes(0);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(0);
  expect(mockGetPlayers).toHaveBeenCalledTimes(0);
  expect(mockNextPlayer).toHaveBeenCalledTimes(0);
});

test('renderGameMode winner and renderPlayerWin', () => {
  const deck = [{seen:true, value:0},{seen:true, value:0},{seen:true, value:0},{seen:true, value:4},{seen:true, value:6}];
  mockGetPlayers.mockReturnValue([[], [], [], [], new Player(deck, [])]);
  mockGetActivePlayersTokens.mockReturnValue([TokenType.THREE_IN_A_ROW, TokenType.FOUR_IN_A_ROW, TokenType.FIVE_IN_A_ROW, TokenType.THREE_OF_A_KIND, TokenType.FULL_HOUSE]);
  gameState.setActivePlayerIndex(4)
  mockGetActivePlayersDeck.mockReturnValue([{seen:true, value:0},{seen:true, value:0},{seen:true, value:0},{seen:true, value:4},{seen:true, value:6}])
  startGame();
  userEvent.click(screen.getByTestId('discard-pile-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  userEvent.click(screen.getByTestId('footer-section-claimToken-threeOfAKind'));

  expect(screen.queryByTestId('game-header')).toBeNull();
  expect(screen.getByTestId('win-header')).toHaveTextContent('Congratulations to Player 5');
  expect(screen.getByTestId('startButton')).toHaveTextContent('Start New Game');

  userEvent.click(screen.getByTestId('startButton'));
  expect(screen.getAllByTestId('hand').length).toBe(2);
  expect(screen.queryByTestId('middle-section')).toBeInTheDocument();
  expect(screen.queryByTestId('deck-pile-0')).toBeInTheDocument();
  expect(screen.queryByTestId('discard-pile-0')).toBeInTheDocument();
  expect(screen.getByTestId('footer-section')).toBeInTheDocument();
});

function startGame() {
  render(<Straight5 gameService={gameService} playerService={playerService} configService={configService} tokenService={tokenService} gameState={gameState}/>);
  userEvent.click(screen.getByTestId('startButton'));
}
