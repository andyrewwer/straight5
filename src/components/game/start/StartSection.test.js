/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartSection from './StartSection.js';
import {ConfigService} from '../../../service/ConfigService.js'
const mockStartNewGame = jest.fn()

test('render given basic state hides all subsections and displays right text', () => {
  const configService = new ConfigService();
  configService.reset();
  render(<StartSection startNewGameCallback={mockStartNewGame} configService={configService}></StartSection>);
  expect(screen.getByTestId('startButton')).toHaveTextContent('Start New Game');
  expect(screen.getByTestId('start-section-hide-show-configuration-button')).toHaveTextContent('Show Configuration');
  expect(screen.queryByTestId('start-section-slider-container')).not.toBeInTheDocument();
  expect(screen.queryByTestId('close-modal-button')).not.toBeInTheDocument();
  userEvent.click(screen.getByTestId('startButton'));
  expect(mockStartNewGame).toHaveBeenCalledTimes(1);

  userEvent.click(screen.getByTestId('start-section-hide-show-configuration-button'));
  expect(screen.getByTestId('start-section-hide-show-configuration-button')).toHaveTextContent('Show Configuration');
  expect(screen.getByTestId('close-modal-button')).toHaveTextContent('Start New Game');
  expect(screen.queryByTestId('start-section-slider-container')).toBeInTheDocument();

  userEvent.click(screen.getByTestId('close-modal-button'));
  expect(mockStartNewGame).toHaveBeenCalledTimes(2);
});
