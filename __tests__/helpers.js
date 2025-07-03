import { screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'

const checkVisible = async (el) => {
  // return code
  await waitFor(() => {
    expect(el).toBeVisible()
    expect(el).toBeInTheDocument()
    // expect(el).not.toHaveStyle({ display: 'none' })
  })
}

const checkButtonsOfStep = async (step, pageObject) => {
  step.buttons.forEach(async (button) => {
    // check: after clicking elements appeared with role Button
    const buttonEl = await pageObject.findButton(screen, button.text)
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
