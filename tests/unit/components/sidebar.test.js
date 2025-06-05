import { describe, it, expect } from 'vitest'
import { Sidebar } from '@/components/sidebar' 


customElements.define('sidebar-component', Sidebar)

describe('Sidebar Custom Element', () => {
  it('should render the sidebar and contain expected buttons', async () => {
    
    const el = new Sidebar()
    document.body.appendChild(el)

    const shadow = el.shadowRoot
    expect(shadow).not.toBeNull()

    const sidebar = shadow.getElementById('sidebar')
    expect(sidebar).toBeTruthy()

    // test of een specifieke knop bestaat
    const btn = shadow.getElementById('button-modules')
    expect(btn).toBeTruthy()
    expect(btn.textContent.toLowerCase()).toContain('modules') 

    // 👇 test collapsed state toggle
    const wrapper = shadow.getElementById('sidebar-wrapper')
    wrapper.click()
    expect(sidebar.classList.contains('collapsed')).toBe(true)
  })
})
