import { expect } from 'vitest'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import * as constants from '../utils/constants'
import steps from '../../__fixtures__/steps'

export class WidgetWindow {
  static renderWidget(widgetSteps) {
    render(Widget(widgetSteps))
  }

  static get startButton() {
    return screen.getByText(constants.startButtonText)
  }

  static get closeButton() {
    return screen.queryByRole('button', { name: constants.closeButtonLabel })
  }

  static get startConversationButton() {
    return screen.queryByRole('button', { name: constants.startConversationLabel })
  }

  static get wantToAdvancedButton() {
    return screen.queryByRole('button', { name: constants.advancedButtonLabel })
  }

  static get dialog() {
    return screen.getByRole('dialog')
  }

  static get modalTitle() {
    return screen.queryByText(constants.modalTitleText)
  }

  static findButton(buttonName) {
    return screen.getByRole('button', { name: buttonName })
  }

  static findAllByText(label) {
    return screen.queryAllByText(label)
  }

  static openWidget() {
    fireEvent.click(this.startButton)
  }

  static async clickButton(button) {
    await fireEvent.click(button)
  }

  static waitForModalToClose() {
    return waitFor(() => {
      expect(this.modalTitle).not.toBeInTheDocument()
    })
  }

  static checkVisible(el) {
    expect(el).toBeVisible()
    expect(el).toBeInTheDocument()
  }

  static waitForButtonsOfStep(step) {
    step.buttons.forEach((button) => {
      const buttonEl = screen.getByRole('button', { name: button.text })
      this.checkVisible(buttonEl)
    })
  }

  static waitForMessagesOfStep(step) {
    step.messages.forEach((message) => {
      expect(document.body).toHaveTextContent(message)
    })
  }

  static expectModalTitle() {
    expect(this.modalTitle).toBeInTheDocument()
  }

  static expectTextInsteadOfButton() {
    const paragraph = screen.getByText(constants.startConversationLabel)
    expect(paragraph.tagName).toBe('P')
    expect(paragraph).toBeVisible()
  }

  static closeWidget() {
    fireEvent.click(this.closeButton)
  }

  static startConversation() {
    fireEvent.click(this.startConversationButton)
  }

  static wantToAdvancedClick() {
    fireEvent.click(this.wantToAdvancedButton)
  }

  static scroll(el, targetValue) {
    fireEvent.scroll(el, { target: { scrollTop: targetValue } })
  }

  static async hover(el) {
    const user = userEvent.setup()
    await user.hover(el)
  }

  static waitForWelcomeContent() {
    const [welcomeStep] = steps.filter(step => step.id == 'welcome')
    this.waitForMessagesOfStep(welcomeStep)
    this.waitForButtonsOfStep(welcomeStep)
  }

  static waitForStartContent() {
    const [startStep] = steps.filter(step => step.id == 'start')
    this.waitForMessagesOfStep(startStep)
    this.waitForButtonsOfStep(startStep)
  }

  static waitForAdvancedContent() {
    const [advancedStep] = steps.filter(step => step.id == 'advanced')
    this.waitForMessagesOfStep(advancedStep)
    this.waitForButtonsOfStep(advancedStep)
  }

  static checkDialogVisibility() {
    this.checkVisible(this.dialog)
  }

  static checkStartButtonVisibility() {
    this.checkVisible(this.startButton)
  }

  static waitForWelcomeTextHidden() {
    const [welcomeStep] = steps.filter(step => step.id == 'welcome')
    return waitFor(() => {
      expect(screen.queryByText(welcomeStep.messages[0])).not.toBeInTheDocument()
    })
  }
}
