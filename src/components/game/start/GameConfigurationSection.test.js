/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameConfigurationSection from './GameConfigurationSection.js';
import {ConfigService} from '../../../service/ConfigService.js'
const configService = new ConfigService();
configService.reset();


test('render given basic state hides all subsections and displays right text', () => {
  render(<GameConfigurationSection configService={configService}/>);
  // expect(true).toBe(false);
});
