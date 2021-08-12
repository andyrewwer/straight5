/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import MiddleSection from './MiddleSection.js'
const {GameService} = require('../service/GameService.js')
const {PlayerService} = require('../service/PlayerService.js')


let gameService;

beforeEach(() => {
 const playerService = new PlayerService(3);
 gameService = new GameService(playerService)
})

test('render with Discard shows value', () => {
  gameService.setDiscard([{value:0}, {value:1}, {value:2}])
  render(<MiddleSection gameService={gameService} />);
  expect(screen.getAllByRole('header').length).toBe(2);
  expect(screen.getAllByRole('header')[0]).toHaveTextContent('Discard');
  expect(screen.getAllByRole('header')[1]).toHaveTextContent('Deck');
  expect(screen.getByTestId('middle-section-discard')).toHaveTextContent('2');
  expect(screen.getByTestId('middle-section-deck')).toHaveTextContent('?');
});

test('render without Discard shows question  mark', () => {
  render(<MiddleSection gameService={gameService} />);
  expect(screen.getAllByRole('header').length).toBe(2);
  expect(screen.getAllByRole('header')[0]).toHaveTextContent('Discard');
  expect(screen.getAllByRole('header')[1]).toHaveTextContent('Deck');
  expect(screen.getByTestId('middle-section-discard')).toHaveTextContent('');
  expect(screen.getByTestId('middle-section-deck')).toHaveTextContent('?');
});

test('render buttons fire as expected', () => {
  const mockCallback = jest.fn();
  render(<MiddleSection gameService={gameService} drawCallback={mockCallback}/>);

  userEvent.click(screen.getByTestId('middle-section-discard'));
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe('discard');

  mockCallback.mockClear();
  userEvent.click(screen.getByTestId('middle-section-deck'));
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback.mock.calls[0][0]).toBe('deck');
});
