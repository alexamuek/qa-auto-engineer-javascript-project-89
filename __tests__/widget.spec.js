import { cleanup } from '@testing-library/react'
import { test, vi, beforeEach, afterEach, describe, expect } from 'vitest'
import { WidgetWindow } from './pages/WidgetWindow.js'
import steps from '../__fixtures__/steps'
import { modalTitleText } from './utils/constants'
import ErrorsSteps from '../__fixtures__/errorsSteps.js'
import { debug } from 'vitest-preview'

const scrollIntoViewMock = vi.fn()

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock
})

afterEach(() => {
  cleanup()
})

describe('Widget Positive cases', () => {
  test('initialize', () => {
    WidgetWindow.renderWidget(steps)
    expect(WidgetWindow.startButton).toBeVisible()
  })

  test('open and close widget', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    WidgetWindow.waitForStartContent()
    WidgetWindow.closeWidget()
    await WidgetWindow.waitForModalToClose()
    WidgetWindow.notFoundWelcomeStepContent()
  })

  test('several steps', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    await WidgetWindow.clickButton('Начать разговор')
    //await WidgetWindow.startConversation()
    debug()
    //WidgetWindow.startConversation()
    
    //await new Promise(resolve => setTimeout(resolve, 1000));
    
    /*await WidgetWindow.waitForParagraph()
    const scrollCount = scrollIntoViewMock.mock.calls.length
    WidgetWindow.wantToAdvanced()
    expect(scrollIntoViewMock.mock.calls.length).toBe(scrollCount + 1)
    WidgetWindow.waitForAdvancedStepContent()*/
  })

  /*test('scroll', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    debug()
    //WidgetWindow.startConversation()
    //WidgetWindow.wantToAdvanced()

    /*const div1 = WidgetWindow.getModalTitleEl()
    const div2 = div1.parentElement
    const modalBody = div2.nextElementSibling
    const targetValue = 100
    WidgetWindow.scroll(modalBody, targetValue)
    expect(modalBody.scrollTop).toBe(targetValue)
  })*/

  /*test('focus on button', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    const startButton = WidgetWindow.findButton(welcomeStep.buttons[0].text)
    expect(startButton.tagName).toBe('BUTTON')
    const mockHover = vi.fn()
    startButton.onmouseenter = mockHover
    await WidgetWindow.hover(startButton)
    expect(mockHover).toHaveBeenCalledTimes(1)
  })*/
})

/*describe('Widget Negative cases', async () => {
  test('no message, no button property', async () => {
    const errorSteps = ErrorsSteps.no_message_and_buttons
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    welcomeStep.buttons[0].text
    await expect(
      WidgetWindow.clickButton(welcomeStep.buttons[0].text),
    )
      .rejects
      .toThrow()
  })

  test('empty message array, empty button array', async () => {
    // init - start
    const errorSteps = ErrorsSteps.empty_message_and_button_array
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    await WidgetWindow.clickButton(welcomeStep.buttons[0].text)
    const paragraph = WidgetWindow.findElByText(welcomeStep.buttons[0].text)
    expect(paragraph.tagName).toBe('P')
    const [startStep] = errorSteps.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    WidgetWindow.waitForMessagesOfStep(startStep)
  })

  test('link to non-existed step Start', async () => {
    const errorSteps = ErrorsSteps.non_existed_step
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    await WidgetWindow.clickButton(welcomeStep.buttons[0].text)
    const startButtonAgain = WidgetWindow.findButton(welcomeStep.buttons[0].text)
    expect(startButtonAgain).toBeVisible()
    expect(startButtonAgain).toBeInTheDocument()
    expect(startButtonAgain).not.toHaveStyle({ display: 'none' })
  })

  test('nextStepId links to itself', async () => {
    const errorSteps = ErrorsSteps.self_linking
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    await WidgetWindow.clickButton(welcomeStep.buttons[0].text)
    const elements = WidgetWindow.findAllByText(welcomeStep.buttons[0].text)
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
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    const welcomeButton = WidgetWindow.findButton('')
    WidgetWindow.checkVisible(welcomeButton)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    WidgetWindow.waitForMessagesOfStep(welcomeStep)
  })

  test('button object doesn\'t have nextStepId property', async () => {
    const errorSteps = ErrorsSteps.button_without_nextStepId_property
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    await WidgetWindow.clickButton(welcomeStep.buttons[0].text)
    const elements = WidgetWindow.findAllByText(welcomeStep.buttons[0].text)
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
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    await WidgetWindow.clickButton(welcomeStep.buttons[0].text)
    const [startStep] = errorSteps.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    WidgetWindow.waitForButtonsOfStep(startStep)
  })

  test('wrong type of button', async () => {
    const errorSteps = ErrorsSteps.wrong_button_type
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    await WidgetWindow.clickButton(welcomeStep.buttons[0].text)
    const [startStep] = errorSteps.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    WidgetWindow.waitForButtonsOfStep(startStep)
  })

  test('next step doesn\'t have id', async () => {
    const errorSteps = ErrorsSteps.next_step_without_id
    WidgetWindow.renderWidget(errorSteps)
    WidgetWindow.openWidget()
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    const [welcomeStep] = errorSteps.filter(item => item.id == 'welcome')
    await WidgetWindow.clickButton(welcomeStep.buttons[0].text)
    const elements = WidgetWindow.findAllByText(welcomeStep.buttons[0].text)
    const validTags = ['P', 'BUTTON']
    elements.forEach((el) => {
      WidgetWindow.checkVisible(el)
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName]),
      )
    })
  })
})*/
