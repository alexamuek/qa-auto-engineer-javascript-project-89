import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect } from "vitest";

import Widget from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/steps.js';
import '@hexlet/chatbot-v2/styles';


test('positive test - initialize', async () => {
  render(Widget(steps))
  screen.debug()
  const button = screen.getByRole('button', { name: 'Открыть Чат' })
  expect(true).toBeTruthy();
  expect(button).toBeVisible();
  expect(button).toBeInTheDocument(); 
  expect(button).not.toHaveStyle({ display: 'none' });
})
