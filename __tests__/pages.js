const backButtonName = 'Назад'

export class onlyWidget {
  constructor() {}

  async findButton(screen, label) {
    const button = await screen.findByRole('button', { name: label })
    return button
  }

  async clickButton(screen, user, label) {
    const button = await this.findButton(screen, label)
    await user.click(button)
  }

  async openWidget(screen, user, widgetButtonName) {
    const button = await screen.findByRole('button', { name: widgetButtonName })
    await user.click(button)
  }

  async closeWidget(screen, user, closeButtonName) {
    const button = await screen.findByRole('button', { name: closeButtonName })
    await user.click(button)
  }
}

export class InputForm extends onlyWidget {
  constructor() {
    super()
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
    await user.selectOptions(el, value)
    return el
  }

  async clickCheckbox(screen, user, label) {
    const el = await screen.findByRole('checkbox', { name: label })
    await user.click(el)
    return el
  }
}

export class ResultPage extends onlyWidget {
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
