/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClaimTokenSection from './ClaimTokenSection.js';
const {PlayerService} = require('../../../service/PlayerService.js');
const {ConfigService} = require('../../../service/ConfigService.js');
const {GameState} = require('../../../model/GameState.js');
const {TokenService} = require('../../../service/TokenService.js');
const GameService = require('../../../service/GameService.js');
const { ActionType, TokenType } = require('../../../model/Enums.js')

jest.mock('../../../service/GameService', () => jest.fn());

let gameService;
let gameState;
const tokenService = new TokenService();
const mockGetActivePlayersDeck = jest.fn()
const mockGetActivePlayersTokens = jest.fn().mockReturnValue([])
const mockCallback = jest.fn();

beforeEach(() => {
  GameService.mockImplementation(() => {
    return {
      getActivePlayersDeck: mockGetActivePlayersDeck,
      getActivePlayersTokens: mockGetActivePlayersTokens,
    }
  });
  const configService = new ConfigService(6, 9, 2, 2, 2);
  const playerService = new PlayerService(configService);
  gameService = new GameService(playerService, tokenService, configService);
  gameState = new GameState();
  gameState.setActiveCard({value: 10});
});

test('render basic claims no tokens', () => {
  mockGetActivePlayersDeck.mockReturnValue([{seen:false, value:0},{seen:false, value:0},{seen:false, value:4},{seen:false, value:4},{seen:false, value:4}])

  render(<ClaimTokenSection gameService={gameService} tokenService={tokenService}  />)

  expect(screen.getAllByRole('button').length).toBe(1);
  expect(screen.getAllByRole('button')[0]).toHaveTextContent('Pass');
  expect(mockGetActivePlayersDeck.mock.calls.length).toBe(5);
  expect(mockGetActivePlayersTokens.mock.calls.length).toBe(5);
});

test('render given sets shows all sets', () => {
  mockGetActivePlayersDeck.mockReturnValue([{seen:true, value:0},{seen:true, value:0},{seen:true, value:4},{seen:true, value:4},{seen:true, value:4}])
  render(<ClaimTokenSection gameService={gameService} tokenService={tokenService} buttonPressedCallback={mockCallback} />)
  expect(screen.queryAllByRole('button').length).toBe(3);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('THREE OF A KIND');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('FULL HOUSE');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('Pass');

  userEvent.click(screen.getAllByRole('button')[0]);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(ActionType.CLAIM_TOKEN);
  expect(mockCallback.mock.calls[0][1]).toBe(TokenType.THREE_OF_A_KIND);

  userEvent.click(screen.getAllByRole('button')[1]);
  expect(mockCallback.mock.calls.length).toBe(2);
  expect(mockCallback.mock.calls[1][0]).toBe(ActionType.CLAIM_TOKEN);
  expect(mockCallback.mock.calls[1][1]).toBe(TokenType.FULL_HOUSE);

  mockCallback.mockClear();
  userEvent.click(screen.getAllByRole('button')[2]);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(ActionType.CHANGE_TURN);
});

test('render given runs shows all runs', () => {
  mockGetActivePlayersDeck.mockReturnValue([{seen:true, value:0},{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4}])
  render(<ClaimTokenSection gameService={gameService} tokenService={tokenService} buttonPressedCallback={mockCallback} />)
  expect(screen.queryAllByRole('button').length).toBe(4);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('THREE IN A ROW');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('FOUR IN A ROW');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('FIVE IN A ROW');
  expect(screen.queryAllByRole('button')[3]).toHaveTextContent('Pass');

  userEvent.click(screen.getAllByRole('button')[0]);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(ActionType.CLAIM_TOKEN);
  expect(mockCallback.mock.calls[0][1]).toBe(TokenType.THREE_IN_A_ROW);

  userEvent.click(screen.getAllByRole('button')[1]);
  expect(mockCallback.mock.calls.length).toBe(2);
  expect(mockCallback.mock.calls[1][0]).toBe(ActionType.CLAIM_TOKEN);
  expect(mockCallback.mock.calls[1][1]).toBe(TokenType.FOUR_IN_A_ROW);

  userEvent.click(screen.getAllByRole('button')[2]);
  expect(mockCallback.mock.calls.length).toBe(3);
  expect(mockCallback.mock.calls[2][0]).toBe(ActionType.CLAIM_TOKEN);
  expect(mockCallback.mock.calls[2][1]).toBe(TokenType.FIVE_IN_A_ROW);

  mockCallback.mockClear();
  userEvent.click(screen.getAllByRole('button')[3]);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(ActionType.CHANGE_TURN);

});
