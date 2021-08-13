/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Straight5 from './Straight5.js'
const { GameService } = require('../service/GameService.js')
const { PlayerService } = require('../service/PlayerService.js')

let gameService;
let playerService;

beforeEach(() => {
  playerService = new PlayerService(2);
  gameService = new GameService(playerService);
});

test('render Start Section', () => {
  const straight5 = render(<Straight5 gameService={gameService} playerService={playerService} />);
  expect(screen.getByTestId('start-header')).toHaveTextContent('Straight 5');
  expect(screen.queryByTestId('win-header')).toBeNull();expect(screen.getByRole('button')).toHaveTextContent('Start New Game');

  userEvent.click(screen.getByRole('button'));
  expect(screen.queryByTestId('start-header')).toBeInTheDocument();
  expect(screen.queryByTestId('win-header')).toBeNull();
  expect(screen.getAllByTestId('hand').length).toBe(2);
  expect(screen.getAllByTestId('hand')[0]).toHaveTextContent('Tokens?????');
  expect(screen.getAllByTestId('hand')[1]).toHaveTextContent('Tokens?????');
  expect(screen.getByTestId('middle-section')).toHaveTextContent(/Discard\dDeck\?/);
  expect(screen.getByTestId('footer-section')).toBeInTheDocument();

  userEvent.click(screen.getByTestId('middle-section-deck'));
  expect(screen.getByTestId('turn-face-up-button')).toBeInTheDocument();
  userEvent.click(screen.getByTestId('turn-face-up-button'));
  expect(screen.queryByTestId('turn-face-up-button')).not.toBeInTheDocument();

  userEvent.click(screen.getAllByRole('playerCard')[0]);
  userEvent.click(screen.getAllByRole('playerCard')[1]);
  expect(screen.getByTestId('footer-section')).toHaveTextContent('Please draw a card from Deck or Discard');
  expect(screen.getAllByTestId('hand')[0]).toHaveTextContent(/Tokens\d{2}\?{3}/);

  userEvent.click(screen.getByTestId('middle-section-deck'));
  userEvent.click(screen.getByTestId('turn-face-up-button'));
  userEvent.click(screen.getAllByRole('playerCard')[6]);
  userEvent.click(screen.getAllByRole('playerCard')[9]);

  expect(screen.getByTestId('footer-section')).toHaveTextContent('Please draw a card from Deck or Discard');
  expect(screen.getAllByTestId('hand')[1]).toHaveTextContent(/Tokens\?\d\?{2}\d/);
});
