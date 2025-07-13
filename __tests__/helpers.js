import { waitFor } from '@testing-library/react'
import { expect } from 'vitest'

const checkVisible = async (el) => {
  await waitFor(() => {
    expect(el).toBeVisible()
    expect(el).toBeInTheDocument()
  })
}

const checkVisibleSync = (el) => {
  expect(el).toBeVisible()
  expect(el).toBeInTheDocument()
}

const checkButtonsOfStep = async (step, pageObject, screen) => {
  await waitFor (() => {
    step.buttons.forEach(async (button) => {
      // check: after clicking elements appeared with role Button
      const buttonEl = await screen.findByRole('button', { name: button.text })
      checkVisibleSync(buttonEl)
    })
  })
}

const checkMessagesOfStep = (step) => {
  step.messages.forEach((message) => {
    expect(document.body).toHaveTextContent(message)
  })
}

export { checkVisible, checkButtonsOfStep, checkMessagesOfStep, checkVisibleSync }
