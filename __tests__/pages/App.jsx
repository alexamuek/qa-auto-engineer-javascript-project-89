import { screen, render, fireEvent } from '@testing-library/react'
import { expect } from 'vitest'
import App from '../../src/App.jsx'
import steps from '../../__fixtures__/steps.js'
import * as constants from '../utils/constants'
import { getValue } from '../helpers.js'

export class AppPage {
  static renderApp() {
    render(<App />)
  }

  static get startButton() {
    return screen.getByText(constants.startButtonText)
  }

  static get closeButton() {
    return screen.queryByRole('button', { name: constants.closeButtonLabel })
  }

  static get submitButton() {
    return screen.queryByRole('button', { name: constants.submitButtonLabel })
  }

  static get backButton() {
    return screen.queryByRole('button', { name: constants.backButtonLabel })
  }

  static openWidget() {
    fireEvent.click(this.startButton)
  }

  static closeWidget() {
    fireEvent.click(this.closeButton)
  }

  static backToForm() {
    fireEvent.click(this.backButton)
  }

  static registry() {
    fireEvent.click(this.submitButton)
  }

  static fillOutFieldsByLabel() {
    constants.labelsAndValues.map((pair) => {
      const field = screen.getByLabelText(pair.label)
      fireEvent.change(field, { target: { value: pair.value } })
    })
  }

  static selectOption() {
    const el = screen.getByRole('combobox', { name: constants.comboboxLabel })
    fireEvent.change(el, { target: { value: constants.country } })
  }

  static agreeWithTerms() {
    const el = screen.getByRole('checkbox', { name: constants.checkboxLabel })
    fireEvent.click(el)
  }

  static fillOutForm() {
    this.fillOutFieldsByLabel()
    this.selectOption()
    this.agreeWithTerms()
  }

  static expectModalTitle() {
    expect(screen.queryByText(constants.modalTitleText)).toBeInTheDocument()
  }

  static expectDialog() {
    expect(screen.getByRole('dialog')).toBeVisible()
  }

  static notFoundBackButton() {
    const els = screen.queryAllByRole('button', { name: constants.backButtonLabel })
    expect(els).toHaveLength(0)
  }

  static waitForButtonsOfWelcomeStep() {
    const [welcomeStep] = steps.filter(step => step.id = 'welcome')
    welcomeStep.buttons.forEach((button) => {
      const buttonEl = screen.getByRole('button', { name: button.text })
      expect(buttonEl).toBeVisible()
    })
  }

  static waitForMessagesOfWelcomeStep() {
    const [welcomeStep] = steps.filter(step => step.id = 'welcome')
    welcomeStep.messages.forEach((message) => {
      expect(document.body).toHaveTextContent(message)
    })
  }

  static waitForWidgetContent() {
    this.expectModalTitle()
    this.expectDialog()
    this.waitForButtonsOfWelcomeStep()
    this.waitForMessagesOfWelcomeStep()
  }

  static waitForDataInForm() {
    const countrySelect = screen.getByRole('combobox', { name: constants.comboboxLabel })
    const checkbox = screen.getByRole('checkbox', { name: constants.checkboxLabel })
    const textFields = constants.labelsAndValues.map(pair => screen.getByLabelText(pair.label))
    textFields.forEach((field) => {
      expect(field).toHaveValue(getValue(field.labels[0].textContent, constants.labelsAndValues))
    })
    expect(countrySelect).toHaveValue(constants.country)
    expect(checkbox).toBeChecked()
  }

  static waitForResultTable() {
    const resultCells = screen.getAllByRole('cell')
    resultCells.forEach((cell) => {
      expect(cell).toBeVisible()
    })
    const values = constants.labelsAndValues.map(pair => pair.value)
    const labels = constants.labelsAndValues.map(pair => pair.label)
    const actualTableValues = resultCells.map(item => item.textContent)
    const expectTableValues = [...values, constants.country, 'true', constants.checkboxLabel, constants.comboboxLabel, ...labels]
    expect(actualTableValues).toEqual(expect.arrayContaining(expectTableValues))
    expect(expectTableValues).toEqual(expect.arrayContaining(actualTableValues))
  }

  static waitForForm() {
    const countrySelect = screen.getByRole('combobox', { name: constants.comboboxLabel })
    const checkbox = screen.getByRole('checkbox', { name: constants.checkboxLabel })
    const textFields = constants.labelsAndValues.map(pair => screen.getByLabelText(pair.label))
    textFields.forEach((field) => {
      expect(field).toBeVisible()
    })
    expect(countrySelect).toBeVisible()
    expect(checkbox).toBeVisible()
  }

  static waitForWidgetButton() {
    expect(this.startButton).toBeVisible()
  }
}
