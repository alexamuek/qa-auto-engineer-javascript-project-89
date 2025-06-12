import { render, screen, waitFor, fireEvent, prettyDOM } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, afterEach, vi } from "vitest"
import { debug } from 'vitest-preview';

import Widget from '@hexlet/chatbot-v2'
import '@hexlet/chatbot-v2/styles'

import steps1 from '../__fixtures__/errorSteps1.js'
import steps2 from '../__fixtures__/errorSteps2.js'
import steps3 from '../__fixtures__/errorSteps3.js'
import steps4 from '../__fixtures__/errorSteps4.js'
import steps5 from '../__fixtures__/errorSteps5.js'
import steps6 from '../__fixtures__/errorSteps6.js'
import steps7 from '../__fixtures__/errorSteps7.js'
import steps8 from '../__fixtures__/errorSteps8.js'
import steps9 from '../__fixtures__/errorSteps9.js'

let chatButton
const scrollIntoViewMock = vi.fn()
let container

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
})

afterEach(() => {
  document.body.innerHTML = '' // clear body force
})

test('1 - negative test - no message, no button property', async () => {
  container = render(Widget(steps1))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps1.filter((item) => item.id == 'welcome')
  const startButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(startButton).toBeVisible()
    expect(startButton).toBeInTheDocument() 
    expect(startButton).not.toHaveStyle({ display: 'none' })
  })
  /*try {
    await user.click(startButton)
  } catch {}
  console.log(prettyDOM(document.body)) 
  console.log('here!!');*/
  /*await waitFor(() => 
    expect(userEvent.click(startButton)).rejects.toThrow()
  );*/
  //await user.click(startButton)
  // screen.debug()  
})

test('2 - negative test - empty message array, empty button array', async () => {
  container = render(Widget(steps2))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps2.filter((item) => item.id == 'welcome')
  const startButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(startButton).toBeVisible()
    expect(startButton).toBeInTheDocument() 
    expect(startButton).not.toHaveStyle({ display: 'none' })
  })
  await user.click(startButton)
  const paragraphs = await screen.findAllByText(welcomeObj.buttons[0].text)
  const [startObj, ] = steps2.filter((item) => item.id == welcomeObj.buttons[0].nextStepId)
  await waitFor(() => {
    // check: button was replaced by text message after click 
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].tagName).toBe('P')
  })
  startObj.messages.forEach(async (message) => {
    const pEl = await screen.findByText(message);
    // check: after clicking elements appeared with role Button
    await waitFor(() => {
      // check: after clicking message appeared
      expect(document.body).toHaveTextContent(message)
      expect(pEl.tagName).toBe('P')
    })
  })
  // debug()
  // screen.debug()  
})

test('3 - negative test - link to non-existed step Start', async () => {
  container = render(Widget(steps3))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps3.filter((item) => item.id == 'welcome')
  const startButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(startButton).toBeVisible()
    expect(startButton).toBeInTheDocument() 
    expect(startButton).not.toHaveStyle({ display: 'none' })
  })
  await user.click(startButton)
  const startButtonAgain = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
   await waitFor(() => {
    expect(startButtonAgain).toBeVisible()
    expect(startButtonAgain).toBeInTheDocument() 
    expect(startButtonAgain).not.toHaveStyle({ display: 'none' })
  })
  // debug()
  // screen.debug()  
})

test('4 - negative test - link to itself', async () => {
  container = render(Widget(steps4))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps4.filter((item) => item.id == 'welcome')
  const welcomeButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(welcomeButton).toBeVisible()
    expect(welcomeButton).toBeInTheDocument() 
    expect(welcomeButton).not.toHaveStyle({ display: 'none' })
  })
  await user.click(welcomeButton)
  const elements = await screen.findAllByText(welcomeObj.buttons[0].text)
  const validTags = ['P', 'BUTTON']
  elements.forEach(async (el) => {
    await waitFor(() => {
      expect(el).toBeVisible()
      expect(el).toBeInTheDocument() 
      expect(el).not.toHaveStyle({ display: 'none' })
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName])
      )  
    })
  })
  // debug()
  // screen.debug()  
})

test('5 - negative test - button object doesn\'t have text property', async () => {
  container = render(Widget(steps5))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const welcomeButton = await screen.findByRole('button', { name: ''})
  await waitFor(() => {
    expect(welcomeButton).toBeVisible()
    expect(welcomeButton).toBeInTheDocument() 
    expect(welcomeButton).not.toHaveStyle({ display: 'none' })
  })
  // debug()
  // screen.debug()  
})

test('6 - negative test - button object doesn\'t have nextStepId property', async () => {
  container = render(Widget(steps6))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps6.filter((item) => item.id == 'welcome')
  const welcomeButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(welcomeButton).toBeVisible()
    expect(welcomeButton).toBeInTheDocument() 
    expect(welcomeButton).not.toHaveStyle({ display: 'none' })
  })
  await user.click(welcomeButton)
  const elements = await screen.findAllByText(welcomeObj.buttons[0].text)
  const validTags = ['P', 'BUTTON']
  elements.forEach(async (el) => {
    await waitFor(() => {
      expect(el).toBeVisible()
      expect(el).toBeInTheDocument() 
      expect(el).not.toHaveStyle({ display: 'none' })
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName])
      )  
    })
  })
  // debug()
  // screen.debug()  
})

test('7 - negative test - button object doesn\'t have Type property', async () => {
  container = render(Widget(steps7))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps7.filter((item) => item.id == 'welcome')
  const welcomeButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(welcomeButton).toBeVisible()
    expect(welcomeButton).toBeInTheDocument() 
    expect(welcomeButton).not.toHaveStyle({ display: 'none' })
  })
  await user.click(welcomeButton)
  const [startObj, ] = steps7.filter((item) => item.id == welcomeObj.buttons[0].nextStepId)
  startObj.buttons.forEach(async (button) => {
    // check: after clicking elements appeared with role Button
    const buttonEl = await screen.findByRole('button', { name: button.text })
    await waitFor(() => {
      // check: after clicking buttons appeared
      expect(document.body).toHaveTextContent(button.text)
    })
  })
  //debug();
  //screen.debug(undefined, { maxDepth: 10, maxLength: 10000 }) 
})

test('8 - negative test - wrong type of button', async () => {
  container = render(Widget(steps8))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps8.filter((item) => item.id == 'welcome')
  const welcomeButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(welcomeButton).toBeVisible()
    expect(welcomeButton).toBeInTheDocument() 
    expect(welcomeButton).not.toHaveStyle({ display: 'none' })
  })
  await user.click(welcomeButton)
  const [startObj, ] = steps7.filter((item) => item.id == welcomeObj.buttons[0].nextStepId)
  startObj.buttons.forEach(async (button) => {
    // check: after clicking elements appeared with role Button
    const buttonEl = await screen.findByRole('button', { name: button.text })
    await waitFor(() => {
      // check: after clicking buttons appeared
      expect(document.body).toHaveTextContent(button.text)
    })
  })
  debug();
  //screen.debug(undefined, { maxDepth: 10, maxLength: 10000 }) 
})

test('9 - negative test - next step doesn\'t have id', async () => {
  container = render(Widget(steps9))
  chatButton = await screen.findByRole('button', { name: 'Открыть Чат' })
  expect(chatButton).toBeVisible()
  expect(chatButton).toBeInTheDocument() 
  expect(chatButton).not.toHaveStyle({ display: 'none' })
  const user = userEvent.setup()
  await user.click(chatButton)
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => {
    expect(dialog).toBeInTheDocument()
  })
  const [welcomeObj, ] = steps9.filter((item) => item.id == 'welcome')
  const welcomeButton = await screen.findByRole('button', { name: welcomeObj.buttons[0].text })
  await waitFor(() => {
    expect(welcomeButton).toBeVisible()
    expect(welcomeButton).toBeInTheDocument() 
    expect(welcomeButton).not.toHaveStyle({ display: 'none' })
  })
  await user.click(welcomeButton)
  const elements = await screen.findAllByText(welcomeObj.buttons[0].text)
  const validTags = ['P', 'BUTTON']
  elements.forEach(async (el) => {
    await waitFor(() => {
      expect(el).toBeVisible()
      expect(el).toBeInTheDocument() 
      expect(el).not.toHaveStyle({ display: 'none' })
      expect(validTags).toEqual(
        expect.arrayContaining([el.tagName])
      )  
    })
  })
  debug()
  // screen.debug()
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
})

test('positive test - several steps', async () => {
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
