import { cleanup } from '@testing-library/react'
import { test, describe, beforeEach, afterEach, vi } from 'vitest'
import { AppPage } from './pages/App.jsx'
// import { debug } from 'vitest-preview'

const scrollIntoViewMock = vi.fn()

beforeEach(async () => {
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock // mock
  AppPage.renderApp()
})

afterEach(() => {
  cleanup()
})

describe('Integrate positive cases', () => {
  test('initialize app with widget', async () => {
    AppPage.waitForForm()
    AppPage.waitForWidgetButton()
  })

  test('open and close modal window', async () => {
    AppPage.openWidget()
    AppPage.expectModalTitle()
    AppPage.closeWidget()
    AppPage.waitForForm()
  })

  test('form input fields are functional', () => {
    AppPage.fillOutForm()
    AppPage.registry()
    AppPage.waitForResultTable()
  })

  test('fill out form, open widget, close widget', () => {
    AppPage.fillOutForm()
    AppPage.openWidget()
    AppPage.waitForWidgetContent()
    AppPage.closeWidget()
    AppPage.waitForDataInForm()
  })

  test('fill out form, submit, open widget, close widget, press back', async () => {
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
