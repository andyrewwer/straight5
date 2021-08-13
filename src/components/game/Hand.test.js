/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Hand from './Hand.js'
const {PlayerService} = require('../../service/PlayerService.js')
const {GameService} = require('../../service/GameService.js')
const {TokenType, MoveState} = require('../../model/Enums.js')

let playerService;
let gameService;

beforeEach(() => {
  playerService = new PlayerService(3);
  gameService = new GameService(playerService);
  gameService.startNewGame(6, 9);
})

test('render new component has 5 face down cards and no tokens', () => {
  gameService.setActivePlayerIndex(0);
  render(<Hand playerService={playerService} gameService={gameService} moveState={MoveState.CARD_DRAWN} id={0} />);
  expect(screen.getByRole('header')).toHaveTextContent('Player 1');
  expect(screen.getAllByRole('playerCard').length).toEqual(5);
  // TODO how to test for SVG exists
  expect(screen.getAllByRole('playerCard')[0]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[1]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[2]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[3]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[4]).toHaveClass('PlayerCardIsActive');
  expect(screen.queryByRole('playerToken')).not.toBeInTheDocument();
});

test('render new component has 5 face up cards and tokens', () => {
  gameService.setActivePlayerIndex(0);
  playerService.getPlayers()[1].setDeck([{value:0, seen:true},{value:5, seen:true},{value:0, seen:false},{value:2, seen:true},{value:9, seen:true}])
  playerService.getPlayers()[1].setTokens([TokenType.THREE_IN_A_ROW, TokenType.FULL_HOUSE]);
  render(<Hand playerService={playerService} id={1} gameService={gameService} moveState={MoveState.CARD_DRAWN} />);
  expect(screen.getByRole('header')).toHaveTextContent('Player 2');
  expect(screen.getAllByRole('playerCard').length).toEqual(5);
  expect(screen.getAllByRole('playerCard')[0]).toHaveTextContent('0');
  expect(screen.getAllByRole('playerCard')[0]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[1]).toHaveTextContent('5');
  expect(screen.getAllByRole('playerCard')[1]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[2]).toBeInTheDocument();
  expect(screen.getAllByRole('playerCard')[2]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[3]).toHaveTextContent('2');
  expect(screen.getAllByRole('playerCard')[3]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[4]).toHaveTextContent('9');
  expect(screen.getAllByRole('playerCard')[4]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerToken').length).toEqual(2);
  expect(screen.getAllByRole('playerToken')[0]).toHaveTextContent(TokenType.THREE_IN_A_ROW);
  expect(screen.getAllByRole('playerToken')[1]).toHaveTextContent(TokenType.FULL_HOUSE);
});

test('render with START STATE does not highlight buttons', () => {
  gameService.setActivePlayerIndex(0);
  render(<Hand playerService={playerService} id={0} gameService={gameService} moveState={MoveState.START_STATE} />);
  expect(screen.getAllByRole('playerCard').length).toEqual(5);
  expect(screen.getAllByRole('playerCard')[0]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[1]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[2]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[3]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[4]).not.toHaveClass('PlayerCardIsActive');
});

test('render callbackWorks as expected', () => {
  const mockCallback = jest.fn();
  render(<Hand playerService={playerService} id={1} gameService={gameService} moveState={MoveState.CARD_DRAWN} cardPressedCallback={mockCallback} />);
  userEvent.click(screen.getAllByRole('playerCard')[4]);
  expect(mockCallback.mock.calls.length).toEqual(1);
  expect(mockCallback.mock.calls[0].length).toEqual(2);
  expect(mockCallback.mock.calls[0][0]).toEqual(1);
  expect(mockCallback.mock.calls[0][1]).toEqual(4);
});

test('render callbackWorks as expected', () => {
  const mockCallback = jest.fn();
  render(<Hand playerService={playerService} id={0} gameService={gameService} moveState={MoveState.CARD_DRAWN} cardPressedCallback={mockCallback} />);
  userEvent.click(screen.getAllByRole('playerCard')[2]);
  expect(mockCallback.mock.calls.length).toEqual(1);
  expect(mockCallback.mock.calls[0].length).toEqual(2);
  expect(mockCallback.mock.calls[0][0]).toEqual(0);
  expect(mockCallback.mock.calls[0][1]).toEqual(2);
});

test('render with DISCARD_CHOSEN Highlights face-up', () => {
  gameService.setActivePlayerIndex(0);
  playerService.getPlayers()[0].setDeck([{value:0, seen:true},{value:5, seen:false},{value:0, seen:false},{value:2, seen:false},{value:9, seen:false}])
  render(<Hand playerService={playerService} id={0} gameService={gameService} moveState={MoveState.DISCARD_CHOSEN} />);
  expect(screen.getAllByRole('playerCard').length).toEqual(5);
  expect(screen.getAllByRole('playerCard')[0]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[1]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[2]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[3]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[4]).toHaveClass('PlayerCardIsActive');
});

test('render with CARD_DISCARDED Highlights face-up', () => {
  gameService.setActivePlayerIndex(0);
  playerService.getPlayers()[0].setDeck([{value:0, seen:false},{value:5, seen:true},{value:0, seen:true},{value:2, seen:false},{value:9, seen:false}])
  render(<Hand playerService={playerService} id={0} gameService={gameService} moveState={MoveState.DISCARD_CHOSEN} />);
  expect(screen.getAllByRole('playerCard').length).toEqual(5);
  expect(screen.getAllByRole('playerCard')[0]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[1]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[2]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[3]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[4]).toHaveClass('PlayerCardIsActive');
});

test('render with SWAP_IN_PROGRESS Highlights face-up', () => {
  gameService.setActivePlayerIndex(0);
  gameService.setSwapCardIndex(2);
  playerService.getPlayers()[0].setDeck([{value:0, seen:false},{value:5, seen:true},{value:0, seen:true},{value:2, seen:false},{value:9, seen:false}])
  render(<Hand playerService={playerService} id={0} gameService={gameService} moveState={MoveState.SWAP_IN_PROGRESS} />);
  expect(screen.getAllByRole('playerCard').length).toEqual(5);
  expect(screen.getAllByRole('playerCard')[0]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[1]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[2]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[3]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByRole('playerCard')[4]).toHaveClass('PlayerCardIsActive');
});
