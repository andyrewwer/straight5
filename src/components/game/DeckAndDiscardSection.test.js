/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import DeckAndDiscardSection from './DeckAndDiscardSection.js'
const {GameService} = require('../../service/GameService.js')
const {GameState} = require('../../model/GameState.js')
const {ConfigService} = require('../../service/ConfigService.js');
const {PlayerService} = require('../../service/PlayerService.js')
const {DrawType, MoveState, TokenType} = require('../../model/Enums.js')


let gameService;

beforeEach(() => {
  const configService = new ConfigService(6, 9, 2, 2, 2);
  const playerService = new PlayerService(configService);
  gameService = new GameService(playerService, null, configService, new GameState())
})

test('render with Discard shows value', () => {
  gameService.getGameState().setDiscard([[{value:0}, {value:1}, {value:2}]])
  render(<DeckAndDiscardSection gameService={gameService} moveState={MoveState.START_STATE} />);
  expect(screen.getByTestId('discard-header')).toHaveTextContent('Discard');
  expect(screen.getByTestId('deck-header')).toHaveTextContent('Deck');
  expect(screen.getByTestId('discard-pile-0')).toHaveTextContent('2');
  expect(screen.getByTestId('discard-pile-0')).toHaveClass('PlayerCard');
  expect(screen.getByTestId('discard-pile-0')).toHaveClass('PlayerCardIsActive');
  // TODO  test for SVG
  expect(screen.getByTestId('deck-pile-0')).toBeInTheDocument();
  expect(screen.getByTestId('deck-pile-0')).toHaveClass('PlayerCard');
  expect(screen.getByTestId('deck-pile-0')).toHaveClass('PlayerCardIsActive');
});

test('render without Discard shows question  mark', () => {
  render(<DeckAndDiscardSection gameService={gameService} moveState={MoveState.CARD_DRAWN} />);
  expect(screen.getByTestId('discard-header')).toHaveTextContent('Discard');
  expect(screen.getByTestId('deck-header')).toHaveTextContent('Deck');
  expect(screen.getByTestId('discard-pile-0')).toHaveTextContent('');
  expect(screen.getByTestId('discard-pile-0')).toHaveClass('PlayerCard');
  expect(screen.getByTestId('discard-pile-0')).not.toHaveClass('PlayerCardIsActive');
  // TODO  test for SVG
  expect(screen.getByTestId('deck-pile-0')).toBeInTheDocument();
  expect(screen.getByTestId('deck-pile-0')).toHaveClass('PlayerCard');
  expect(screen.getByTestId('deck-pile-0')).not.toHaveClass('PlayerCardIsActive');
});

test('render buttons fire as expected', () => {
  const mockCallback = jest.fn();
  render(<DeckAndDiscardSection gameService={gameService} drawCallback={mockCallback}/>);

  userEvent.click(screen.getByTestId('discard-pile-0'));
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(DrawType.DISCARD);

  mockCallback.mockClear();
  userEvent.click(screen.getByTestId('deck-pile-0'));
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe(DrawType.DECK);
});
