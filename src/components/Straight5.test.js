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
const {TokenType} = require('../model/Enums.js')

const mockHandComponent = jest.fn();
const mockMiddleSection = jest.fn();
const mockFooterSection = jest.fn();

jest.mock('../service/GameService', () => jest.fn());
jest.mock('../service/PlayerService', () => jest.fn());
jest.mock('./game/Hand.js', () => (props) => {
  mockHandComponent(props)
  return  <div data-testid="hand" onClick={() => props.cardPressedCallback(0,0)}/>;
});
jest.mock('./game/MiddleSection.js', () => (props) => {
  const {DrawType} = require('../model/Enums.js')
  mockMiddleSection(props)
  return  <div data-testid="middle-section">
            <div data-testid="middle-section-deck" onClick={() => props.drawCallback(DrawType.DECK)}/>
            <div data-testid="middle-section-discard-0" onClick={() => props.drawCallback(DrawType.DISCARD)}/>
          </div>;
});
jest.mock('./game/FooterSection.js', () => (props) => {
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
const configService = new ConfigService(6, 9, 2, 2);
const mockStartNewGame = jest.fn()
const mockGetActivePlayerIndex = jest.fn()
const mockDrawCardFromDeck = jest.fn()
const mockDrawCardFromDiscard = jest.fn()
const mockReplaceCard = jest.fn()
const mockResetPlayers = jest.fn()
const mockActivePlayerCanClaimToken = jest.fn()
const mockNextPlayer = jest.fn()
const mockDiscardActiveCard = jest.fn()
const mockTurnCardFaceUp = jest.fn()
const mockSwapIsValid = jest.fn()
const mockSetSwapCardIndex = jest.fn()
const mockSwapCards = jest.fn()
const mockSetTokenToClaim = jest.fn()
const mockClaimToken = jest.fn()
const mockGetActivePlayersTokens = jest.fn()
const mockIsValidIndexForToken = jest.fn()
const mockActivePlayerHasAllCardsFaceUp = jest.fn()

beforeEach(() => {
  GameService.mockImplementation(() => {
    return {
      startNewGame: mockStartNewGame,
      getActivePlayerIndex: mockGetActivePlayerIndex,
      drawCardFromDeck:  mockDrawCardFromDeck,
      drawCardFromDiscard:  mockDrawCardFromDiscard,
      replaceCard: mockReplaceCard,
      activePlayerCanClaimToken: mockActivePlayerCanClaimToken,
      nextPlayer: mockNextPlayer,
      discardActiveCard: mockDiscardActiveCard,
      turnCardFaceUp: mockTurnCardFaceUp,
      swapIsValid: mockSwapIsValid,
      setSwapCardIndex:  mockSetSwapCardIndex,
      swapCards: mockSwapCards,
      setTokenToClaim: mockSetTokenToClaim,
      claimToken: mockClaimToken,
      getActivePlayersTokens: mockGetActivePlayersTokens,
      isValidIndexForToken: mockIsValidIndexForToken,
      activePlayerHasAllCardsFaceUp: mockActivePlayerHasAllCardsFaceUp
    }
  })

  PlayerService.mockImplementation(() => {
    return {
      resetPlayers: mockResetPlayers,
    }
  })
  playerService = new PlayerService(configService);
  gameService = new GameService(playerService, configService);
});

test('render Start Section', () => {
  const straight5 = render(<Straight5 gameService={gameService} playerService={playerService} configService={configService} />);
  expect(screen.getByTestId('start-header')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent('Start New Game');
  expect(screen.getByTestId('rules-section')).toBeInTheDocument();

  expect(screen.queryByTestId('game-header')).toBeNull();
  expect(screen.queryByTestId('win-header')).toBeNull();
});

test('renderGameMode sets up screen as expected', () => {
  startGame();

  expect(screen.queryByTestId('start-header')).toBeInTheDocument();
  expect(screen.queryByTestId('rules-section')).toBeNull();
  expect(screen.getAllByTestId('hand').length).toBe(2);
  expect(screen.queryByTestId('middle-section')).toBeInTheDocument();
  expect(screen.queryByTestId('middle-section-deck')).toBeInTheDocument();
  expect(screen.queryByTestId('middle-section-discard-0')).toBeInTheDocument();
  expect(screen.getByTestId('footer-section')).toBeInTheDocument();
  expect(mockResetPlayers).toHaveBeenCalledTimes(1);
  expect(mockStartNewGame).toHaveBeenCalledTimes(1);
  expect(mockStartNewGame.mock.calls[0].length).toBe(0);

  expect(mockHandComponent).toHaveBeenCalledTimes(2);
  expect(mockHandComponent.mock.calls[0][0]['id']).toEqual(0);
  expect(mockHandComponent.mock.calls[1][0]['id']).toEqual(1);
  expect(mockHandComponent.mock.calls[0][0]['playerService']).toEqual(playerService);
  expect(mockHandComponent.mock.calls[1][0]['playerService']).toEqual(playerService);

  expect(mockMiddleSection).toHaveBeenCalledTimes(1);
  expect(mockMiddleSection.mock.calls[0].length).toBe(1);
  expect(mockMiddleSection.mock.calls[0][0]['gameService']).toBe(gameService);

  expect(mockFooterSection).toHaveBeenCalledTimes(1);
  expect(mockFooterSection.mock.calls[0].length).toBe(1);
  expect(mockFooterSection.mock.calls[0][0]['gameService']).toBe(gameService);
  expect(mockFooterSection.mock.calls[0][0]['moveState']).toBe('START_STATE');
});

test('renderGameMode replaceCard drawDeck', () => {
  mockGetActivePlayerIndex.mockReturnValueOnce(0);
  mockActivePlayerCanClaimToken.mockReturnValue(false);
  startGame();

  userEvent.click(screen.getByTestId('middle-section-deck'));
  expect(mockDrawCardFromDeck).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockReplaceCard).toHaveBeenCalledTimes(1);
  expect(mockReplaceCard.mock.calls[0][0]).toBe(0);
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});

test('renderGameMode pass', () => {
  startGame();
  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  expect(mockDiscardActiveCard).toHaveBeenCalledTimes(1);
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(0);
  expect(mockSwapCards).toHaveBeenCalledTimes(0);

});

test('renderGameMode turnCardFaceUp drawDiscard', () => {
  mockGetActivePlayerIndex.mockReturnValue(0);
  mockActivePlayerCanClaimToken.mockReturnValue(false);
  mockTurnCardFaceUp.mockReturnValue(true);
  mockActivePlayerHasAllCardsFaceUp.mockReturnValue(false);

  startGame();

  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  expect(mockDrawCardFromDiscard).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getByTestId('footer-section-faceup'));
  expect(mockDiscardActiveCard).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(1);
  expect(mockTurnCardFaceUp.mock.calls[0][0]).toBe(0);
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(0);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(2);
  expect(mockTurnCardFaceUp.mock.calls[1][0]).toBe(0);
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});

test('renderGameMode turnCardFaceUp end when all face-up', () => {
  mockGetActivePlayerIndex.mockReturnValue(0);
  mockActivePlayerCanClaimToken.mockReturnValue(false);
  mockTurnCardFaceUp.mockReturnValue(true);
  mockActivePlayerHasAllCardsFaceUp.mockReturnValue(true);

  startGame();

  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  expect(mockDrawCardFromDiscard).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getByTestId('footer-section-faceup'));
  expect(mockDiscardActiveCard).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockTurnCardFaceUp).toHaveBeenCalledTimes(1);
  expect(mockTurnCardFaceUp.mock.calls[0][0]).toBe(0);
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});


test('renderGameMode swapCards', () => {
  mockGetActivePlayerIndex.mockReturnValue(0);
  mockActivePlayerCanClaimToken.mockReturnValue(false);
  mockSwapIsValid.mockReturnValueOnce(false).mockReturnValueOnce(true);

  startGame();

  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  userEvent.click(screen.getByTestId('footer-section-swap'))
  expect(mockDiscardActiveCard).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockSetSwapCardIndex).toHaveBeenCalledTimes(1);
  expect(mockSetSwapCardIndex.mock.calls[0][0]).toBe(0);
  expect(mockSwapIsValid).toHaveBeenCalledTimes(1);
  expect(mockSwapIsValid.mock.calls[0][0]).toBe(0);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockSwapIsValid).toHaveBeenCalledTimes(2);
  expect(mockSwapCards).toHaveBeenCalledTimes(1);
  expect(mockSwapCards.mock.calls[0][0]).toBe(0);

});

test('renderGameMode claimToken threeOfAKind', () => {
  mockActivePlayerCanClaimToken.mockReturnValue(true);
  mockGetActivePlayersTokens.mockReturnValue(0);

  startGame();
  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(0);

  userEvent.click(screen.getByTestId('footer-section-claimToken-threeOfAKind'));
  expect(mockSetTokenToClaim).toHaveBeenCalledTimes(1);
  expect(mockSetTokenToClaim.mock.calls[0][0]).toBe(TokenType.THREE_OF_A_KIND);
  expect(mockClaimToken).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(1);
});

test('renderGameMode changeTurn', () => {
  mockActivePlayerCanClaimToken.mockReturnValue(true);
  mockGetActivePlayersTokens.mockReturnValue(0);
  mockIsValidIndexForToken.mockReturnValue(true);

  startGame();
  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(1);
  expect(mockNextPlayer).toHaveBeenCalledTimes(0);

  userEvent.click(screen.getByTestId('footer-section-claimToken-threeInARow'));
  expect(mockSetTokenToClaim).toHaveBeenCalledTimes(1);
  expect(mockSetTokenToClaim.mock.calls[0][0]).toBe(TokenType.THREE_IN_A_ROW);
  expect(mockClaimToken).toHaveBeenCalledTimes(0);
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getAllByTestId('hand')[0]);
  expect(mockIsValidIndexForToken).toHaveBeenCalledTimes(1);
  expect(mockIsValidIndexForToken.mock.calls[0][0]).toBe(0);
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
  expect(mockSetTokenToClaim).toHaveBeenCalledTimes(0);
  expect(mockActivePlayerCanClaimToken).toHaveBeenCalledTimes(0);
  expect(mockNextPlayer).toHaveBeenCalledTimes(0);
});

test('renderGameMode winner and renderPlayerWin', () => {
  mockActivePlayerCanClaimToken.mockReturnValue(true);
  mockGetActivePlayersTokens.mockReturnValue([TokenType.THREE_IN_A_ROW, TokenType.FOUR_IN_A_ROW, TokenType.FIVE_IN_A_ROW, TokenType.THREE_OF_A_KIND, TokenType.FULL_HOUSE]);
  mockGetActivePlayerIndex.mockReturnValue(4);

  startGame();
  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  userEvent.click(screen.getByTestId('footer-section-pass'));
  userEvent.click(screen.getByTestId('footer-section-claimToken-threeOfAKind'));

  expect(screen.queryByTestId('game-header')).toBeNull();
  expect(screen.getByTestId('win-header')).toHaveTextContent('Congratulations to Player 5');
  expect(screen.getByTestId('win-header')).toHaveTextContent('Congratulations to Player 5');
  expect(screen.getByTestId('win-startNewGame')).toHaveTextContent('Start a new Game');

  userEvent.click(screen.getByTestId('win-startNewGame'));
  expect(screen.getAllByTestId('hand').length).toBe(2);
  expect(screen.queryByTestId('middle-section')).toBeInTheDocument();
  expect(screen.queryByTestId('middle-section-deck')).toBeInTheDocument();
  expect(screen.queryByTestId('middle-section-discard-0')).toBeInTheDocument();
  expect(screen.getByTestId('footer-section')).toBeInTheDocument();

});

function startGame() {
  render(<Straight5 gameService={gameService} playerService={playerService} configService={configService}/>);
  userEvent.click(screen.getByRole('button'));
}
