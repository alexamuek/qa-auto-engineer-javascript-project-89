import { cleanup } from '@testing-library/react'
import { test, beforeEach, afterEach, vi } from 'vitest'
import { AppPage } from './pages/App.jsx'
// import { debug } from 'vitest-preview'

const scrollIntoViewMock = vi.fn()

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
})

afterEach(() => {
  cleanup()
})

/* eslint-disable no-undef */
describe('Integrate positive cases', () => {
  test('initialize app with widget', async () => {
    AppPage.renderApp()
    AppPage.waitForForm()
    AppPage.waitForWidgetButton()
  })

  test('open and close modal window', async () => {
    AppPage.renderApp()
    AppPage.openWidget()
    AppPage.expectModalTitle()
    AppPage.closeWidget()
    AppPage.waitForForm()
  })

  test('form input fields are functional', () => {
    AppPage.renderApp()
    AppPage.fillOutForm()
    AppPage.registry()
    AppPage.waitForResultTable()
  })

  test('fill out form, open widget, close widget', () => {
    AppPage.renderApp()
    AppPage.fillOutForm()
    AppPage.openWidget()
    AppPage.waitForWidgetContent()
    AppPage.closeWidget()
    AppPage.waitForDataInForm()
  })

  test('fill out form, submit, open widget, close widget, press back', async () => {
    AppPage.renderApp()
    AppPage.fillOutForm()
    AppPage.registry()
    AppPage.openWidget()
    AppPage.waitForWidgetContent()
    AppPage.closeWidget()
    AppPage.waitForResultTable()
    AppPage.backToForm()
    AppPage.waitForDataInForm()
    AppPage.notFoundBackButton()
  })
})
