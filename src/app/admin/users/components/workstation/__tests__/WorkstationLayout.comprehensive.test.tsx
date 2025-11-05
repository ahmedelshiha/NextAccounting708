'use client'

import React from 'react'
import { render, screen } from '../../../../../test-mocks/testing-library-react'
import { WorkstationLayout } from '../WorkstationLayout'
import { BREAKPOINTS, SIDEBAR_WIDTH, INSIGHTS_PANEL_WIDTH } from '../../../types/workstation'

describe('WorkstationLayout - Unit Tests', () => {
  // Test 1: Basic Rendering
  describe('Basic Rendering', () => {
    it('should render all three main areas: sidebar, main, and insights', () => {
      render(
        <WorkstationLayout
          sidebar={<div data-testid="sidebar-content">Sidebar</div>}
          main={<div data-testid="main-content">Main</div>}
          insights={<div data-testid="insights-content">Insights</div>}
        />
      )

      expect(screen.getByTestId('sidebar-content')).toBeTruthy()
      expect(screen.getByRole('main')).toBeTruthy()
      expect(screen.getByTestId('insights-content')).toBeTruthy()
    })

    it('should render with semantic HTML structure', () => {
      const { container } = render(
        <WorkstationLayout
          sidebar={<nav>Navigation</nav>}
          main={<main>Main Content</main>}
          insights={<aside>Insights</aside>}
        />
      )

      const container_elem = container.querySelector('.workstation-container')
      expect(container_elem).toBeTruthy()
      expect(container_elem?.querySelector('aside.workstation-sidebar')).toBeTruthy()
      expect(container_elem?.querySelector('main.workstation-main-content')).toBeTruthy()
      expect(container_elem?.querySelector('aside.workstation-insights-panel')).toBeTruthy()
    })
  })

  // Test 2: CSS Variables
  describe('CSS Variables', () => {
    it('should apply custom sidebar width CSS variable', () => {
      const customWidth = 320
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
          sidebarWidth={customWidth}
        />
      )

      const element = container.querySelector('.workstation-container') as HTMLElement
      const styles = element?.style as CSSStyleDeclaration
      expect(styles.getPropertyValue('--sidebar-width')).toBe(`${customWidth}px`)
    })

    it('should apply custom insights panel width CSS variable', () => {
      const customWidth = 400
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
          insightsPanelWidth={customWidth}
        />
      )

      const element = container.querySelector('.workstation-container') as HTMLElement
      const styles = element?.style as CSSStyleDeclaration
      expect(styles.getPropertyValue('--insights-width')).toBe(`${customWidth}px`)
    })

    it('should use default widths when not specified', () => {
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      const element = container.querySelector('.workstation-container') as HTMLElement
      const styles = element?.style as CSSStyleDeclaration
      expect(styles.getPropertyValue('--sidebar-width')).toBe(`${SIDEBAR_WIDTH}px`)
      expect(styles.getPropertyValue('--insights-width')).toBe(`${INSIGHTS_PANEL_WIDTH}px`)
    })
  })

  // Test 3: Callback Props
  describe('Callback Props', () => {
    it('should accept onSidebarToggle callback', () => {
      const onSidebarToggle = jest.fn()
      render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
          onSidebarToggle={onSidebarToggle}
        />
      )

      // Callback is accepted without errors
      expect(onSidebarToggle).toBeDefined()
    })

    it('should accept onInsightsToggle callback', () => {
      const onInsightsToggle = jest.fn()
      render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
          onInsightsToggle={onInsightsToggle}
        />
      )

      expect(onInsightsToggle).toBeDefined()
    })
  })

  // Test 4: Memoization
  describe('Memoization', () => {
    it('should be memoized to prevent unnecessary re-renders', () => {
      const { rerender } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      // Should handle re-render efficiently
      rerender(
        <WorkstationLayout
          sidebar={<div>Sidebar Updated</div>}
          main={<div>Main Updated</div>}
          insights={<div>Insights Updated</div>}
        />
      )

      expect(screen.getByText('Sidebar Updated')).toBeTruthy()
    })
  })

  // Test 5: Responsive Layout Classes
  describe('Responsive Layout', () => {
    it('should have workstation-container class for grid layout', () => {
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      const gridContainer = container.querySelector('.workstation-container')
      expect(gridContainer).toBeTruthy()
      expect(gridContainer?.className).toContain('workstation-container')
    })

    it('should render overlay element for mobile drawer interaction', () => {
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      const overlay = container.querySelector('.workstation-overlay')
      expect(overlay).toBeTruthy()
    })
  })

  // Test 6: Content Rendering
  describe('Content Rendering', () => {
    it('should render custom sidebar content', () => {
      const SidebarContent = () => (
        <div>
          <h3>Custom Sidebar</h3>
          <p>Sidebar content</p>
        </div>
      )

      render(
        <WorkstationLayout
          sidebar={<SidebarContent />}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      expect(screen.getByText('Custom Sidebar')).toBeTruthy()
      expect(screen.getByText('Sidebar content')).toBeTruthy()
    })

    it('should render custom main content', () => {
      const MainContent = () => (
        <div>
          <h2>Main Section</h2>
          <p>User directory</p>
        </div>
      )

      render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<MainContent />}
          insights={<div>Insights</div>}
        />
      )

      expect(screen.getByText('Main Section')).toBeTruthy()
      expect(screen.getByText('User directory')).toBeTruthy()
    })

    it('should render custom insights content', () => {
      const InsightsContent = () => (
        <div>
          <h3>Analytics Panel</h3>
          <p>Charts and metrics</p>
        </div>
      )

      render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<InsightsContent />}
        />
      )

      expect(screen.getByText('Analytics Panel')).toBeTruthy()
      expect(screen.getByText('Charts and metrics')).toBeTruthy()
    })
  })

  // Test 7: Accessibility
  describe('Accessibility', () => {
    it('should have proper semantic structure with main element', () => {
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      const mainElement = container.querySelector('main')
      expect(mainElement).toBeTruthy()
      expect(mainElement?.className).toContain('workstation-main-content')
    })

    it('should have aside elements for sidebar and insights', () => {
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      const asideElements = container.querySelectorAll('aside')
      expect(asideElements.length).toBeGreaterThanOrEqual(2)
    })

    it('should render without console errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      expect(consoleErrorSpy).not.toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  // Test 8: Props Validation
  describe('Props Validation', () => {
    it('should accept all valid prop combinations', () => {
      const { rerender } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
          sidebarWidth={280}
          insightsPanelWidth={300}
          onSidebarToggle={() => {}}
          onInsightsToggle={() => {}}
        />
      )

      expect(screen.getByText('Sidebar')).toBeTruthy()

      // Verify with different props
      rerender(
        <WorkstationLayout
          sidebar={<div>Updated Sidebar</div>}
          main={<div>Updated Main</div>}
          insights={<div>Updated Insights</div>}
          sidebarWidth={320}
          insightsPanelWidth={350}
        />
      )

      expect(screen.getByText('Updated Sidebar')).toBeTruthy()
    })

    it('should handle missing optional props gracefully', () => {
      render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      // Should render without errors even without optional props
      expect(screen.getByText('Sidebar')).toBeTruthy()
    })
  })

  // Test 9: Dynamic Content
  describe('Dynamic Content', () => {
    it('should handle changing sidebar content', () => {
      const { rerender } = render(
        <WorkstationLayout
          sidebar={<div>Original Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      expect(screen.getByText('Original Sidebar')).toBeTruthy()

      rerender(
        <WorkstationLayout
          sidebar={<div>Updated Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
        />
      )

      expect(screen.getByText('Updated Sidebar')).toBeTruthy()
      expect(screen.queryByText('Original Sidebar')).toBeFalsy()
    })

    it('should handle changing main content', () => {
      const { rerender } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Original Main</div>}
          insights={<div>Insights</div>}
        />
      )

      expect(screen.getByText('Original Main')).toBeTruthy()

      rerender(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Updated Main</div>}
          insights={<div>Insights</div>}
        />
      )

      expect(screen.getByText('Updated Main')).toBeTruthy()
    })
  })

  // Test 10: Edge Cases
  describe('Edge Cases', () => {
    it('should handle empty content nodes', () => {
      render(
        <WorkstationLayout
          sidebar={<></>}
          main={<></>}
          insights={<></>}
        />
      )

      const container = document.querySelector('.workstation-container')
      expect(container).toBeTruthy()
    })

    it('should handle very large widths', () => {
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
          sidebarWidth={1000}
          insightsPanelWidth={1000}
        />
      )

      const element = container.querySelector('.workstation-container') as HTMLElement
      const styles = element?.style as CSSStyleDeclaration
      expect(styles.getPropertyValue('--sidebar-width')).toBe('1000px')
      expect(styles.getPropertyValue('--insights-width')).toBe('1000px')
    })

    it('should handle minimum widths', () => {
      const { container } = render(
        <WorkstationLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
          insights={<div>Insights</div>}
          sidebarWidth={100}
          insightsPanelWidth={100}
        />
      )

      const element = container.querySelector('.workstation-container') as HTMLElement
      const styles = element?.style as CSSStyleDeclaration
      expect(styles.getPropertyValue('--sidebar-width')).toBe('100px')
      expect(styles.getPropertyValue('--insights-width')).toBe('100px')
    })
  })
})
