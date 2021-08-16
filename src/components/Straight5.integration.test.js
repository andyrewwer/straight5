/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Straight5 from './Straight5.js'
const { GameService } = require('../service/GameService.js')
const {ConfigService} = require('../service/ConfigService.js');
const { PlayerService } = require('../service/PlayerService.js')
const { StateService } = require('../service/StateService.js')
const {ActionType, AppMode, MoveState} = require('../model/Enums.js')

const configService = new ConfigService(6, 9, 2, 2);
const playerService = new PlayerService(configService);
const gameService = new GameService(playerService, configService);
const stateService = new StateService(AppMode.START_STATE, MoveState.START_STATE, ActionType.PASS);

test('render Start Section', () => {
  render(<Straight5 gameService={gameService} playerService={playerService} configService={configService} stateService={stateService}/>);
  expect(screen.getByTestId('start-header')).toHaveTextContent('Straight 5');
  expect(screen.queryByTestId('win-header')).toBeNull();expect(screen.getByRole('button')).toHaveTextContent('Start New Game');

  userEvent.click(screen.getByRole('button'));
  expect(screen.queryByTestId('start-header')).toBeInTheDocument();
  expect(screen.queryByTestId('win-header')).toBeNull();
  expect(screen.getAllByTestId('hand').length).toBe(2);
  expect(screen.getAllByTestId('hand')[0]).toHaveTextContent('Tokens [0/4]');
  expect(screen.getAllByTestId('hand')[1]).toHaveTextContent('Tokens [0/4]');
  expect(screen.getByTestId('middle-section')).toHaveTextContent(/Discard 1\dDiscard 2\dDeck/);
  expect(screen.getByTestId('footer-section')).toBeInTheDocument();

  userEvent.click(screen.getByTestId('middle-section-deck'));
  expect(screen.getByTestId('turn-face-up-button')).toBeInTheDocument();
  userEvent.click(screen.getByTestId('turn-face-up-button'));
  expect(screen.queryByTestId('turn-face-up-button')).not.toBeInTheDocument();

  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please select the discard pile you would like to discard the card to');
  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  userEvent.click(screen.getAllByRole('playerCard')[0]);
  userEvent.click(screen.getAllByRole('playerCard')[1]);

  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please draw a card from Deck or Discard');
  expect(screen.getAllByTestId('hand')[0]).toHaveTextContent(/Tokens \[0\/4\]\d{2}/);

  userEvent.click(screen.getByTestId('middle-section-deck'));
  userEvent.click(screen.getByTestId('turn-face-up-button'));
  userEvent.click(screen.getByTestId('middle-section-discard-0'));
  userEvent.click(screen.getAllByRole('playerCard')[6]);
  userEvent.click(screen.getAllByRole('playerCard')[9]);

  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please draw a card from Deck or Discard');
  expect(screen.getAllByTestId('hand')[1]).toHaveTextContent(/Tokens \[0\/4\]\d\d/);
});
