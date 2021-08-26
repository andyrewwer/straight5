/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import HeaderSection from './HeaderSection.js'

test('render renders', () => {
  render(<HeaderSection />);

  expect(screen.getByTestId('header-section')).toHaveTextContent('Straight 5');
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
