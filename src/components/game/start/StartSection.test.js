/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartSection from './StartSection.js';
const mockStartNewGame = jest.fn()

test('render given basic state hides all subsections and displays right text', () => {
  render(<StartSection startNewGameCallback={mockStartNewGame}></StartSection>);
  expect(screen.getByTestId('startButton')).toHaveTextContent('Start New Game');
  userEvent.click(screen.getByTestId('startButton'));
  expect(mockStartNewGame).toHaveBeenCalledTimes(1);  
});
