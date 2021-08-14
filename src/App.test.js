/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App.js'

test('render App Section', () => {
  render(<App />);
});
