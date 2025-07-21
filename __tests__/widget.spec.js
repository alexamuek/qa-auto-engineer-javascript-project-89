import { cleanup } from '@testing-library/react'
import { test, vi, beforeEach, afterEach, describe, expect } from 'vitest'
import { WidgetWindow } from './pages/WidgetWindow.js'
import steps from '../__fixtures__/steps'
import ErrorsSteps from '../__fixtures__/errorsSteps.js'
import * as constants from './utils/constants'

const scrollIntoViewMock = vi.fn()

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock
})

afterEach(() => {
  cleanup()
})

describe('Widget Positive cases', () => {
  test('init state', () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.checkStartButtonVisibility()
  })

  test('open and close widget', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    WidgetWindow.expectModalTitle()
    WidgetWindow.checkDialogVisibility()
    WidgetWindow.waitForWelcomeContent()
    WidgetWindow.closeWidget()
    await WidgetWindow.waitForModalToClose()
    await WidgetWindow.waitForWelcomeTextHidden()
  })

  test('several steps', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    WidgetWindow.startConversation()
    WidgetWindow.expectTextInsteadOfButton()
    WidgetWindow.waitForStartContent()
    const scrollCount = scrollIntoViewMock.mock.calls.length
    WidgetWindow.wantToAdvancedClick()
    expect(scrollIntoViewMock.mock.calls.length).toBe(scrollCount + 1)
    WidgetWindow.waitForAdvancedContent()
  })

  test('scroll', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    WidgetWindow.startConversation()
    WidgetWindow.wantToAdvancedClick()
    const div1 = WidgetWindow.modalTitle
    const div2 = div1.parentElement
    const modalBody = div2.nextElementSibling
    const targetValue = 100
    WidgetWindow.scroll(modalBody, targetValue)
    expect(modalBody.scrollTop).toBe(100)
  })

  test('focus on button', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    const startButton = WidgetWindow.startButton
    expect(startButton.tagName).toBe('BUTTON')
    const mockHover = vi.fn()
    startButton.onmouseenter = mockHover
    await WidgetWindow.hover(startButton)
    expect(mockHover).toHaveBeenCalledTimes(1)
  })
})

describe('Widget Negative cases', async () => {
  test('no message, no button property', async () => {
    const errorSteps = ErrorsSteps.no_message_and_buttons
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.checkDialogVisibility()
    await expect(
      WidgetWindow.clickButton(WidgetWindow.startConversationButton),
    )
      .rejects
      .toThrow()
  })

  test('empty message array, empty button array', async () => {
    const errorSteps = ErrorsSteps.empty_message_and_button_array
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.startConversation()
    WidgetWindow.expectTextInsteadOfButton()
    const [startStep] = errorSteps.filter(item => item.id == constants.startStepId)
    WidgetWindow.waitForMessagesOfStep(startStep)
  })

  test('link to non-existed step Start', async () => {
    const errorSteps = ErrorsSteps.non_existed_step
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.checkDialogVisibility()
    await WidgetWindow.clickButton(WidgetWindow.startConversationButton)
    const startButtonAgain = WidgetWindow.startConversationButton
    WidgetWindow.checkVisible(startButtonAgain)
  })

  test('nextStepId links to itself', async () => {
    const errorSteps = ErrorsSteps.self_linking
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.checkDialogVisibility()
    await WidgetWindow.clickButton(WidgetWindow.findButton(constants.itselfStepId))
    const elements = WidgetWindow.findAllByText(constants.startConversationLabel)
    const validTags = ['P', 'BUTTON']
    elements.forEach((el) => {
      WidgetWindow.checkVisible(el)
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName]),
      )
    })
  })

  test('button object doesn\'t have text property', () => {
    const errorSteps = ErrorsSteps.button_without_text_property
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.checkDialogVisibility()
    const welcomeButton = WidgetWindow.findButton('')
    WidgetWindow.checkVisible(welcomeButton)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    WidgetWindow.waitForMessagesOfStep(welcomeStep)
  })

  test('button object doesn\'t have nextStepId property', async () => {
    const errorSteps = ErrorsSteps.button_without_nextStepId_property
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.checkDialogVisibility()
    await WidgetWindow.clickButton(WidgetWindow.startConversationButton)
    const elements = WidgetWindow.findAllByText(constants.startConversationLabel)
    const validTags = ['P', 'BUTTON']
    elements.forEach((el) => {
      WidgetWindow.checkVisible(el)
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName]),
      )
    })
  })

  test('button object doesn\'t have Type property', async () => {
    const errorSteps = ErrorsSteps.button_without_type_property
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.checkDialogVisibility()
    await WidgetWindow.clickButton(WidgetWindow.startConversationButton)
    const [startStep] = errorSteps.filter(item => item.id == constants.startStepId)
    WidgetWindow.waitForButtonsOfStep(startStep)
  })

  test('wrong type of button', async () => {
    const errorSteps = ErrorsSteps.wrong_button_type
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.checkDialogVisibility()
    await WidgetWindow.clickButton(WidgetWindow.startConversationButton)
    const [startStep] = errorSteps.filter(item => item.id == constants.startStepId)
    WidgetWindow.waitForButtonsOfStep(startStep)
  })

  test('next step doesn\'t have id', async () => {
    const errorSteps = ErrorsSteps.next_step_without_id
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    WidgetWindow.checkDialogVisibility()
    await WidgetWindow.clickButton(WidgetWindow.startConversationButton)
    const elements = WidgetWindow.findAllByText(constants.startConversationLabel)
    const validTags = ['P', 'BUTTON']
    elements.forEach((el) => {
      WidgetWindow.checkVisible(el)
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName]),
      )
    })
  })
})
