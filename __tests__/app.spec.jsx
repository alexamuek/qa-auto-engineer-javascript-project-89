import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, afterEach, vi } from "vitest"
import { debug } from 'vitest-preview';
import App from '../src/App.jsx'
import steps from '../__fixtures__/steps.js'

let chatButton
const scrollIntoViewMock = vi.fn()
let container
const email = 'qa@gmail.com'
const password = '1111'
const address = 'Lenin st, build 10'
const city = 'Moscow'
const country = 'Россия'

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
  container = render(<App />)
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(true).toBeTruthy()
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
})

afterEach(() => {
  document.body.innerHTML = '' // clear body force
})

test('positive test - fill in form, open widget, close widget', async () => {
  const emailInput = await screen.findByPlaceholderText('Email')
  const passwordInput = await screen.findByPlaceholderText('Пароль');
  const addressInput = await screen.findByPlaceholderText('Невский проспект, 12')
  const cityInput = await screen.findByLabelText('Город')
  const countryInput = await screen.findByRole('combobox', { name: 'Страна'})
  const checkbox = await screen.findByRole('checkbox', { name: 'Принять правила' })
  const signUpButton = await screen.findByRole('button', { name: 'Зарегистрироваться' })
  await waitFor(() => {
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(addressInput).toBeInTheDocument()
    expect(cityInput).toBeInTheDocument()
    expect(countryInput).toBeInTheDocument()
    expect(signUpButton).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })
  const user = userEvent.setup()
  // fill in data in form
  await user.type(emailInput, email)
  await user.type(passwordInput, password)
  await user.type(addressInput, address)
  await user.type(cityInput, city)
  await user.selectOptions(countryInput, "Россия")
  await user.click(checkbox)
  await waitFor(() => {
    expect(countryInput).toHaveValue("Россия");
    expect(checkbox).toBeChecked()
  })
  // open bot window
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  // check content inside widget dialog
  const [welcomeObj, ] = steps.filter((item) => item.id == 'welcome')
  await waitFor(() => {
    expect(document.body).toHaveTextContent(welcomeObj.messages[0])
  })
  const startButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(startButton).toBeVisible()
    expect(startButton).toBeInTheDocument() 
    expect(startButton).not.toHaveStyle({ display: 'none' })
  })
  const closeButton = await screen.findByRole('button', { name: 'Close' })
  await waitFor(() => {
    expect(closeButton).toBeVisible()
  })
  // close widget dialog
  await user.click(closeButton)
  await new Promise(resolve => setTimeout(resolve, 3000));
  const buttons = await screen.queryAllByText(welcomeObj.buttons[0].text)
  //debug()
  // check state after closing of bot window
  await waitFor(() => {
    expect(buttons).toHaveLength(0)
    expect(dialog).not.toBeInTheDocument()
    expect(emailInput).toHaveValue(email);
    expect(passwordInput).toHaveValue(password);
    expect(addressInput).toHaveValue(address);
    expect(cityInput).toHaveValue(city);
    expect(countryInput).toHaveValue("Россия");
    expect(checkbox).toBeChecked()
  })
  // debug()
  // screen.debug()  
})

test('positive test - fill in form, submit, open widget, close widget, press back', async () => {
  const emailInput = await screen.findByPlaceholderText('Email')
  const passwordInput = await screen.findByPlaceholderText('Пароль');
  const addressInput = await screen.findByPlaceholderText('Невский проспект, 12')
  const cityInput = await screen.findByLabelText('Город')
  const countryInput = await screen.findByRole('combobox', { name: 'Страна'})
  const checkbox = await screen.findByRole('checkbox', { name: 'Принять правила' })
  const signUpButton = await screen.findByRole('button', { name: 'Зарегистрироваться' })
  const user = userEvent.setup()
  const submitButton = await screen.findByRole('button', { name: 'Зарегистрироваться' })
  // fill in data in form
  await user.type(emailInput, email)
  await user.type(passwordInput, password)
  await user.type(addressInput, address)
  await user.type(cityInput, city)
  await user.selectOptions(countryInput, "Россия")
  await user.click(checkbox)
  // press submit
  await user.click(submitButton)
  const backButton = await screen.findByRole('button', { name: 'Назад' })
  await waitFor(() => {
    expect(backButton).toBeVisible()
  })
  // check stored data
  const tdRulesLabel = await screen.findByText('Принять правила', { selector: 'td' });
  const tdAddressLabel = await screen.findByText('Адрес', { selector: 'td' });
  const tdCityLabel = await screen.findByText('Город', { selector: 'td' });
  const tdCountryLabel = await screen.findByText('Страна', { selector: 'td' });
  const tdEmailLabel = await screen.findByText('Email', { selector: 'td' });
  const tdPasswordLabel = await screen.findByText('Пароль', { selector: 'td' });
  const tdRulesValue = await screen.findByText('Принять правила', { selector: 'td' });
  const tdAddressValue = await screen.findByText('Адрес', { selector: 'td' });
  const tdCityValue = await screen.findByText('Город', { selector: 'td' });
  const tdCountryValue = await screen.findByText('Страна', { selector: 'td' });
  const tdEmailValue = await screen.findByText('Email', { selector: 'td' });
  const tdPasswordValue = await screen.findByText('Пароль', { selector: 'td' });
  const tableData = [
    tdRulesLabel,
    tdAddressLabel,
    tdCityLabel,
    tdCountryLabel,
    tdEmailLabel,
    tdPasswordLabel,
    tdRulesValue,
    tdAddressValue,
    tdCityValue,
    tdCountryValue,
    tdEmailValue,
    tdPasswordValue
  ]
  await waitFor(() => {
    expect(backButton).toBeVisible()
    tableData.forEach((item) => {
      expect(item).toBeInTheDocument();
      expect(item).toBeVisible()
      expect(item).not.toHaveStyle({ display: 'none' })  
    })
  })
  // open bot window
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps.filter((item) => item.id == 'welcome')
  await waitFor(() => {
    expect(document.body).toHaveTextContent(welcomeObj.messages[0])
  })
  const startButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(startButton).toBeVisible()
    expect(startButton).toBeInTheDocument() 
    expect(startButton).not.toHaveStyle({ display: 'none' })
  })
  // click button inside widget
  await user.click(startButton)
  const paragraphs = await screen.findAllByText(welcomeObj.buttons[0].text);
  await waitFor(() => {
    // check: button was replaced by text message after click 
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].tagName).toBe('P')
  })
  const [startObj, ] = steps.filter((item) => item.id == welcomeObj.buttons[0].nextStepId)
  startObj.buttons.forEach(async (button) => {
    // check: after clicking elements appeared with role Button
    const buttonEl = await screen.findByRole('button', { name: button.text })
    await waitFor(() => {
      // check: after clicking buttons appeared
      expect(document.body).toHaveTextContent(button.text)
    })
  })
  const closeButton = await screen.findByRole('button', { name: 'Close' })
  await waitFor(() => {
    expect(closeButton).toBeVisible()
  })
  // close widget 
  await user.click(closeButton)
  await new Promise(resolve => setTimeout(resolve, 3000));
  const buttons = await screen.queryAllByText(welcomeObj.buttons[0].text)
  // check state after closing of bot window
  await waitFor(() => {
    expect(backButton).toBeVisible()
    expect(dialog).not.toBeInTheDocument()
    tableData.forEach((item) => {
      expect(item).toBeInTheDocument();
      expect(item).toBeVisible()
      expect(item).not.toHaveStyle({ display: 'none' })  
    })
  })
  // press Back
  await user.click(backButton)
  // check state after press Back
  await waitFor(() => {
    expect(emailInput).toHaveValue(email);
    expect(passwordInput).toHaveValue(password);
    expect(addressInput).toHaveValue(address);
    expect(cityInput).toHaveValue(city);
    expect(countryInput).toHaveValue("Россия");
    expect(checkbox).toBeChecked()
    expect(backButton).not.toBeVisible()
    tableData.forEach((item) => {
      expect(item).not.toBeInTheDocument();
      expect(item).not.toBeVisible()
    })
  })
  // debug()
  // screen.debug()  
})