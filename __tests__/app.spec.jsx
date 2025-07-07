// import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import App from '../src/App.jsx'
import steps from '../__fixtures__/steps.js'
import { InputForm, ResultPage } from './pages.js'
import { checkVisible, checkButtonsOfStep, checkMessagesOfStep } from './helpers.js'

const scrollIntoViewMock = vi.fn()
const widgetButtonName = 'Открыть Чат'
const closeButtonName = 'Close'
const submitButtonName = 'Зарегистрироваться'
const email = 'qa@gmail.com'
const password = '1111'
const address = 'Lenin st, build 10'
const city = 'Moscow'
const country = 'Россия'

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
})

afterEach(() => {
  cleanup()
})

test('positive test - fill in form, open widget, close widget', async () => {
  // init - start
  render(<App />)
  const user = userEvent.setup()
  const form = new InputForm()
  // init - finish
  // find elements and fill in
  const emailInput = await form.fillInFieldWithPlaceholder(screen, user, 'Email', email)
  const passwordInput = await form.fillInFieldWithPlaceholder(screen, user, 'Пароль', password)
  const addressInput = await form.fillInFieldWithPlaceholder(screen, user, 'Невский проспект, 12', address)
  const cityInput = await form.fillInFieldWithLabel(screen, user, 'Город', city)
  const countryInput = await form.selectOption(screen, user, 'Страна', country)
  // return code
  const checkbox = await form.clickCheckbox(screen, user, 'Принять правила')
  const submitButton = await form.findButton(screen, submitButtonName)
  const formEls = [emailInput, passwordInput, addressInput, cityInput, countryInput, checkbox, submitButton]
  formEls.forEach(async (item) => {
    await checkVisible(item)
  })
  await waitFor(() => {
    // expect(countryInput).toHaveValue("Россия");
    expect(checkbox).toBeChecked()
  })
  // open bot window
  await form.openWidget(screen, user, widgetButtonName)
  const [step0] = steps.filter(item => item.id == 'welcome')
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  // check content inside widget dialog
  await checkMessagesOfStep(step0)
  const startButton = await form.findButton(screen, step0.buttons[0].text)
  await checkVisible(startButton)
  // close widget dialog
  await form.closeWidget(screen, user, closeButtonName)
  const buttons = await screen.queryAllByText(step0.buttons[0].text)
  // check state after closing of bot window
  await waitFor(() => {
    expect(buttons).toHaveLength(0)
    expect(dialog).not.toBeInTheDocument()
    expect(emailInput).toHaveValue(email)
    expect(passwordInput).toHaveValue(password)
    expect(addressInput).toHaveValue(address)
    expect(cityInput).toHaveValue(city)
    expect(countryInput).toHaveValue(country)
    expect(checkbox).toBeChecked()
  })
})

test('positive test - fill in form, submit, open widget, close widget, press back', async () => {
  // init - start
  render(<App />)
  const user = userEvent.setup()
  const form = new InputForm()
  // init - finish
  // find elements and fill in
  const emailInput = await form.fillInFieldWithPlaceholder(screen, user, 'Email', email)
  const passwordInput = await form.fillInFieldWithPlaceholder(screen, user, 'Пароль', password)
  const addressInput = await form.fillInFieldWithPlaceholder(screen, user, 'Невский проспект, 12', address)
  const cityInput = await form.fillInFieldWithLabel(screen, user, 'Город', city)
  const countryInput = await form.selectOption(screen, user, 'Страна', country)
  // return code
  const checkbox = await form.clickCheckbox(screen, user, 'Принять правила')
  // submit form
  await form.clickButton(screen, user, submitButtonName)
  const resultPage = new ResultPage()
  const resultCells = await resultPage.getResultTable(screen)
  // check stored data
  resultCells.forEach(async (item) => {
    await checkVisible(item)
  })
  const actualTableValues = resultCells.map(item => item.textContent)
  const expectTableValues = [email, password, address, city, country, 'true', 'Принять правила', 'Адрес', 'Город', 'Страна', 'Email', 'Пароль']
  // check data
  await waitFor(() => {
    expect(actualTableValues).toEqual(expect.arrayContaining(expectTableValues))
    expect(expectTableValues).toEqual(expect.arrayContaining(actualTableValues))
  })
  // open bot window
  await resultPage.openWidget(screen, user, widgetButtonName)
  const [step0] = steps.filter(item => item.id == 'welcome')
  const dialog = await screen.findByRole('dialog')
  await checkVisible(dialog)
  await checkMessagesOfStep(step0)
  // click button inside widget
  await resultPage.clickButton(screen, user, step0.buttons[0].text)
  const paragraphs = await screen.findAllByText(step0.buttons[0].text)
  await waitFor(() => {
    // check: button was replaced by text message after click
    expect(paragraphs).toHaveLength(1)
    expect(paragraphs[0].tagName).toBe('P')
  })
  const [step1] = steps.filter(item => item.id == step0.buttons[0].nextStepId)
  // check: after clicking elements appeared with role Button
  await checkButtonsOfStep(step1, resultPage)
  // close widget
  await resultPage.closeWidget(screen, user, closeButtonName)
  const buttons = await screen.queryAllByText(step0.buttons[0].text)
  await waitFor(() => {
    expect(buttons).toHaveLength(0)
  })
  // check state after closing of bot window
  resultCells.forEach(async (item) => {
    await checkVisible(item)
  })
  await waitFor(() => {
    expect(dialog).not.toBeInTheDocument()
  })
  // press Back
  await resultPage.backToForm(screen, user)
  // check state after press Back
  await waitFor(() => {
    expect(emailInput).toHaveValue(email)
    expect(passwordInput).toHaveValue(password)
    expect(addressInput).toHaveValue(address)
    expect(cityInput).toHaveValue(city)
    expect(countryInput).toHaveValue(country)
    expect(checkbox).toBeChecked()
    resultCells.forEach((item) => {
      expect(item).not.toBeInTheDocument()
      expect(item).not.toBeVisible()
    })
  })
  // check press Back - Back is not in DOM
  await expect(
    resultPage.backToForm(screen, user),
  )
    .rejects
    .toThrow()
})
