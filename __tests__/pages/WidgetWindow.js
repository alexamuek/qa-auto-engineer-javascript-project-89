import { expect } from 'vitest'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Widget from '@hexlet/chatbot-v2'
import * as constants from '../utils/constants'
import steps from '../../__fixtures__/steps.js'

export class WidgetWindow {
  static renderWidget(stepsArray) {
    render(Widget(stepsArray))
  }

  static get startButton() {
    return screen.getByText(constants.startButtonText)
  }

  static get closeButton() {
    return screen.queryByRole('button', { name: constants.closeButtonLabel })
  }

  static dialog() {
    return screen.getByRole('dialog')
  }

  static getModalTitleEl() {
    return screen.queryByText(constants.modalTitleText)  
  } 
  
  static expectModalTitle() {
    const el = this.getModalTitleEl()
    expect(el).toBeInTheDocument()
  }

  static expectDialog() {
    expect(screen.getByRole('dialog')).toBeVisible()
  }

  static waitForButtonsforStep(nameStep) {
    const [step] = steps.filter(step => step.id = nameStep)
    step.buttons.forEach((button) => {
      const buttonEl = screen.getByRole('button', { name: button.text })
      expect(buttonEl).toBeVisible()
    })
  }

  static waitForMessagesforStep(nameStep) {
    const [step] = steps.filter(step => step.id = nameStep)
    step.messages.forEach((message) => {
      expect(document.body).toHaveTextContent(message)
    })
  }

  static waitForStartContent() {
    this.expectModalTitle()
    this.expectDialog()
    this.waitForButtonsforStep('welcome')
    this.waitForMessagesforStep('welcome')
  }

  static waitForAdvancedStepContent() {
    this.waitForButtonsforStep('advanced')
    this.waitForMessagesforStep('advanced')
  }

  static notFoundWelcomeStepContent() {
    const [welcomeStep] = steps.filter(step => step.id = 'welcome')
    welcomeStep.buttons.forEach((button) => {
      const buttonEls = screen.queryAllByText(button.text)
      expect(buttonEls).toHaveLength(0)
    })
    welcomeStep.messages.forEach((message) => {
      expect(document.body).not.toHaveTextContent(message)
    })
  }

  static waitForParagraph() {
    const paragraph = screen.queryByText(constants.startConversationLabel)
    expect(paragraph.tagName).toBe('P')  
  }

  static waitForModalToClose() {
    return waitFor(() => {
      expect(screen.queryByText(constants.modalTitleText)).not.toBeInTheDocument()
    })
  }
  
  static findButton(buttonName) {
    return screen.getByRole('button', { name: buttonName })
  }

  static async clickButton(buttonName) {
    await fireEvent.click(this.findButton(buttonName))
  }

  static startConversation() {
    const button = screen.getByRole('button', { name: constants.startConversationLabel })
    fireEvent.click(button)
  }

  static openWidget() {
    fireEvent.click(this.startButton)
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





  /*static findAllElByLabel(label) {
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

  

  static async clickButton(buttonName) {
    await fireEvent.click(this.findButton(buttonName))
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
  }*/

  
}
