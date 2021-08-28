/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FooterSection from './FooterSection.js';
const {PlayerService} = require('../../../service/PlayerService.js');
const {ConfigService} = require('../../../service/ConfigService.js');
const {GameState} = require('../../../model/GameState.js');
const {TokenService} = require('../../../service/TokenService.js');
const GameService = require('../../../service/GameService.js');
const { ActionType, MoveState, TokenType } = require('../../../model/Enums.js')

jest.mock('../../../service/GameService', () => jest.fn());

let gameService;
let gameState;
const tokenService = new TokenService();
const mockGetGameState = jest.fn()
const mockGetActivePlayersDeck = jest.fn()
const mockGetActivePlayersTokens = jest.fn()
const mockAllCardsFaceUp = jest.fn()

beforeEach(() => {
  GameService.mockImplementation(() => {
    return {
      getGameState: mockGetGameState,
      getActivePlayersDeck: mockGetActivePlayersDeck,
      getActivePlayersTokens: mockGetActivePlayersTokens,
      activePlayerHasAllCardsFaceUp: mockAllCardsFaceUp
    }
  });
  const configService = new ConfigService(6, 9, 2, 2, 2);
  const playerService = new PlayerService(configService);
  gameService = new GameService(playerService, tokenService, configService);
  gameState = new GameState();
  gameState.setActiveCard({value: 10});
  mockGetGameState.mockReturnValue(gameState)
});

test('render given basic state hides all subsections and displays right text', () => {
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.START_STATE}  />)

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByTestId('player-turn-action-section')).not.toBeInTheDocument();
  expect(screen.queryByTestId('claim-token-section')).not.toBeInTheDocument();
});

test('render PreEndState shows end actions with all tokens are', () => {
  mockGetActivePlayersTokens.mockReturnValue([]);
  mockGetActivePlayersDeck.mockReturnValue([{seen:true, value:0},{seen:true, value:0},{seen:true, value:4},{seen:true, value:4},{seen:true, value:4}])
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.PRE_END_STATE}  />)
  expect(screen.queryByTestId('claim-token-section')).toBeInTheDocument();
  expect(screen.queryByTestId('player-turn-action-section')).not.toBeInTheDocument();
});

test('render CardDrawn activeCard and options', () => {
  mockAllCardsFaceUp.mockReturnValue(false);
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.CARD_DRAWN}  />)
  expect(screen.queryByTestId('player-turn-action-section')).toBeInTheDocument();
  expect(screen.queryByTestId('claim-token-section')).not.toBeInTheDocument();
});
