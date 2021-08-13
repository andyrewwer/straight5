/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import RulesSection from './RulesSection.js'

test('render given basic state hides all subsections and displays right text', () => {

});
