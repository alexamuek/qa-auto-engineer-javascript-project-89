import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
// import { debug } from 'vitest-preview'

import Widget from '@hexlet/chatbot-v2'

import Steps1 from '../__fixtures__/errorSteps1.js'
import Steps2 from '../__fixtures__/errorSteps2.js'
import Steps3 from '../__fixtures__/errorSteps3.js'
import Steps4 from '../__fixtures__/errorSteps4.js'
import Steps5 from '../__fixtures__/errorSteps5.js'
import Steps6 from '../__fixtures__/errorSteps6.js'
import Steps7 from '../__fixtures__/errorSteps7.js'
import Steps8 from '../__fixtures__/errorSteps8.js'
import Steps9 from '../__fixtures__/errorSteps9.js'

import { onlyWidget } from './pages.js'
import { checkVisible } from './helpers.js'

const scrollIntoViewMock = vi.fn()
const widgetButtonName = 'Открыть Чат'

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
})

afterEach(() => {
  cleanup()
})

test('1 - negative test - no message, no button property', async () => {
  // init - start
  render(Widget(Steps1))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const [step0] = Steps1.filter(item => item.id == 'welcome')
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  await expect(
    widget.clickButton(screen, user, step0.buttons[0].text),
  )
    .rejects
    .toThrow()
})

test('2 - negative test - empty message array, empty button array', async () => {
  // init - start
  render(Widget(Steps2))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  const [step0] = Steps2.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)
  const paragraphs = await screen.findAllByText(step0.buttons[0].text)
  const [step1] = Steps2.filter(item => item.id == step0.buttons[0].nextStepId)
  await waitFor(() => {
    // check: button was replaced by text message after click
    expect(paragraphs).toHaveLength(1)
    expect(paragraphs[0].tagName).toBe('P')
  })
  step1.messages.forEach(async (message) => {
    const pEl = await screen.findByText(message)
    // check
    await waitFor(() => {
      // check: after clicking message appeared
      expect(document.body).toHaveTextContent(message)
      expect(pEl.tagName).toBe('P')
    })
  })
})

test('3 - negative test - link to non-existed step Start', async () => {
  // init - start
  render(Widget(Steps3))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  const [step0] = Steps3.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)
  const startButtonAgain = await screen.findByRole('button', { name: step0.buttons[0].text })
  await waitFor(() => {
    expect(startButtonAgain).toBeVisible()
    expect(startButtonAgain).toBeInTheDocument()
    expect(startButtonAgain).not.toHaveStyle({ display: 'none' })
  })
})

test('4 - negative test - nextStepId links to itself', async () => {
  // init - start
  render(Widget(Steps4))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  const [step0] = Steps4.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)
  const elements = await screen.findAllByText(step0.buttons[0].text)
  const validTags = ['P', 'BUTTON']
  elements.forEach(async (el) => {
    await checkVisible(el)
    await waitFor(() => {
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName]),
      )
    })
  })
})

test('5 - negative test - button object doesn\'t have text property', async () => {
  // init - start
  render(Widget(Steps5))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  const welcomeButton = await widget.findButton(screen, '')
  await checkVisible(welcomeButton)
  const [step0] = Steps5.filter(item => item.id == 'welcome')
  step0.messages.forEach(async (message) => {
    const pEl = await screen.findByText(message)
    // check
    await waitFor(() => {
      // check: after clicking message appeared
      expect(document.body).toHaveTextContent(message)
      expect(pEl.tagName).toBe('P')
    })
  })
  // debug()
  // screen.debug()
})

test('6 - negative test - button object doesn\'t have nextStepId property', async () => {
  // init - start
  render(Widget(Steps6))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  const [step0] = Steps6.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)
  const elements = await screen.findAllByText(step0.buttons[0].text)
  const validTags = ['P', 'BUTTON']
  elements.forEach(async (el) => {
    await checkVisible(el)
    await waitFor(() => {
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName]),
      )
    })
  })
})

test('7 - negative test - button object doesn\'t have Type property', async () => {
  // init - start
  render(Widget(Steps7))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  const [step0] = Steps7.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)
  const [step1] = Steps7.filter(item => item.id == step0.buttons[0].nextStepId)
  step1.buttons.forEach(async (button) => {
    // check: after clicking elements appeared with role Button
    const buttonEl = await widget.findButton(screen, button.text)
    await checkVisible(buttonEl)
  })
})

test('8 - negative test - wrong type of button', async () => {
  // init - start
  render(Widget(Steps8))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  const [step0] = Steps8.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)
  const [step1] = Steps8.filter(item => item.id == step0.buttons[0].nextStepId)
  step1.buttons.forEach(async (button) => {
    // check: after clicking elements appeared with role Button
    const buttonEl = await widget.findButton(screen, button.text)
    await checkVisible(buttonEl)
  })
})

test('9 - negative test - next step doesn\'t have id', async () => {
  // init - start
  render(Widget(Steps9))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  const [step0] = Steps9.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)

  const elements = await screen.findAllByText(step0.buttons[0].text)
  const validTags = ['P', 'BUTTON']
  elements.forEach(async (el) => {
    await checkVisible(el)
    await waitFor(() => {
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName]),
      )
    })
  })
})
