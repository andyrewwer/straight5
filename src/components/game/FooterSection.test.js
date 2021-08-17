/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FooterSection from './FooterSection.js';
const {PlayerService} = require('../../service/PlayerService.js');
const {ConfigService} = require('../../service/ConfigService.js');
const {TokenService} = require('../../service/TokenService.js');
const GameService = require('../../service/GameService.js');
const { ActionType, MoveState, TokenType } = require('../../model/Enums.js')

jest.mock('../../service/GameService', () => jest.fn());

let gameService;
const tokenService = new TokenService();
const mockGetActiveCard = jest.fn()
const mockGetActivePlayersDeck = jest.fn()
const mockGetActivePlayersTokens = jest.fn()
const mockAllCardsFaceUp = jest.fn()

beforeEach(() => {
  GameService.mockImplementation(() => {
    return {
      getActiveCard: mockGetActiveCard,
      getActivePlayersDeck: mockGetActivePlayersDeck,
      getActivePlayersTokens: mockGetActivePlayersTokens,
      activePlayerHasAllCardsFaceUp: mockAllCardsFaceUp
    }
  });
  const configService = new ConfigService(6, 9, 2, 2);
  const playerService = new PlayerService(configService);
  gameService = new GameService(playerService, tokenService, configService);
});

test('render given basic state hides all subsections and displays right text', () => {
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.START_STATE}  />)

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('activeCard')).not.toBeInTheDocument();
  expect(mockGetActivePlayersTokens.mock.calls.length).toBe(0);
  expect(mockGetActivePlayersDeck.mock.calls.length).toBe(0);
});

test('render PreEndState shows end actions with all tokens are', () => {
  mockGetActivePlayersTokens.mockReturnValue([]);
  mockGetActivePlayersDeck.mockReturnValue([{seen:true, value:0},{seen:true, value:0},{seen:true, value:4},{seen:true, value:4},{seen:true, value:4}])
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.PRE_END_STATE}  />)
  expect(screen.queryAllByRole('button').length).toBe(3);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('THREE OF A KIND');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('FULL HOUSE');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('Pass');
  expect(screen.queryByRole('activeCard')).not.toBeInTheDocument();
  expect(mockGetActivePlayersTokens.mock.calls.length).toBe(5);
  expect(mockGetActivePlayersDeck.mock.calls.length).toBe(5);
});

test('render PreEndState shows end actions with all tokens are', () => {
  mockGetActivePlayersTokens.mockReturnValue([]);
  mockGetActivePlayersDeck.mockReturnValue([{seen:true, value:0},{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4}])
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.PRE_END_STATE}  />)
  expect(screen.queryAllByRole('button').length).toBe(4);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('THREE IN A ROW');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('FOUR IN A ROW');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('FIVE IN A ROW');
  expect(screen.queryAllByRole('button')[3]).toHaveTextContent('Pass');
  expect(screen.queryByRole('activeCard')).not.toBeInTheDocument();
  expect(mockGetActivePlayersTokens.mock.calls.length).toBe(5);
  expect(mockGetActivePlayersDeck.mock.calls.length).toBe(5);
});

test('render CardDrawn activeCard and options', () => {
  mockAllCardsFaceUp.mockReturnValue(false);
  mockGetActiveCard.mockReturnValue({value: 10})
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.CARD_DRAWN}  />)
  expect(screen.queryAllByRole('button').length).toBe(3);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('Discard to swap two');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('Discard to turn two face up');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('Pass');
  expect(screen.queryByRole('activeCard')).toHaveTextContent('10');
  expect(mockGetActivePlayersTokens.mock.calls.length).toBe(0);
  expect(mockGetActivePlayersDeck.mock.calls.length).toBe(0);
  expect(mockGetActiveCard.mock.calls.length).toBe(3);
});

test('render givenAllCardsFaceUp shouldHideTurnFaceUp', () => {
  mockAllCardsFaceUp.mockReturnValue(true);
  mockGetActiveCard.mockReturnValue({value: 10})
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.CARD_DRAWN}  />)
  expect(screen.queryAllByRole('button').length).toBe(2);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('Discard to swap two');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('Pass');
});

test('render DISCARD CHOSEN', () => {
  mockAllCardsFaceUp.mockReturnValue(false);
  mockGetActiveCard.mockReturnValue({value: 10})
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.DISCARD_CHOSEN}  />)
  expect(screen.queryAllByRole('button').length).toBe(0);
});

test('activeCard callbacks', () => {
  mockAllCardsFaceUp.mockReturnValue(false);
  mockGetActiveCard.mockReturnValue({value: 10})
  const mockCallback = jest.fn();
  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.CARD_DRAWN}
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

test('claimToken callbacks', () => {
  mockGetActivePlayersTokens.mockReturnValue([]);
  mockGetActivePlayersDeck.mockReturnValue([{seen:true, value:0},{seen:true, value:1},{seen:true, value:2},{seen:true, value:3},{seen:true, value:4}])
  const mockCallback = jest.fn();

  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.PRE_END_STATE}
  buttonPressedCallback={mockCallback}  />)
  expect(screen.queryAllByRole('button').length).toBe(4);

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

test('claimToken callbacks', () => {
  mockGetActivePlayersTokens.mockReturnValue([]);
  mockGetActivePlayersDeck.mockReturnValue([{seen:true, value:0},{seen:true, value:0},{seen:true, value:4},{seen:true, value:4},{seen:true, value:4}])
  const mockCallback = jest.fn();

  render(<FooterSection gameService={gameService} tokenService={tokenService} moveState={MoveState.PRE_END_STATE}
  buttonPressedCallback={mockCallback}  />)
  expect(screen.queryAllByRole('button').length).toBe(3);

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
