import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, afterEach, vi } from "vitest"
import { debug } from 'vitest-preview';

import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps.js'
import { StartPage } from './pages.js'
import '@hexlet/chatbot-v2/styles'

let chatButton
let startPage
let user
const scrollIntoViewMock = vi.fn()
let container
const widgetButtonName = 'Открыть Чат'
const closeButtonName = 'Close'

const checkVisible = async (el) => {
  await waitFor(() => {
      expect(el).toBeVisible()
      expect(el).toBeInTheDocument() 
      expect(el).not.toHaveStyle({ display: 'none' })
  })
}

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
  container = render(Widget(steps))
  //user = userEvent.setup()
  startPage = new StartPage()
  user = userEvent.setup()
  await startPage.openWidget(screen, user, widgetButtonName)
})

afterEach(() => {
  document.body.innerHTML = '' // clear body force
})

test('positive test - initialize', async () => {
  const [step0, ] = steps.filter((item) => item.id == 'welcome')
  const dialog = await screen.findByRole('dialog')
  //debug()
  await checkVisible(dialog)
  step0.messages.forEach(async (item) => {
    await waitFor (() => {
      expect(document.body).toHaveTextContent(item)
    })
  })
  step0.buttons.forEach(async (button) => {
    const el = await startPage.findButton(screen, button.text)
    await checkVisible(el)
  })
  // debug()
  // screen.debug()  
})

test('positive test - close dialog', async () => {
  const [step0, ] = steps.filter((item) => item.id == 'welcome')
  const button = await screen.findByRole('button', {name: closeButtonName})
  await user.click(button);
  //await startPage.closeWidget(screen, user, closeButtonName)
  //await new Promise(resolve => setTimeout(resolve, 1000));
  debug()
  //const buttons = await screen.queryAllByText(step0.buttons[0].text)
  //console.log(buttons)
  //debug()
  /*await waitFor(() => {
    expect(buttons).toHaveLength(0)
  })*/
  //screen.debug() 
})

/*test('positive test - close dialog', async () => {
  const user = userEvent.setup()
  await user.click(chatButton)
  const [welcomeObj, ] = steps.filter((item) => item.id == 'welcome')
  const nextButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  const closeButton = await screen.findByRole('button', { name: 'Close' })
  await waitFor(() => {
    expect(closeButton).toBeVisible()
  })
  await user.click(closeButton)
  await new Promise(resolve => setTimeout(resolve, 3000));
  const buttons = await screen.queryAllByText(welcomeObj.buttons[0].text)
  //debug()
  await waitFor(() => {
    expect(buttons).toHaveLength(0)
  })
  //screen.debug() 
})*/

/*test('positive test - several steps', async () => {
  const user = userEvent.setup()
  await user.click(chatButton)
  const [welcomeObj, ] = steps.filter((item) => item.id == 'welcome')
  welcomeObj.messages.forEach(async (item) => {
    await waitFor(() => {
      // check: text appeared after opening of dialog
      expect(document.body).toHaveTextContent(item)
    })
  })
  const nextButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await user.click(nextButton)
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
  const [advansedButtonDescr, ] = startObj.buttons.filter((item) => item.nextStepId == 'advanced')
  const advancedButton = await screen.findByRole('button', { name: advansedButtonDescr.text })
  const scrollCount = scrollIntoViewMock.mock.calls.length
  await user.click(advancedButton)
  const [advancedObj, ] = steps.filter((item) => item.id == 'advanced')
  await waitFor(() => {
    // check: scroll was used
    expect(scrollIntoViewMock.mock.calls.length).toBe(scrollCount + 1);
  })
  advancedObj.messages.forEach(async (item) => {
    await waitFor(() => {
      expect(document.body).toHaveTextContent(item)
    })
  })
  advancedObj.buttons.forEach(async (button) => {
    const foundButton = await screen.findByRole('button', { name: button.text })
    await waitFor(() => {
      expect(foundButton).toBeVisible()
      expect(foundButton).toBeInTheDocument() 
      expect(foundButton).not.toHaveStyle({ display: 'none' })
      })
  })
  //debug();
  //screen.debug(undefined, { maxDepth: 10, maxLength: 10000 }) 
})

test('positive test - scroll', async () => {
  const user = userEvent.setup()
  await user.click(chatButton)
  const [welcomeObj, ] = steps.filter((item) => item.id == 'welcome')
  const nextButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await user.click(nextButton)
  const [startObj, ] = steps.filter((item) => item.id == welcomeObj.buttons[0].nextStepId)
  const [advansedButtonDescr, ] = startObj.buttons.filter((item) => item.nextStepId == 'advanced')
  const advancedButton = await screen.findByRole('button', { name: advansedButtonDescr.text })
  await user.click(advancedButton)
  // находим див диалогового окна
  const div1 = await screen.findByText('Виртуальный помощник');
  const div2 = div1.parentElement
  const modalBody = div2.nextElementSibling
  // expect(div3).toHaveClass('modal-body');
  // make scroll
  //const scrollDialogMock = vi.fn()
  //modalBody.scrollIntoView = scrollDialogMock
  fireEvent.scroll(modalBody, { target: { scrollTop:  100} });
  await waitFor(() => {
    expect(modalBody.scrollTop).toBe(100)
  })
  // debug();
  //screen.debug(undefined, { maxDepth: 10, maxLength: 10000 }) 
})*/

// проверить, что когда навожу курсор, цвет меняется!!!