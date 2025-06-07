import { describe, it, expect, vi, beforeEach } from 'vitest'
import ModulesPage from '@/http/pages/modules/page.js'
import { fetcher, Auth } from '@/utils'

vi.mock('@/utils', () => ({
  fetcher: vi.fn(),
  Auth: {
    getUser: vi.fn(() => Promise.resolve({ displayName: 'Omar Al' }))
  }
}))

let container

describe('ModulesPage (Student View)', () => {
  beforeEach(async () => {
    // Mock fetcher response
    fetcher.mockImplementation((url) => {
      if (url === 'module') {
        return Promise.resolve([{ id: 'mod-123', name: 'Test Module' }])
      }
      if (url.startsWith('ModuleReview/')) {
        return Promise.resolve([])
      }
      return Promise.resolve({})
    })

    document.body.innerHTML = ModulesPage()
    await ModulesPage.onPageLoaded()
    container = document.querySelector('#modules-container')
  })

  it('should render loading state initially', () => {
    // Render again separately before calling onPageLoaded
    document.body.innerHTML = ModulesPage()
    const preLoadContainer = document.querySelector('#modules-container')
    expect(preLoadContainer.textContent).toContain('Modules worden geladen...')
  })

  it('should open review dialog with correct module info', () => {
    const openFn = window.openReviewDialog
    expect(typeof openFn).toBe('function')

    document.querySelector('#dialog-module-name').textContent = ''
    openFn('mod-123', 'Test Module')

    const dialog = document.querySelector('#review-dialog')
    expect(dialog.classList.contains('active')).toBe(true)
    expect(document.querySelector('#dialog-module-name').textContent).toBe('Test Module')
  })

  it('should close review dialog and reset textarea', () => {
    const dialog = document.querySelector('#review-dialog')
    dialog.classList.add('active')
    const closeBtn = document.querySelector('#cancel-review')
    const input = document.querySelector('#review-text')

    Object.defineProperty(input, 'shadowRoot', {
      value: { querySelector: () => ({ value: 'abc' }) },
      configurable: true
    })

    closeBtn.click()
    expect(dialog.classList.contains('active')).toBe(false)
  })

  it('should show alert if review is empty', async () => {
    global.alert = vi.fn()
    const form = document.querySelector('#review-form')
    const input = document.querySelector('#review-text')

    Object.defineProperty(input, 'shadowRoot', {
      value: { querySelector: () => ({ value: '' }) },
      configurable: true
    })

    window.openReviewDialog('mod-123', 'Test')
    await form.dispatchEvent(new Event('submit'))

    expect(global.alert).toHaveBeenCalledWith('Voer alstublieft een review in.')
  })

  it('should send review via fetcher on submit', async () => {
    const form = document.querySelector('#review-form')
    const input = document.querySelector('#review-text')

    Object.defineProperty(input, 'shadowRoot', {
      value: { querySelector: () => ({ value: 'Goede module!' }) },
      configurable: true
    })

    window.openReviewDialog('mod-123', 'Test')
    await form.dispatchEvent(new Event('submit'))

    expect(fetcher).toHaveBeenCalledWith('ModuleReview', {
      method: 'POST',
      body: { moduleId: 'mod-123', reviewText: 'Goede module!' }
    })
  })

  it('should call fetcher to get modules on load', () => {
    expect(fetcher).toHaveBeenCalledWith('module')
  })
})
