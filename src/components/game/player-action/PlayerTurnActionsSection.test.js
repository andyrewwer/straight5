/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayerTurnActionsSection from './PlayerTurnActionsSection.js';
const {PlayerService} = require('../../../service/PlayerService.js');
const {ConfigService} = require('../../../service/ConfigService.js');
const {GameState} = require('../../../model/GameState.js');
const GameService = require('../../../service/GameService.js');
const { ActionType, MoveState } = require('../../../model/Enums.js')

jest.mock('../../../service/GameService', () => jest.fn());

let gameService;
let gameState;
const mockGetGameState = jest.fn()
const mockAllCardsFaceUp = jest.fn()

beforeEach(() => {
  GameService.mockImplementation(() => {
    return {
      getGameState: mockGetGameState,
      activePlayerHasAllCardsFaceUp: mockAllCardsFaceUp
    }
  });
  const configService = new ConfigService(6, 9, 2, 2, 2);
  const playerService = new PlayerService(configService);
  gameService = new GameService(playerService, null, configService);
  gameState = new GameState();
  gameState.setActiveCard({value: 10});
  mockGetGameState.mockReturnValue(gameState)
});

test('render CardDrawn activeCard and options', () => {
  mockAllCardsFaceUp.mockReturnValue(false);
  render(<PlayerTurnActionsSection gameService={gameService} moveState={MoveState.CARD_DRAWN}  />)
  expect(screen.queryAllByRole('button').length).toBe(3);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('Discard to swap two');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('Discard to turn two face up');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('Pass');
  expect(screen.queryByTestId('footer-active-card')).toHaveTextContent('10');
  expect(mockGetGameState).toHaveBeenCalledTimes(3);
});

test('render givenAllCardsFaceUp shouldHideTurnFaceUp', () => {
  mockAllCardsFaceUp.mockReturnValue(true);
  render(<PlayerTurnActionsSection gameService={gameService} moveState={MoveState.CARD_DRAWN}  />)
  expect(screen.queryAllByRole('button').length).toBe(2);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('Discard to swap two');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('Pass');
});

test('render DISCARD CHOSEN', () => {
  mockAllCardsFaceUp.mockReturnValue(false);
  render(<PlayerTurnActionsSection gameService={gameService} moveState={MoveState.DISCARD_CHOSEN}  />)
  expect(screen.queryAllByRole('button').length).toBe(0);
});

test('activeCard callbacks', () => {
  mockAllCardsFaceUp.mockReturnValue(false);
  const mockCallback = jest.fn();
  render(<PlayerTurnActionsSection gameService={gameService} moveState={MoveState.CARD_DRAWN}
  buttonPressedCallback={mockCallback} />)

  expect(screen.queryAllByRole('button').length).toBe(3);

  userEvent.click(screen.getAllByRole('button')[0]);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(ActionType.SWAP);
  mockCallback.mockClear();

  userEvent.click(screen.getAllByRole('button')[1]);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(ActionType.TURN_FACE_UP);
  mockCallback.mockClear();

  userEvent.click(screen.getAllByRole('button')[2]);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(ActionType.PASS);

});
