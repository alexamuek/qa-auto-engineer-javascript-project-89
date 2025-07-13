import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { debug } from 'vitest-preview'

import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.js'
import { WidgetWindow } from './pages/WidgetWindow.js'
import { checkVisible, checkButtonsOfStep, checkMessagesOfStep } from './helpers.js'

import Steps1 from '../__fixtures__/errorSteps1.js'
import Steps2 from '../__fixtures__/errorSteps2.js'
import Steps3 from '../__fixtures__/errorSteps3.js'
import Steps4 from '../__fixtures__/errorSteps4.js'
import Steps5 from '../__fixtures__/errorSteps5.js'
import Steps6 from '../__fixtures__/errorSteps6.js'
import Steps7 from '../__fixtures__/errorSteps7.js'
import Steps8 from '../__fixtures__/errorSteps8.js'
import Steps9 from '../__fixtures__/errorSteps9.js'

const scrollIntoViewMock = vi.fn()
const widgetButtonName = 'Открыть Чат'
const closeButtonName = 'Close'

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
})

afterEach(() => {
  cleanup()
})

/* eslint-disable no-undef */
describe('Widget pass cases', () => {
  test('positive test - initialize', async () => {
    // init - start
    render(Widget(steps))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    // check: after clicking messages appeared
    await checkMessagesOfStep(welcomeStep)
    // check: after clicking elements appeared with role Button
    await checkButtonsOfStep(welcomeStep, widget, screen)
  })

  test('positive test - close dialog', async () => {
    // init - start
    render(Widget(steps))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    await widget.closeWidget(screen, user, closeButtonName)
    const buttons = await screen.queryAllByText(welcomeStep.buttons[0].text)
    await waitFor(() => {
      expect(buttons).toHaveLength(0)
    })
  })

  test('positive test - several steps', async () => {
    // init - start
    render(Widget(steps))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)
    const paragraphs = await screen.findAllByText(welcomeStep.buttons[0].text)
    await waitFor(() => {
      // check: button was replaced by text message after click
      expect(paragraphs).toHaveLength(1)
      expect(paragraphs[0].tagName).toBe('P')
    })
    const [startStep] = steps.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    // check: after clicking elements appeared with role Button
    await checkButtonsOfStep(startStep, widget, screen)
    const scrollCount = scrollIntoViewMock.mock.calls.length
    const [advansedButtonDescr] = startStep.buttons.filter(item => item.nextStepId == 'advanced')
    await widget.clickButton(screen, user, advansedButtonDescr.text)
    const [advansedStep] = steps.filter(item => item.id == 'advanced')
    await waitFor(() => {
      // check: scroll was used
      expect(scrollIntoViewMock.mock.calls.length).toBe(scrollCount + 1)
    })
    // check: after clicking messages appeared with role Button
    await checkMessagesOfStep(advansedStep)
    // check: after clicking elements appeared with role Button
    await checkButtonsOfStep(advansedStep, widget, screen)
  })

  test('positive test - scroll', async () => {
    // init - start
    render(Widget(steps))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)
    const [startStep] = steps.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    const [advansedButtonDescr] = startStep.buttons.filter(item => item.nextStepId == 'advanced')
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
    const widget = new WidgetWindow()
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
})

/* eslint-disable no-undef */
describe('Widget errors cases', () => {
  test('1 - negative test - no message, no button property', async () => {
    // init - start
    render(Widget(Steps1))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const [welcomeStep] = Steps1.filter(item => item.id == 'welcome')
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    await expect(
      widget.clickButton(screen, user, welcomeStep.buttons[0].text),
    )
      .rejects
      .toThrow()
  })

  test('2 - negative test - empty message array, empty button array', async () => {
    // init - start
    render(Widget(Steps2))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    const [welcomeStep] = Steps2.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)
    const paragraphs = await screen.findAllByText(welcomeStep.buttons[0].text)
    const [startStep] = Steps2.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    await waitFor(() => {
      // check: button was replaced by text message after click
      expect(paragraphs).toHaveLength(1)
      expect(paragraphs[0].tagName).toBe('P')
    })
    startStep.messages.forEach(async (message) => {
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
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    const [welcomeStep] = Steps3.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)
    const startButtonAgain = await screen.findByRole('button', { name: welcomeStep.buttons[0].text })
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
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    const [welcomeStep] = Steps4.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)
    const elements = await screen.findAllByText(welcomeStep.buttons[0].text)
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
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    const welcomeButton = await widget.findButton(screen, '')
    await checkVisible(welcomeButton)
    const [welcomeStep] = Steps5.filter(item => item.id == 'welcome')
    welcomeStep.messages.forEach(async (message) => {
      const pEl = await screen.findByText(message)
      // check
      await waitFor(() => {
        // check: after clicking message appeared
        expect(document.body).toHaveTextContent(message)
        expect(pEl.tagName).toBe('P')
      })
    })
  })

  test('6 - negative test - button object doesn\'t have nextStepId property', async () => {
    // init - start
    render(Widget(Steps6))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    const [welcomeStep] = Steps6.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)
    const elements = await screen.findAllByText(welcomeStep.buttons[0].text)
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
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    const [welcomeStep] = Steps7.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)
    const [startStep] = Steps7.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    startStep.buttons.forEach(async (button) => {
      // check: after clicking elements appeared with role Button
      const buttonEl = await widget.findButton(screen, button.text)
      await checkVisible(buttonEl)
    })
  })

  test('8 - negative test - wrong type of button', async () => {
    // init - start
    render(Widget(Steps8))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    const [welcomeStep] = Steps8.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)
    const [startStep] = Steps8.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    startStep.buttons.forEach(async (button) => {
      // check: after clicking elements appeared with role Button
      const buttonEl = await widget.findButton(screen, button.text)
      await checkVisible(buttonEl)
    })
  })

  test('9 - negative test - next step doesn\'t have id', async () => {
    // init - start
    render(Widget(Steps9))
    const user = userEvent.setup()
    const widget = new WidgetWindow()
    await widget.openWidget(screen, user, widgetButtonName)
    // init - finish
    const dialog = await screen.findByRole('dialog')
    await checkVisible(dialog)
    const [welcomeStep] = Steps9.filter(item => item.id == 'welcome')
    await widget.clickButton(screen, user, welcomeStep.buttons[0].text)

    const elements = await screen.findAllByText(welcomeStep.buttons[0].text)
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
})
