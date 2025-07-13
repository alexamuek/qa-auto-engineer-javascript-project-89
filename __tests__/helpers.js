import { waitFor } from '@testing-library/react'
import { expect } from 'vitest'

const checkVisible = async (el) => {
  // return code
  await waitFor(() => {
    expect(el).toBeVisible()
    expect(el).toBeInTheDocument()
  })
}

const checkButtonsOfStep = async (step, pageObject, screen) => {
  step.buttons.forEach(async (button) => {
    // check: after clicking elements appeared with role Button
    const buttonEl = await screen.findByRole('button', { name: button.text })
    await checkVisible(buttonEl)
  })
}

const checkMessagesOfStep = async (step) => {
  step.messages.forEach(async (message) => {
    await waitFor (() => {
      expect(document.body).toHaveTextContent(message)
    })
  })
}

export { checkVisible, checkButtonsOfStep, checkMessagesOfStep }
