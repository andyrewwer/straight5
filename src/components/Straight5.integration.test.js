/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Straight5 from './Straight5.js'
const { GameService } = require('../service/GameService.js')
const { GameState } = require('../model/GameState.js')
const {ConfigService} = require('../service/ConfigService.js');
const {TokenService} = require('../service/TokenService.js');
const { PlayerService } = require('../service/PlayerService.js')

const configService = new ConfigService(6, 9, 2, 2, 2);
const tokenService = new TokenService();
const playerService = new PlayerService(configService);
const gameState = new GameState()
const gameService = new GameService(playerService, tokenService, configService, gameState);

test('render Rules Modal', () => {
  render(<Straight5 gameService={gameService} playerService={playerService} configService={configService} tokenService={tokenService} gameState={gameState}/>);

  expect(screen.queryByTestId('tokens-to-win')).not.toBeInTheDocument();
  expect(screen.queryByTestId('rules-section')).not.toBeInTheDocument();

  userEvent.click(screen.getByTestId('open-modal-button'));
  expect(screen.getByTestId('header-section')).toHaveTextContent('Straight 5');
  expect(screen.getByTestId('tokens-to-win')).toHaveTextContent('4 out of 5');
  expect(screen.getByTestId('rules-section')).toBeInTheDocument();

  userEvent.click(screen.getByTestId('close-modal-button'));
  expect(screen.getByTestId('header-section')).toHaveTextContent('Straight 5');
  expect(screen.queryByTestId('tokens-to-win')).not.toBeInTheDocument();
  expect(screen.queryByTestId('rules-section')).not.toBeInTheDocument();
});

test('render Start Section', () => {
  render(<Straight5 gameService={gameService} playerService={playerService} configService={configService} tokenService={tokenService} gameState={gameState}/>);
  expect(screen.getByTestId('start-header')).toHaveTextContent('Straight 5');
  expect(screen.queryByTestId('win-header')).toBeNull();
  expect(screen.getByTestId('startButton')).toHaveTextContent('Start New Game');

  userEvent.click(screen.getByTestId('startButton'));
  expect(screen.queryByTestId('start-header')).toBeInTheDocument();
  expect(screen.queryByTestId('win-header')).toBeNull();
  expect(screen.getAllByTestId('hand').length).toBe(2);
  expect(screen.getAllByTestId('hand')[0]).toHaveTextContent('Tokens [0/4]');
  expect(screen.getAllByTestId('hand')[1]).toHaveTextContent('Tokens [0/4]');
  expect(screen.getByTestId('middle-section')).toHaveTextContent(/Discard 1(\d|WILD)Discard 2(\d|WILD)Deck/);
  expect(screen.getByTestId('footer-section')).toBeInTheDocument();

  userEvent.click(screen.getByTestId('middle-section-deck'));
  expect(screen.getByTestId('turn-face-up-button')).toBeInTheDocument();
  userEvent.click(screen.getByTestId('turn-face-up-button'));

  expect(screen.getByTestId('newsticker')).toHaveTextContent('Select the first card to turn face up');
  userEvent.click(screen.getAllByRole('playerCard')[0]);
  userEvent.click(screen.getAllByRole('playerCard')[1]);
  expect(screen.queryByTestId('turn-face-up-button')).not.toBeInTheDocument();
  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please select the discard pile you would like to discard the card to');
  userEvent.click(screen.getByTestId('middle-section-discard-0'));

  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please draw a card from Deck or Discard');
  expect(screen.getAllByTestId('hand')[0]).toHaveTextContent(/Tokens \[0\/4\](\d|WILD){2}/);

  userEvent.click(screen.getByTestId('middle-section-deck'));
  userEvent.click(screen.getByTestId('turn-face-up-button'));
  userEvent.click(screen.getAllByRole('playerCard')[6]);
  userEvent.click(screen.getAllByRole('playerCard')[9]);
  userEvent.click(screen.getByTestId('middle-section-discard-0'));

  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please draw a card from Deck or Discard');
  expect(screen.getAllByTestId('hand')[1]).toHaveTextContent(/Tokens \[0\/4\](\d|WILD){2}/);
});
