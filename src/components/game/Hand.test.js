/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Hand from './Hand.js'
const {PlayerService} = require('../../service/PlayerService.js')
const {ConfigService} = require('../../service/ConfigService.js');
const {TokenService} = require('../../service/TokenService.js');
const {GameService} = require('../../service/GameService.js')
const {GameState} = require('../../model/GameState.js')
const {TokenType, MoveState} = require('../../model/Enums.js')

let playerService;
let gameService;
const configService = new ConfigService();
configService.reset();

beforeEach(() => {
  const tokenService = new TokenService();
  playerService = new PlayerService(configService);
  gameService = new GameService(playerService, tokenService, configService, new GameState());
  gameService.startNewGame(6, 9);
})

test('render new component has 5 face down cards and no tokens', () => {
  gameService.getGameState().setActivePlayerIndex(0);
  render(<Hand playerService={playerService} configService={configService} gameService={gameService} moveState={MoveState.CARD_DRAWN} id={0} />);
  expect(screen.getByTestId('player-header')).toHaveTextContent('Player 1');
  expect(screen.getByTestId('hand-player-tokens')).toHaveTextContent('0/4');
  expect(screen.getAllByTestId('player-card').length).toEqual(5);
  // TODO how to test for SVG exists
  expect(screen.getAllByTestId('player-card')[0]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[1]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[2]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[3]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[4]).toHaveClass('PlayerCardIsActive');
  expect(screen.queryByTestId('player-token')).not.toBeInTheDocument();
});

test('render new component has 5 face up cards and tokens', () => {
  gameService.getGameState().setActivePlayerIndex(0);
  playerService.getPlayers()[1].setDeck([{value:0, seen:true},{value:5, seen:true},{value:0, seen:false},{value:2, seen:true},{value:9, seen:true}])
  playerService.getPlayers()[1].setTokens([TokenType.THREE_IN_A_ROW, TokenType.FULL_HOUSE]);
  render(<Hand playerService={playerService} configService={configService} id={1} gameService={gameService} moveState={MoveState.CARD_DRAWN} />);
  expect(screen.getByTestId('player-header')).toHaveTextContent('Player 2');
  expect(screen.getAllByTestId('player-card').length).toEqual(5);
  expect(screen.getAllByTestId('player-card')[0]).toHaveTextContent('0');
  expect(screen.getAllByTestId('player-card')[0]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[1]).toHaveTextContent('5');
  expect(screen.getAllByTestId('player-card')[1]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[2]).toBeInTheDocument();
  expect(screen.getAllByTestId('player-card')[2]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[3]).toHaveTextContent('2');
  expect(screen.getAllByTestId('player-card')[3]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[4]).toHaveTextContent('9');
  expect(screen.getAllByTestId('player-card')[4]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-token').length).toEqual(2);
  expect(screen.getAllByTestId('player-token')[0]).toHaveTextContent(TokenType.THREE_IN_A_ROW);
  expect(screen.getAllByTestId('player-token')[1]).toHaveTextContent(TokenType.FULL_HOUSE);
});

test('render with START STATE does not highlight buttons', () => {
  gameService.getGameState().setActivePlayerIndex(0);
  render(<Hand playerService={playerService} configService={configService} id={0} gameService={gameService} moveState={MoveState.START_STATE} />);
  expect(screen.getAllByTestId('player-card').length).toEqual(5);
  expect(screen.getAllByTestId('player-card')[0]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[1]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[2]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[3]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[4]).not.toHaveClass('PlayerCardIsActive');
});

test('render callbackWorks as expected', () => {
  const mockCallback = jest.fn();
  render(<Hand playerService={playerService} configService={configService} id={1} gameService={gameService} moveState={MoveState.CARD_DRAWN} cardPressedCallback={mockCallback} />);
  userEvent.click(screen.getAllByTestId('player-card')[4]);
  expect(mockCallback.mock.calls.length).toEqual(1);
  expect(mockCallback.mock.calls[0].length).toEqual(2);
  expect(mockCallback.mock.calls[0][0]).toEqual(1);
  expect(mockCallback.mock.calls[0][1]).toEqual(4);
});

test('render callbackWorks as expected', () => {
  const mockCallback = jest.fn();
  render(<Hand playerService={playerService} configService={configService}id={0} gameService={gameService} moveState={MoveState.CARD_DRAWN} cardPressedCallback={mockCallback} />);
  userEvent.click(screen.getAllByTestId('player-card')[2]);
  expect(mockCallback.mock.calls.length).toEqual(1);
  expect(mockCallback.mock.calls[0].length).toEqual(2);
  expect(mockCallback.mock.calls[0][0]).toEqual(0);
  expect(mockCallback.mock.calls[0][1]).toEqual(2);
});

test('render with TURN_FACE_UP_CHOSEN Highlights face-up', () => {
  gameService.getGameState().setActivePlayerIndex(0);
  playerService.getPlayers()[0].setDeck([{value:0, seen:true},{value:5, seen:false},{value:0, seen:false},{value:2, seen:false},{value:9, seen:false}])
  render(<Hand playerService={playerService} configService={configService} id={0} gameService={gameService} moveState={MoveState.TURN_FACE_UP_CHOSEN} />);
  expect(screen.getAllByTestId('player-card').length).toEqual(5);
  expect(screen.getAllByTestId('player-card')[0]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[1]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[2]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[3]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[4]).toHaveClass('PlayerCardIsActive');
});

test('render with TURN_FACE_UP_IN_PROGRESS Highlights face-up', () => {
  gameService.getGameState().setActivePlayerIndex(0);
  playerService.getPlayers()[0].setDeck([{value:0, seen:false},{value:5, seen:true},{value:0, seen:true},{value:2, seen:false},{value:9, seen:false}])
  render(<Hand playerService={playerService} configService={configService} id={0} gameService={gameService} moveState={MoveState.TURN_FACE_UP_CHOSEN} />);
  expect(screen.getAllByTestId('player-card').length).toEqual(5);
  expect(screen.getAllByTestId('player-card')[0]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[1]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[2]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[3]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[4]).toHaveClass('PlayerCardIsActive');
});

test('render with SWAP_IN_PROGRESS Highlights face-up', () => {
  gameService.getGameState().setActivePlayerIndex(0);
  gameService.getGameState().setSwapCardIndex(2);
  playerService.getPlayers()[0].setDeck([{value:0, seen:false},{value:5, seen:true},{value:0, seen:true},{value:2, seen:false},{value:9, seen:false}])
  render(<Hand playerService={playerService} configService={configService} id={0} gameService={gameService} moveState={MoveState.SWAP_IN_PROGRESS} />);
  expect(screen.getAllByTestId('player-card').length).toEqual(5);
  expect(screen.getAllByTestId('player-card')[0]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[1]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[2]).not.toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[3]).toHaveClass('PlayerCardIsActive');
  expect(screen.getAllByTestId('player-card')[4]).toHaveClass('PlayerCardIsActive');
});

test('render new component with 3 tokens to win', () => {
  configService.setNumberOfTokensNeededToWin(3);
  gameService.getGameState().setActivePlayerIndex(0);
  render(<Hand playerService={playerService} configService={configService} gameService={gameService} moveState={MoveState.CARD_DRAWN} id={0} />);
  expect(screen.getByTestId('hand-player-tokens')).toHaveTextContent('0/3');
});
