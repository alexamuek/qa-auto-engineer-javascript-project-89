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

test('positive test - initialize', async () => {
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
    //expect(screen.findByRole('option', { name: 'Россия' }).selected).toBeTruthy();
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
  const closeButton = await screen.findByRole('button', { name: 'Close' })
  await waitFor(() => {
    expect(closeButton).toBeVisible()
  })
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

  debug()
  //screen.debug()  
})

// заполнил форму, открыл чат, , проверил, что помутнение появилось, потыкал кнопки, закрыл форму, проверил, что заполнение осталось
// недоконца заполнил форму, нажал Зарегать, - наверное, будет ошибка, потом открыл бота, потыкал кнопки и закрыл бота - проверил, что сообщение об ошибке осталось
// доконца заполнил форму, нажал Зарегать, - наверное, будет сообщение об успехе, потом открыл бота, потыкал кнопки и закрыл бота - проверил, что сообщение об успехе осталось 