import { waitFor, fireEvent } from '@testing-library/react'
//import userEvent from '@testing-library/user-event'
import { test, expect, vi } from "vitest"
import { debug } from 'vitest-preview';

export class StartPage {
  /*constructor(screen, user) {
    this.screen = screen
    this.user = user
  }*/
  constructor() {}
    

  async findButton(screen, label) {
    const button = await screen.findByRole('button', {name: label})  
    return button
  }

  async clickButton(screen, user, label) {
    const button = await this.findButton(screen, label)  
    await user.click(button);
  }

  async openWidget(screen, user, widgetButtonName) {
    const button = await screen.findByRole('button', {name: widgetButtonName})
    await user.click(button);
  }

  async closeWidget(screen, user, closeButtonName) {
    const button = await screen.findByRole('button', {name: closeButtonName})
    await user.click(button);
  }
}
