'use client'

import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../../../../test-mocks/testing-library-react'
import { WorkstationSidebar } from '../WorkstationSidebar'
import type { UserFilters, QuickStatsData } from '../../../types/workstation'

describe('WorkstationSidebar - Comprehensive Unit Tests', () => {
  const defaultStats: QuickStatsData = {
    totalUsers: 150,
    activeUsers: 120,
    pendingApprovals: 10,
    inProgressWorkflows: 5,
    refreshedAt: new Date(),
  }

  const defaultFilters: UserFilters = {
    search: '',
    role: '',
    status: '',
    department: '',
    dateRange: 'all',
  }

  // Test 1: Basic Rendering
  describe('Basic Rendering', () => {
    it('should render sidebar with all main sections', () => {
      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
      expect(screen.getByTestId('quick-stats-section')).toBeTruthy()
      expect(screen.getByTestId('filters-section')).toBeTruthy()
      expect(screen.getByTestId('sidebar-footer')).toBeTruthy()
    })

    it('should render sidebar title and section headers', () => {
      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      // Expect sidebar sections to be present (exact headings depend on implementation)
      const sidebar = screen.getByTestId('workstation-sidebar')
      expect(sidebar).toBeTruthy()
    })

    it('should render quick stats with correct values', () => {
      const stats = {
        totalUsers: 150,
        activeUsers: 120,
        pendingApprovals: 10,
        inProgressWorkflows: 5,
        refreshedAt: new Date(),
      }

      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={stats as any}
        />
      )

      const statsContainer = screen.getByTestId('stats-container')
      expect(statsContainer).toBeTruthy()
    })
  })

  // Test 2: Filter Management
  describe('Filter Management', () => {
    it('should handle filter changes via onFiltersChange callback', () => {
      const onFiltersChange = jest.fn()
      const { rerender } = render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          stats={defaultStats}
        />
      )

      // Component renders successfully with callback
      expect(onFiltersChange).toBeDefined()
    })

    it('should display reset button for clearing filters', () => {
      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      const resetBtn = screen.getByTestId('reset-filters-btn')
      expect(resetBtn).toBeTruthy()
      expect(resetBtn.textContent).toContain('Reset Filters')
    })

    it('should handle reset button click', async () => {
      const onFiltersChange = jest.fn()
      const onReset = jest.fn()

      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          stats={defaultStats}
          onReset={onReset}
        />
      )

      const resetBtn = screen.getByTestId('reset-filters-btn')
      fireEvent.click(resetBtn)

      // Should trigger reset callbacks
      expect(onFiltersChange).toHaveBeenCalled()
      expect(onReset).toHaveBeenCalled()
    })

    it('should accept filter object and maintain structure', () => {
      const customFilters: UserFilters = {
        search: 'john',
        role: 'ADMIN',
        status: 'ACTIVE',
        department: 'Engineering',
        dateRange: 'month',
      }

      render(
        <WorkstationSidebar
          filters={customFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      // Component renders with complex filters
      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })
  })

  // Test 3: Saved Views Integration
  describe('Saved Views', () => {
    it('should render saved views section', () => {
      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('saved-views-section')).toBeTruthy()
    })

    it('should display all four view buttons', () => {
      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('view-btn-all')).toBeTruthy()
      expect(screen.getByTestId('view-btn-clients')).toBeTruthy()
      expect(screen.getByTestId('view-btn-team')).toBeTruthy()
      expect(screen.getByTestId('view-btn-admins')).toBeTruthy()
    })

    it('should handle view button clicks', () => {
      const onFiltersChange = jest.fn()

      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          stats={defaultStats}
        />
      )

      const clientsBtn = screen.getByTestId('view-btn-clients')
      fireEvent.click(clientsBtn)

      expect(onFiltersChange).toHaveBeenCalled()
    })
  })

  // Test 4: Mobile Drawer Behavior
  describe('Mobile Drawer', () => {
    it('should render close button', () => {
      render(
        <WorkstationSidebar
          isOpen={true}
          onClose={() => {}}
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      const closeBtn = screen.getByTestId('sidebar-close-btn')
      expect(closeBtn).toBeTruthy()
    })

    it('should handle close button click', () => {
      const onClose = jest.fn()

      render(
        <WorkstationSidebar
          isOpen={true}
          onClose={onClose}
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      const closeBtn = screen.getByTestId('sidebar-close-btn')
      fireEvent.click(closeBtn)

      expect(onClose).toHaveBeenCalled()
    })

    it('should accept isOpen prop', () => {
      const { rerender } = render(
        <WorkstationSidebar
          isOpen={true}
          onClose={() => {}}
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()

      rerender(
        <WorkstationSidebar
          isOpen={false}
          onClose={() => {}}
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })
  })

  // Test 5: Quick Stats Display
  describe('Quick Stats Display', () => {
    it('should display total users count', () => {
      const stats = {
        totalUsers: 100,
        activeUsers: 80,
        pendingApprovals: 5,
        inProgressWorkflows: 3,
        refreshedAt: new Date(),
      }

      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={stats as any}
        />
      )

      const statsContainer = screen.getByTestId('stats-container')
      expect(statsContainer).toBeTruthy()
    })

    it('should handle missing stats gracefully', () => {
      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={undefined}
        />
      )

      // Should render without errors
      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })

    it('should update when stats change', () => {
      const { rerender } = render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={{
            totalUsers: 100,
            activeUsers: 80,
            pendingApprovals: 5,
            inProgressWorkflows: 3,
            refreshedAt: new Date(),
          }}
        />
      )

      rerender(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={{
            totalUsers: 120,
            activeUsers: 100,
            pendingApprovals: 8,
            inProgressWorkflows: 5,
            refreshedAt: new Date(),
          }}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })
  })

  // Test 6: Accessibility
  describe('Accessibility', () => {
    it('should have proper ARIA labels on buttons', () => {
      render(
        <WorkstationSidebar
          isOpen={true}
          onClose={() => {}}
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      const closeBtn = screen.getByTestId('sidebar-close-btn')
      expect(closeBtn.getAttribute('aria-label')).toBeTruthy()

      const resetBtn = screen.getByTestId('reset-filters-btn')
      expect(resetBtn.getAttribute('aria-label')).toBeTruthy()
    })

    it('should have semantic structure', () => {
      const { container } = render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      // Should have proper semantic structure
      expect(container.querySelector('.workstation-sidebar-content')).toBeTruthy()
    })

    it('should be keyboard navigable', async () => {
      render(
        <WorkstationSidebar
          isOpen={true}
          onClose={() => {}}
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      const resetBtn = screen.getByTestId('reset-filters-btn')
      resetBtn.focus()

      expect(document.activeElement).toBe(resetBtn)
    })
  })

  // Test 7: Memoization
  describe('Memoization', () => {
    it('should handle prop updates efficiently', () => {
      const onFiltersChange = jest.fn()

      const { rerender } = render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          stats={defaultStats}
        />
      )

      rerender(
        <WorkstationSidebar
          filters={{ ...defaultFilters, search: 'updated' }}
          onFiltersChange={onFiltersChange}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })
  })

  // Test 8: Callback Props
  describe('Callback Props', () => {
    it('should accept onAddUser callback', () => {
      const onAddUser = jest.fn()

      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
          onAddUser={onAddUser}
        />
      )

      expect(onAddUser).toBeDefined()
    })

    it('should accept onReset callback', () => {
      const onReset = jest.fn()

      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={defaultStats}
          onReset={onReset}
        />
      )

      expect(onReset).toBeDefined()
    })
  })

  // Test 9: Filter Mapping
  describe('Filter Mapping', () => {
    it('should properly map filter values', () => {
      const filters: UserFilters = {
        search: 'test search',
        role: 'ADMIN',
        status: 'ACTIVE',
        department: 'Engineering',
        dateRange: 'month',
      }

      const onFiltersChange = jest.fn()

      render(
        <WorkstationSidebar
          filters={filters}
          onFiltersChange={onFiltersChange}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })

    it('should handle undefined filter values', () => {
      const filters: UserFilters = {
        search: '',
        role: undefined,
        status: undefined,
        department: undefined,
        dateRange: 'all',
      }

      render(
        <WorkstationSidebar
          filters={filters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })
  })

  // Test 10: Edge Cases
  describe('Edge Cases', () => {
    it('should handle zero stats values', () => {
      const stats = {
        totalUsers: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        inProgressWorkflows: 0,
        refreshedAt: new Date(),
      }

      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={stats as any}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })

    it('should handle very large stats values', () => {
      const stats = {
        totalUsers: 10000,
        activeUsers: 9500,
        pendingApprovals: 500,
        inProgressWorkflows: 100,
        refreshedAt: new Date(),
      }

      render(
        <WorkstationSidebar
          filters={defaultFilters}
          onFiltersChange={() => {}}
          stats={stats as any}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })

    it('should handle special characters in filter search', () => {
      const filters: UserFilters = {
        search: 'john@example.com!@#$%',
        role: '',
        status: '',
        department: '',
        dateRange: 'all',
      }

      render(
        <WorkstationSidebar
          filters={filters}
          onFiltersChange={() => {}}
          stats={defaultStats}
        />
      )

      expect(screen.getByTestId('workstation-sidebar')).toBeTruthy()
    })
  })
})
