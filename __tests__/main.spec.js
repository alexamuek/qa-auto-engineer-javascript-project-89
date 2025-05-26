import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, afterEach, vi } from "vitest"
import { debug } from 'vitest-preview';

import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.js'
import '@hexlet/chatbot-v2/styles'

let startButton

beforeEach(async () => {
  //window.HTMLElement.prototype.scrollIntoView = vi.fn() // Мокаем метод

  render(Widget(steps))
  startButton = screen.getByRole('button', { name: 'Открыть Чат' })
  expect(true).toBeTruthy()
  expect(startButton).toBeVisible()
  expect(startButton).toBeInTheDocument() 
  expect(startButton).not.toHaveStyle({ display: 'none' })
})

afterEach(() => {
  document.body.innerHTML = '' // Грубая очистка всего body
})

test('positive test - initialize', async () => {
  const user = userEvent.setup()
  await user.click(startButton)
  const [welcomeObj, ] = steps.filter((item) => item.id == 'welcome')
  expect(document.body).toHaveTextContent(welcomeObj.messages[0])
  const nextButton = screen.getByRole('button', { name: welcomeObj.buttons[0].text })
  expect(nextButton).toBeVisible()
  expect(nextButton).toBeInTheDocument() 
  expect(nextButton).not.toHaveStyle({ display: 'none' })
  //screen.debug()  
})

test('positive test - close dialog', async () => {
  const user = userEvent.setup()
  await user.click(startButton)
  const [welcomeObj, ] = steps.filter((item) => item.id == 'welcome')
  expect(document.body).toHaveTextContent(welcomeObj.messages[0])
  const nextButton = screen.getByRole('button', { name: welcomeObj.buttons[0].text })
  const closeButton = screen.getByRole('button', { name: 'Close' })
  expect(closeButton).toBeVisible()
  await user.click(closeButton)
  const buttons = screen.queryAllByText('welcomeObj.buttons[0].text')
  expect(buttons).toHaveLength(0)
  // screen.debug() 
})

test('positive test - several steps', async () => {
  const user = userEvent.setup()
  await user.click(startButton)
  const [welcomeObj, ] = steps.filter((item) => item.id == 'welcome')
  expect(document.body).toHaveTextContent(welcomeObj.messages[0])
  const nextButton = screen.getByRole('button', { name: welcomeObj.buttons[0].text })
  await user.click(nextButton)
  const [startObj, ] = steps.filter((item) => item.id == welcomeObj.buttons[0].nextStepId)
  const advancedButton = screen.getByRole('button', { name: startObj.buttons[2].text })
  await user.click(advancedButton)
  //debug();
  //screen.debug(undefined, { maxDepth: 10, maxLength: 10000 }) 
})
