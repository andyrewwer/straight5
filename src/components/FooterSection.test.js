/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import FooterSection from './FooterSection.js'
const {PlayerService} = require('../service/PlayerService.js')
const GameService = require('../service/GameService.js')

jest.mock('../service/GameService', () => jest.fn());

let gameService = {};
const mockSwapCardIndex = jest.fn()
const mockCanClaimToken = jest.fn()
const mockGetActiveCard = jest.fn()

beforeEach(() => {
  // const GameService = require('../service/GameService.js')
  jest.mock('../service/GameService.js')
  GameService.mockImplementation(() => {
    return {
      getSwapCardIndex: mockSwapCardIndex,
      canClaimToken: mockCanClaimToken,
      getActiveCard: mockGetActiveCard
    }
  })

  const playerService = new PlayerService(2);
  gameService = new GameService(2, playerService);
});

test('render given basic state hides all subsections and displays right text', () => {
  render(<FooterSection gameService={gameService} moveState={'StartState'}  />)

  expect(screen.getByRole('header')).toHaveTextContent('Please draw a card from Deck or Discard');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('activeCard')).not.toBeInTheDocument();
  expect(mockSwapCardIndex.mock.calls.length).toBe(1);
  expect(mockCanClaimToken.mock.calls.length).toBe(0);
});

test('render PreEndState shows end actions with all tokens are', () => {
  mockCanClaimToken.mockReturnValue(true);
  render(<FooterSection gameService={gameService} moveState={'PreEndState'}  />)
  expect(screen.getByRole('header')).toHaveTextContent('Please select a token to claim or pass');
  expect(screen.queryAllByRole('button').length).toBe(6);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('Pass');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('THREE IN A ROW');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('FOUR IN A ROW');
  expect(screen.queryAllByRole('button')[3]).toHaveTextContent('FIVE IN A ROW');
  expect(screen.queryAllByRole('button')[4]).toHaveTextContent('THREE OF A KIND');
  expect(screen.queryAllByRole('button')[5]).toHaveTextContent('FULL HOUSE');
  expect(screen.queryByRole('activeCard')).not.toBeInTheDocument();
  expect(mockSwapCardIndex.mock.calls.length).toBe(1);
  expect(mockCanClaimToken.mock.calls.length).toBe(5);
  expect(mockCanClaimToken.mock.calls[0][0]).toBe('THREE_IN_A_ROW');
  expect(mockCanClaimToken.mock.calls[1][0]).toBe('FOUR_IN_A_ROW');
  expect(mockCanClaimToken.mock.calls[2][0]).toBe('FIVE_IN_A_ROW');
  expect(mockCanClaimToken.mock.calls[3][0]).toBe('THREE_OF_A_KIND');
  expect(mockCanClaimToken.mock.calls[4][0]).toBe('FULL_HOUSE');
});

test('render PreEndState shows end actions with some Tokens', () => {
  mockCanClaimToken.mockReturnValueOnce(false).mockReturnValue(true);
  render(<FooterSection gameService={gameService} moveState={'PreEndState'}  />)
  expect(screen.getByRole('header')).toHaveTextContent('Please select a token to claim or pass');
  expect(screen.queryAllByRole('button').length).toBe(5);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('Pass');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('FOUR IN A ROW');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('FIVE IN A ROW');
  expect(screen.queryAllByRole('button')[3]).toHaveTextContent('THREE OF A KIND');
  expect(screen.queryAllByRole('button')[4]).toHaveTextContent('FULL HOUSE');
  expect(screen.queryByRole('activeCard')).not.toBeInTheDocument();
  expect(mockSwapCardIndex.mock.calls.length).toBe(1);
  expect(mockCanClaimToken.mock.calls.length).toBe(5);
  expect(mockGetActiveCard).not.toHaveBeenCalled();
});

test('render CardDrawn activeCard and options', () => {
  mockGetActiveCard.mockReturnValue({value: 10})
  render(<FooterSection gameService={gameService} moveState={'CardDrawn'}  />)
  expect(screen.getByRole('header')).toHaveTextContent('Replace card in your hand or choose a discard option');
  expect(screen.queryAllByRole('button').length).toBe(3);
  expect(screen.queryAllByRole('button')[0]).toHaveTextContent('Pass');
  expect(screen.queryAllByRole('button')[1]).toHaveTextContent('Discard to turn two face up');
  expect(screen.queryAllByRole('button')[2]).toHaveTextContent('Discard to swap two');
  expect(screen.queryByRole('activeCard')).toHaveTextContent('10');
  expect(mockSwapCardIndex.mock.calls.length).toBe(1);
  expect(mockCanClaimToken).not.toHaveBeenCalled()
  expect(mockGetActiveCard.mock.calls.length).toBe(3);
});

test('activeCard callbacks', () => {
  mockGetActiveCard.mockReturnValue({value: 10})
  const mockPass = jest.fn();
  const mockTurnUp = jest.fn();
  const mockSwap = jest.fn();
  render(<FooterSection gameService={gameService} moveState={'CardDrawn'}
  passTurnButtonPressed={mockPass}
  turnCardsFaceUpButtonPressed={mockTurnUp}
  swapCardsButtonPressed={mockSwap}  />)

  expect(screen.queryAllByRole('button').length).toBe(3);
  userEvent.click(screen.getAllByRole('button')[0]);
  expect(mockPass.mock.calls.length).toBe(1);

  userEvent.click(screen.getAllByRole('button')[1]);
  expect(mockTurnUp.mock.calls.length).toBe(1);

  userEvent.click(screen.getAllByRole('button')[2]);
  expect(mockSwap.mock.calls.length).toBe(1);
});

test('claimToken callbacks', () => {
  mockCanClaimToken.mockReturnValue(true);
  const mockChangeTurn = jest.fn();
  const mockClaimToken = jest.fn();
  
  render(<FooterSection gameService={gameService} moveState={'PreEndState'}
  changeTurn={mockChangeTurn} claimToken={mockClaimToken}  />)
  expect(screen.queryAllByRole('button').length).toBe(6);

  userEvent.click(screen.getAllByRole('button')[0]);
  expect(mockChangeTurn.mock.calls.length).toBe(1);

  userEvent.click(screen.getAllByRole('button')[1]);
  expect(mockClaimToken.mock.calls.length).toBe(1);
  expect(mockClaimToken.mock.calls[0][0]).toBe('THREE_IN_A_ROW');

  userEvent.click(screen.getAllByRole('button')[2]);
  expect(mockClaimToken.mock.calls.length).toBe(2);
  expect(mockClaimToken.mock.calls[1][0]).toBe('FOUR_IN_A_ROW');

  userEvent.click(screen.getAllByRole('button')[3]);
  expect(mockClaimToken.mock.calls.length).toBe(3);
  expect(mockClaimToken.mock.calls[2][0]).toBe('FIVE_IN_A_ROW');

  userEvent.click(screen.getAllByRole('button')[4]);
  expect(mockClaimToken.mock.calls.length).toBe(4);
  expect(mockClaimToken.mock.calls[3][0]).toBe('THREE_OF_A_KIND');

  userEvent.click(screen.getAllByRole('button')[5]);
  expect(mockClaimToken.mock.calls.length).toBe(5);
  expect(mockClaimToken.mock.calls[4][0]).toBe('FULL_HOUSE');
});
