import { render } from '@testing-library/react'
import { WidgetWindow } from './WidgetWindow.js'
import App from '../../src/App.jsx'

const backButtonName = 'Назад'

export class InputForm extends WidgetWindow {
  constructor() {
    super()
  }

  static renderApp() {
    render(<App />)
  }

  async fillInFieldWithPlaceholder(screen, user, label, value) {
    const el = await screen.findByPlaceholderText(label)
    await user.type(el, value)
    return el
  }

  async fillInFieldWithLabel(screen, user, label, value) {
    const el = await screen.findByLabelText(label)
    await user.type(el, value)
    return el
  }

  async selectOption(screen, user, label, value) {
    const el = await screen.findByRole('combobox', { name: label })
    user.selectOptions(el, value)
    return el
  }

  async clickCheckbox(screen, user, label) {
    const el = await screen.findByRole('checkbox', { name: label })
    await user.click(el)
    return el
  }
}

export class ResultPage extends WidgetWindow {
  constructor() {
    super()
  }

  async getResultTable(screen) {
    const cells = await screen.findAllByRole('cell')
    return cells
  }

  async backToForm(screen, user) {
    const backButton = await this.findButton(screen, backButtonName)
    await user.click(backButton)
  }
}
