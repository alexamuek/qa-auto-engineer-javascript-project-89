import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { debug } from 'vitest-preview'

import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.js'
import { onlyWidget } from './pages.js'
import { checkVisible, checkButtonsOfStep, checkMessagesOfStep } from './helpers.js'

const scrollIntoViewMock = vi.fn()
const widgetButtonName = 'Открыть Чат'
const closeButtonName = 'Close'

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
})

afterEach(() => {
  cleanup()
})

test('positive test - initialize', async () => {
  // init - start
  render(Widget(steps))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const [step0] = steps.filter(item => item.id == 'welcome')
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  // check: after clicking messages appeared
  await checkMessagesOfStep(step0)
  // check: after clicking elements appeared with role Button
  await checkButtonsOfStep(step0, widget)
  debug()
})

test('positive test - close dialog', async () => {
  // init - start
  render(Widget(steps))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const [step0] = steps.filter(item => item.id == 'welcome')
  await widget.closeWidget(screen, user, closeButtonName)
  const buttons = await screen.queryAllByText(step0.buttons[0].text)
  await waitFor(() => {
    expect(buttons).toHaveLength(0)
  })
})

test('positive test - several steps', async () => {
  // init - start
  render(Widget(steps))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const [step0] = steps.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)
  const paragraphs = await screen.findAllByText(step0.buttons[0].text)
  await waitFor(() => {
    // check: button was replaced by text message after click
    expect(paragraphs).toHaveLength(1)
    expect(paragraphs[0].tagName).toBe('P')
  })
  const [step1] = steps.filter(item => item.id == step0.buttons[0].nextStepId)
  // check: after clicking elements appeared with role Button
  await checkButtonsOfStep(step1, widget)
  const scrollCount = scrollIntoViewMock.mock.calls.length
  const [advansedButtonDescr] = step1.buttons.filter(item => item.nextStepId == 'advanced')
  await widget.clickButton(screen, user, advansedButtonDescr.text)
  const [step2] = steps.filter(item => item.id == 'advanced')
  await waitFor(() => {
    // check: scroll was used
    expect(scrollIntoViewMock.mock.calls.length).toBe(scrollCount + 1)
  })
  // check: after clicking messages appeared with role Button
  await checkMessagesOfStep(step2)
  // check: after clicking elements appeared with role Button
  await checkButtonsOfStep(step2, widget)
})

test('positive test - scroll', async () => {
  // init - start
  render(Widget(steps))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const [step0] = steps.filter(item => item.id == 'welcome')
  await widget.clickButton(screen, user, step0.buttons[0].text)
  const [step1] = steps.filter(item => item.id == step0.buttons[0].nextStepId)
  const [advansedButtonDescr] = step1.buttons.filter(item => item.nextStepId == 'advanced')
  await widget.clickButton(screen, user, advansedButtonDescr.text)
  // find div of widget window
  const div1 = await screen.findByText('Виртуальный помощник')
  const div2 = div1.parentElement
  const modalBody = div2.nextElementSibling
  fireEvent.scroll(modalBody, { target: { scrollTop: 100 } })
  await waitFor(() => {
    expect(modalBody.scrollTop).toBe(100)
  })
})

test('positive test - focus on button', async () => {
  // init - start
  render(Widget(steps))
  const user = userEvent.setup()
  const widget = new onlyWidget()
  await widget.openWidget(screen, user, widgetButtonName)
  // init - finish
  const [step0] = steps.filter(item => item.id == 'welcome')
  const startButton = await widget.findButton(screen, step0.buttons[0].text)
  const mockHover = vi.fn()
  startButton.onmouseenter = mockHover
  await user.hover(startButton)
  await waitFor(() => {
    expect(mockHover).toHaveBeenCalledTimes(1)
  })
})
