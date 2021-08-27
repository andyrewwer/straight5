/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewstickerSection from './NewstickerSection.js';
const {GameState} = require('../../../model/GameState.js');
const { ActionType, MoveState, TokenType } = require('../../../model/Enums.js')

let gameState;

beforeEach(() => {
  gameState = new GameState();
  gameState.setSwapCardIndex(0);
});

test('render START_STATE', () => {
  render(<NewstickerSection gameState={gameState} moveState={MoveState.START_STATE}  />)
  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please draw a card from Deck or Discard');
});

test('render PRE_END_STATE', () => {
  render(<NewstickerSection gameState={gameState} moveState={MoveState.PRE_END_STATE}  />)
  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please select a token to claim or pass');
});

test('render CARD_DRAWN', () => {
  render(<NewstickerSection gameState={gameState} moveState={MoveState.CARD_DRAWN}  />)
  expect(screen.getByTestId('newsticker')).toHaveTextContent('Replace card in your hand or choose a discard option');
});

test('render DISCARD_CHOSEN', () => {
  render(<NewstickerSection gameState={gameState} moveState={MoveState.DISCARD_CHOSEN}  />)
  expect(screen.getByTestId('newsticker')).toHaveTextContent('Please select the discard pile you would like to discard the card to');
});
