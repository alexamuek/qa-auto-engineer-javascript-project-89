import { screen, render, fireEvent } from '@testing-library/react'
import { WidgetWindow } from './WidgetWindow.js'
import App from '../../src/App.jsx'
import {
  backButtonLabel,
  labelsAndValues,
  comboboxLabel,
  country,
  checkboxLabel,
  submitButtonName,
} from '../utils/constants'

export class InputForm extends WidgetWindow {
  constructor() {
    super()
  }

  static renderApp() {
    render(<App />)
  }

  static fillInFieldsByLabel() {
    const textFields = labelsAndValues.map((pair) => {
      const field = this.findElByLabel(pair.label)
      fireEvent.change(field, { target: { value: pair.value } })
      return field
    })
    return textFields
  }

  static selectOption() {
    const el = screen.getByRole('combobox', { name: comboboxLabel })
    fireEvent.change(el, { target: { value: country } })
    return el
  }

  static agreeWithTerms() {
    const el = screen.getByRole('checkbox', { name: checkboxLabel })
    fireEvent.click(el)
    return el
  }

  static getSubmitButton() {
    const el = this.findButton(submitButtonName)
    return el
  }

  static registry() {
    const el = this.findButton(submitButtonName)
    fireEvent.click(el)
  }
}

export class ResultPage extends WidgetWindow {
  constructor() {
    super()
  }

  static getResultTable() {
    const cells = screen.getAllByRole('cell')
    return cells
  }

  static backToForm() {
    const backButton = this.findButton(backButtonLabel)
    fireEvent.click(backButton)
  }
}
