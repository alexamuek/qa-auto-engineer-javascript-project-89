import { render } from '@testing-library/react'
import Widget from '@hexlet/chatbot-v2'

export class WidgetWindow {
  constructor() {}

  static renderWidget(steps) {
    render(Widget(steps))
  }

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
    user.click(button)
  }

  async closeWidget(screen, user, closeButtonName) {
    const button = await screen.findByRole('button', { name: closeButtonName })
    await user.click(button)
  }
}
