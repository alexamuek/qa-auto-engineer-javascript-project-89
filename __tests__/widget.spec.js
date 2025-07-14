import { fireEvent, cleanup } from '@testing-library/react'
import { test, vi, beforeEach, afterEach, describe, expect } from 'vitest'
// import Widget from './pages/Widget'
import { WidgetWindow } from './pages/WidgetWindow.js'
import steps from '../__fixtures__/steps'
import { checkVisible, checkButtonsOfStep, checkMessagesOfStep, checkVisibleSync } from './helpers.js'

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
})

describe('Widget pass cases', () => {
  test('positive test - initialize', async () => {
    // init - start
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    // init - finish
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    const dialog = WidgetWindow.dialog()
    WidgetWindow.checkVisible(dialog)
    // check: after clicking messages appeared
    WidgetWindow.waitForMessagesOfStep(welcomeStep)
    // check: after clicking elements appeared with role Button
    WidgetWindow.waitForButtonsOfStep(welcomeStep)
  })
  
  test('positive test - close dialog', async () => {
    WidgetWindow.renderWidget(steps)
    WidgetWindow.openWidget()
    WidgetWindow.expectModalTitle()
    WidgetWindow.closeWidget()
    await WidgetWindow.waitForModalToClose()
    const [welcomeStep] = steps.filter(item => item.id == 'welcome')
    expect(WidgetWindow.findElByLabel(welcomeStep.buttons[0].text)).toHaveLength(0)
  })
})
