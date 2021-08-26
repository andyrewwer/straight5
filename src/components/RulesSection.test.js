/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import RulesSection from './RulesSection.js'

test('render renders', () => {
  render(<RulesSection numberOfTokensNeededToWin={4} maxTokens={5}  />)
  expect(screen.getByTestId('tokens-to-win')).toHaveTextContent('4 out of 5');
});

test('render renders', () => {
  render(<RulesSection numberOfTokensNeededToWin={9} maxTokens={6}  />)
  expect(screen.getByTestId('tokens-to-win')).toHaveTextContent('9 out of 6');
});
