/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Hand from './Hand.js'
const {PlayerService} = require('../service/PlayerService.js')
const {GameService} = require('../service/GameService.js')

let playerService = new PlayerService(3);

beforeEach(() => {
  playerService = new PlayerService(3);
  const gameService = new GameService(playerService);
  gameService.startNewGame();
})

test('render new component has 5 face down cards and no tokens', () => {
  render(<Hand playerService={playerService} id={0} />);
  expect(screen.getByRole('header')).toHaveTextContent('Player 1');
  expect(screen.getAllByRole('playerCard').length).toEqual(5);
  expect(screen.getAllByRole('playerCard')[0]).toHaveTextContent('?');
  expect(screen.getAllByRole('playerCard')[1]).toHaveTextContent('?');
  expect(screen.getAllByRole('playerCard')[2]).toHaveTextContent('?');
  expect(screen.getAllByRole('playerCard')[3]).toHaveTextContent('?');
  expect(screen.getAllByRole('playerCard')[4]).toHaveTextContent('?');
  expect(screen.queryByRole('playerToken')).not.toBeInTheDocument();
});

test('render new component has 5 face up cards and tokens', () => {
  playerService.getPlayers()[1].setDeck([{value:0, seen:true},{value:5, seen:true},{value:0, seen:false},{value:2, seen:true},{value:9, seen:true}])
  playerService.getPlayers()[1].setTokens(['THREE_IN_A_ROW', 'FULL_HOUSE']);
  render(<Hand playerService={playerService} id={1} />);
  expect(screen.getByRole('header')).toHaveTextContent('Player 2');
  expect(screen.getAllByRole('playerCard').length).toEqual(5);
  expect(screen.getAllByRole('playerCard')[0]).toHaveTextContent('0');
  expect(screen.getAllByRole('playerCard')[1]).toHaveTextContent('5');
  expect(screen.getAllByRole('playerCard')[2]).toHaveTextContent('?');
  expect(screen.getAllByRole('playerCard')[3]).toHaveTextContent('2');
  expect(screen.getAllByRole('playerCard')[4]).toHaveTextContent('9');
  expect(screen.getAllByRole('playerToken').length).toEqual(2);
  expect(screen.getAllByRole('playerToken')[0]).toHaveTextContent('THREE_IN_A_ROW');
  expect(screen.getAllByRole('playerToken')[1]).toHaveTextContent('FULL_HOUSE');
});

test('render callbackWorks as expected', () => {
  const mockCallback = jest.fn();
  render(<Hand playerService={playerService} id={1} cardPressedCallback={mockCallback} />);
  userEvent.click(screen.getAllByRole('playerCard')[4]);
  expect(mockCallback.mock.calls.length).toEqual(1);
  expect(mockCallback.mock.calls[0].length).toEqual(2);
  expect(mockCallback.mock.calls[0][0]).toEqual(1);
  expect(mockCallback.mock.calls[0][1]).toEqual(4);
});

test('render callbackWorks as expected', () => {
  const mockCallback = jest.fn();
  render(<Hand playerService={playerService} id={0} cardPressedCallback={mockCallback} />);
  userEvent.click(screen.getAllByRole('playerCard')[2]);
  expect(mockCallback.mock.calls.length).toEqual(1);
  expect(mockCallback.mock.calls[0].length).toEqual(2);
  expect(mockCallback.mock.calls[0][0]).toEqual(0);
  expect(mockCallback.mock.calls[0][1]).toEqual(2);
});
