import { cleanup, waitFor } from '@testing-library/react'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import steps from '../__fixtures__/steps.js'
import { InputForm, ResultPage } from './pages/App.jsx'
import { country, labelsAndValues, checkboxLabel, comboboxLabel, backButtonLabel } from './utils/constants'
// import { debug } from 'vitest-preview'
import { getValue } from './helpers.js'

const scrollIntoViewMock = vi.fn()

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
})

afterEach(() => {
  cleanup()
})

/* eslint-disable no-undef */
describe('Integrate cases', async () => {
  test('positive test - fill in form, open widget, close widget', async () => {
    InputForm.renderApp()
    const inputs = InputForm.fillInFieldsByLabel()
    const countrySelect = InputForm.selectOption()
    await waitFor(() => {
      expect(countrySelect).toHaveValue('Россия')
    })
    const checkbox = InputForm.agreeWithTerms()
    const submitButton = InputForm.getSubmitButton()
    const formEls = [...inputs, countrySelect, checkbox, submitButton]
    formEls.forEach(async (item) => {
      InputForm.checkVisible(item)
    })
    expect(countrySelect).toHaveValue(country)
    expect(checkbox).toBeChecked()
    InputForm.openWidget()
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    InputForm.expectModalTitle()
    const dialog = InputForm.dialog()
    InputForm.checkVisible(dialog)
    InputForm.waitForMessagesOfStep(welcomeStep)
    const startButton = InputForm.findButton(welcomeStep.buttons[0].text)
    expect(startButton.tagName).toBe('BUTTON')
    InputForm.checkVisible(startButton)
    InputForm.closeWidget()
    await waitFor(() => {
      expect(InputForm.findAllElByLabel(welcomeStep.buttons[0].text)).toHaveLength(0)
    })
    expect(dialog).not.toBeInTheDocument()
    inputs.forEach((input) => {
      expect(input).toHaveValue(getValue(input.labels[0].textContent, labelsAndValues))
    })
    expect(countrySelect).toHaveValue(country)
    expect(checkbox).toBeChecked()
  })

  test('positive test - fill in form, submit, open widget, close widget, press back', async () => {
    InputForm.renderApp()
    const values = labelsAndValues.map(pair => pair.value)
    const labels = labelsAndValues.map(pair => pair.label)
    const inputs = InputForm.fillInFieldsByLabel()
    const countrySelect = InputForm.selectOption()
    const checkbox = InputForm.agreeWithTerms()
    inputs.forEach((input) => {
      expect(input).toHaveValue(getValue(input.labels[0].textContent, labelsAndValues))
    })
    InputForm.registry()
    const resultCells = ResultPage.getResultTable()
    resultCells.forEach((item) => {
      ResultPage.checkVisible(item)
    })
    const actualTableValues = resultCells.map(item => item.textContent)
    const expectTableValues = [...values, country, 'true', checkboxLabel, comboboxLabel, ...labels]
    expect(actualTableValues).toEqual(expect.arrayContaining(expectTableValues))
    expect(expectTableValues).toEqual(expect.arrayContaining(actualTableValues))
    ResultPage.openWidget()
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    const dialog = ResultPage.dialog()
    ResultPage.checkVisible(dialog)
    ResultPage.waitForMessagesOfStep(welcomeStep)
    await ResultPage.clickButton(welcomeStep.buttons[0].text)
    const paragraph = ResultPage.findElByText(welcomeStep.buttons[0].text)
    expect(paragraph.tagName).toBe('P')
    const [startStep] = steps.filter(item => item.id == welcomeStep.buttons[0].nextStepId)
    ResultPage.waitForButtonsOfStep(startStep)
    ResultPage.closeWidget()
    await waitFor(() => {
      expect(ResultPage.findAllByText(welcomeStep.buttons[0].text)).toHaveLength(0)
    })
    resultCells.forEach((item) => {
      ResultPage.checkVisible(item)
    })
    expect(dialog).not.toBeInTheDocument()
    ResultPage.backToForm()
    await waitFor(() => {
      const actualValues = inputs.map(item => item.value)
      expect(actualValues).toEqual(values)
      expect(countrySelect).toHaveValue(country)
      expect(checkbox).toBeChecked()
      resultCells.forEach((item) => {
        expect(item).not.toBeInTheDocument()
        expect(item).not.toBeVisible()
      })
      expect(InputForm.findAllByText(backButtonLabel)).toHaveLength(0)
    })
  })
})
