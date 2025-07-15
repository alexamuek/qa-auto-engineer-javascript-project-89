import { expect } from 'vitest'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import { startButtonText, closeButtonLabel, modalTitleText } from '../utils/constants'

export class WidgetWindow {
  static renderWidget(steps) {
    render(Widget(steps))
  }

  static get startButton() {
    return screen.getByText(startButtonText)
  }

  static get closeButton() {
    return screen.queryByRole('button', { name: closeButtonLabel })
  }

  static dialog() {
    return screen.getByRole('dialog')
  }

  static findAllElByLabel(label) {
    return screen.queryAllByText(label)
  }

  static findElByLabel(label) {
    return screen.getByLabelText(label)
  }

  static findElByText(label) {
    return screen.queryByText(label)
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

  static async clickButton(buttonName) {
    await fireEvent.click(this.findButton(buttonName))
  }

  static waitForModalToClose() {
    return waitFor(() => {
      expect(screen.queryByText(modalTitleText)).not.toBeInTheDocument()
    })
  }

  static checkVisible(el) {
    expect(el).toBeVisible()
    expect(el).toBeInTheDocument()
  }

  static waitForButtonsOfStep(step) {
    step.buttons.forEach((button) => {
      // check: after clicking elements appeared with role Button
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
    expect(screen.queryByText(modalTitleText)).toBeInTheDocument()
  }

  static closeWidget() {
    fireEvent.click(this.closeButton)
  }

  static scroll(el, targetValue) {
    fireEvent.scroll(el, { target: { scrollTop: targetValue } })
  }

  static async hover(el) {
    const user = userEvent.setup()
    await user.hover(el)
  }
}
