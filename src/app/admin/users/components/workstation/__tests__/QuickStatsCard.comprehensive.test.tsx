'use client'

import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../../../../test-mocks/testing-library-react'
import { QuickStatsCard } from '../QuickStatsCard'
import { SavedViewsButtons } from '../SavedViewsButtons'
import type { QuickStatsData } from '../../../types/workstation'

describe('QuickStatsCard - Comprehensive Unit Tests', () => {
  const mockStats: QuickStatsData = {
    totalUsers: 150,
    activeUsers: 120,
    pendingApprovals: 10,
    inProgressWorkflows: 5,
    refreshedAt: new Date(),
  }

  describe('QuickStatsCard Rendering', () => {
    it('should render stats card with all metrics', () => {
      render(
        <QuickStatsCard
          stats={mockStats}
          isRefreshing={false}
          onRefresh={async () => {}}
        />
      )

      expect(screen.getByText('Total Users')).toBeTruthy()
      expect(screen.getByText('Active')).toBeTruthy()
      expect(screen.getByText('Pending')).toBeTruthy()
      expect(screen.getByText('Workflows')).toBeTruthy()
    })

    it('should display correct stat values', () => {
      render(
        <QuickStatsCard
          stats={mockStats}
          isRefreshing={false}
        />
      )

      expect(screen.getByText('150')).toBeTruthy()
      expect(screen.getByText('120')).toBeTruthy()
      expect(screen.getByText('10')).toBeTruthy()
      expect(screen.getByText('5')).toBeTruthy()
    })

    it('should display "Loading..." when stats not provided', () => {
      render(
        <QuickStatsCard
          stats={undefined}
          isRefreshing={false}
        />
      )

      expect(screen.getByText('Loading...')).toBeTruthy()
    })

    it('should handle zero values', () => {
      const zeroStats: QuickStatsData = {
        totalUsers: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        inProgressWorkflows: 0,
        refreshedAt: new Date(),
      }

      render(
        <QuickStatsCard
          stats={zeroStats}
          isRefreshing={false}
        />
      )

      expect(screen.getByText('0')).toBeTruthy()
    })
  })

  describe('QuickStatsCard Refresh Button', () => {
    it('should render refresh button', () => {
      render(
        <QuickStatsCard
          stats={mockStats}
          isRefreshing={false}
          onRefresh={async () => {}}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh statistics/i })
      expect(refreshBtn).toBeTruthy()
    })

    it('should call onRefresh when button clicked', async () => {
      const onRefresh = jest.fn(async () => {})

      render(
        <QuickStatsCard
          stats={mockStats}
          isRefreshing={false}
          onRefresh={onRefresh}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh statistics/i })
      fireEvent.click(refreshBtn)

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled()
      })
    })

    it('should disable refresh button when isRefreshing is true', () => {
      render(
        <QuickStatsCard
          stats={mockStats}
          isRefreshing={true}
          onRefresh={async () => {}}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh statistics/i }) as HTMLButtonElement
      expect(refreshBtn.disabled).toBe(true)
    })

    it('should disable refresh button while loading', async () => {
      const onRefresh = jest.fn(async () => {
        return new Promise(resolve => setTimeout(resolve, 50))
      })

      render(
        <QuickStatsCard
          stats={mockStats}
          isRefreshing={false}
          onRefresh={onRefresh}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh statistics/i }) as HTMLButtonElement
      fireEvent.click(refreshBtn)

      expect(refreshBtn.disabled).toBe(true)

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled()
      })
    })

    it('should handle refresh errors gracefully', async () => {
      const onRefresh = jest.fn(async () => {
        throw new Error('Refresh failed')
      })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <QuickStatsCard
          stats={mockStats}
          isRefreshing={false}
          onRefresh={onRefresh}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh statistics/i })
      fireEvent.click(refreshBtn)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled()
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('QuickStatsCard Time Formatting', () => {
    it('should display "Just now" for recent updates', () => {
      const recentStats: QuickStatsData = {
        ...mockStats,
        refreshedAt: new Date(),
      }

      render(
        <QuickStatsCard
          stats={recentStats}
          isRefreshing={false}
        />
      )

      expect(screen.getByText(/Updated Just now/i)).toBeTruthy()
    })

    it('should display time ago format', () => {
      const pastDate = new Date()
      pastDate.setMinutes(pastDate.getMinutes() - 5)

      const stats: QuickStatsData = {
        ...mockStats,
        refreshedAt: pastDate,
      }

      render(
        <QuickStatsCard
          stats={stats}
          isRefreshing={false}
        />
      )

      // Should show "5m ago" or similar
      const updatedText = screen.getByText(/Updated/i)
      expect(updatedText).toBeTruthy()
    })
  })

  describe('QuickStatsCard Props', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <QuickStatsCard
          stats={mockStats}
          className="custom-class"
        />
      )

      const card = container.querySelector('.quick-stats-card.custom-class')
      expect(card).toBeTruthy()
    })

    it('should handle missing onRefresh prop', () => {
      render(
        <QuickStatsCard
          stats={mockStats}
          isRefreshing={false}
        />
      )

      // Should render without errors
      expect(screen.getByText('Total Users')).toBeTruthy()
    })
  })

  describe('QuickStatsCard Accessibility', () => {
    it('should have accessible refresh button', () => {
      render(
        <QuickStatsCard
          stats={mockStats}
          onRefresh={async () => {}}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh statistics/i })
      expect(refreshBtn).toBeTruthy()
      expect(refreshBtn.getAttribute('aria-label')).toBeTruthy()
    })

    it('should be keyboard navigable', async () => {
      render(
        <QuickStatsCard
          stats={mockStats}
          onRefresh={async () => {}}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh statistics/i })
      refreshBtn.focus()

      expect(document.activeElement).toBe(refreshBtn)
    })
  })
})

describe('SavedViewsButtons - Comprehensive Unit Tests', () => {
  const mockViewCounts = {
    all: 150,
    clients: 50,
    team: 75,
    admins: 25,
  }

  describe('SavedViewsButtons Rendering', () => {
    it('should render all four view buttons', () => {
      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      expect(screen.getByTestId('view-btn-all')).toBeTruthy()
      expect(screen.getByTestId('view-btn-clients')).toBeTruthy()
      expect(screen.getByTestId('view-btn-team')).toBeTruthy()
      expect(screen.getByTestId('view-btn-admins')).toBeTruthy()
    })

    it('should display button labels', () => {
      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      expect(screen.getByText('All Users')).toBeTruthy()
      expect(screen.getByText('Clients')).toBeTruthy()
      expect(screen.getByText('Team')).toBeTruthy()
      expect(screen.getByText('Admins')).toBeTruthy()
    })

    it('should display user counts on buttons', () => {
      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      expect(screen.getByText('150')).toBeTruthy()
      expect(screen.getByText('50')).toBeTruthy()
      expect(screen.getByText('75')).toBeTruthy()
      expect(screen.getByText('25')).toBeTruthy()
    })

    it('should display "99+" for very large counts', () => {
      const largeCounts = {
        all: 10000,
        clients: 5000,
        team: 7500,
        admins: 2500,
      }

      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={largeCounts}
        />
      )

      expect(screen.getByText('99+')).toBeTruthy()
    })
  })

  describe('SavedViewsButtons Active State', () => {
    it('should mark active view correctly', () => {
      render(
        <SavedViewsButtons
          activeView="clients"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      const clientsBtn = screen.getByTestId('view-btn-clients')
      expect(clientsBtn.className).toContain('active')
    })

    it('should update active state when prop changes', () => {
      const { rerender } = render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      let allBtn = screen.getByTestId('view-btn-all')
      expect(allBtn.className).toContain('active')

      rerender(
        <SavedViewsButtons
          activeView="team"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      const teamBtn = screen.getByTestId('view-btn-team')
      expect(teamBtn.className).toContain('active')
    })

    it('should have aria-pressed attribute set correctly', () => {
      render(
        <SavedViewsButtons
          activeView="admins"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      const adminsBtn = screen.getByTestId('view-btn-admins')
      expect(adminsBtn.getAttribute('aria-pressed')).toBe('true')

      const clientsBtn = screen.getByTestId('view-btn-clients')
      expect(clientsBtn.getAttribute('aria-pressed')).toBe('false')
    })
  })

  describe('SavedViewsButtons Click Handlers', () => {
    it('should call onViewChange with view name and role filter', () => {
      const onViewChange = jest.fn()

      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={onViewChange}
          viewCounts={mockViewCounts}
        />
      )

      const clientsBtn = screen.getByTestId('view-btn-clients')
      fireEvent.click(clientsBtn)

      expect(onViewChange).toHaveBeenCalledWith('clients', 'CLIENT')
    })

    it('should call onViewChange with undefined role for All Users', () => {
      const onViewChange = jest.fn()

      render(
        <SavedViewsButtons
          activeView="clients"
          onViewChange={onViewChange}
          viewCounts={mockViewCounts}
        />
      )

      const allBtn = screen.getByTestId('view-btn-all')
      fireEvent.click(allBtn)

      expect(onViewChange).toHaveBeenCalledWith('all', undefined)
    })

    it('should call onViewChange for each view button', () => {
      const onViewChange = jest.fn()

      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={onViewChange}
          viewCounts={mockViewCounts}
        />
      )

      fireEvent.click(screen.getByTestId('view-btn-clients'))
      expect(onViewChange).toHaveBeenCalledWith('clients', 'CLIENT')

      fireEvent.click(screen.getByTestId('view-btn-team'))
      expect(onViewChange).toHaveBeenCalledWith('team', 'TEAM')

      fireEvent.click(screen.getByTestId('view-btn-admins'))
      expect(onViewChange).toHaveBeenCalledWith('admins', 'ADMIN')
    })

    it('should handle rapid button clicks', () => {
      const onViewChange = jest.fn()

      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={onViewChange}
          viewCounts={mockViewCounts}
        />
      )

      const clientsBtn = screen.getByTestId('view-btn-clients')
      fireEvent.click(clientsBtn)
      fireEvent.click(clientsBtn)
      fireEvent.click(clientsBtn)

      expect(onViewChange).toHaveBeenCalledTimes(3)
    })
  })

  describe('SavedViewsButtons Props', () => {
    it('should handle missing viewCounts', () => {
      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
        />
      )

      expect(screen.getByTestId('view-btn-all')).toBeTruthy()
    })

    it('should accept custom className', () => {
      const { container } = render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
          className="custom-class"
        />
      )

      const section = container.querySelector('.custom-class')
      expect(section).toBeTruthy()
    })

    it('should have default activeView of "all"', () => {
      render(
        <SavedViewsButtons
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      const allBtn = screen.getByTestId('view-btn-all')
      expect(allBtn.className).toContain('active')
    })
  })

  describe('SavedViewsButtons Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      const clientsBtn = screen.getByTestId('view-btn-clients')
      expect(clientsBtn.getAttribute('aria-label')).toContain('Clients')
      expect(clientsBtn.getAttribute('aria-label')).toContain('50')
    })

    it('should be keyboard navigable', () => {
      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      const teamBtn = screen.getByTestId('view-btn-team')
      teamBtn.focus()

      expect(document.activeElement).toBe(teamBtn)
    })

    it('should have title attributes with descriptions', () => {
      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={mockViewCounts}
        />
      )

      const teamBtn = screen.getByTestId('view-btn-team')
      expect(teamBtn.getAttribute('title')).toBeTruthy()
    })
  })

  describe('SavedViewsButtons Edge Cases', () => {
    it('should handle zero user counts', () => {
      const zeroCounts = {
        all: 0,
        clients: 0,
        team: 0,
        admins: 0,
      }

      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={zeroCounts}
        />
      )

      expect(screen.getByTestId('view-btn-all')).toBeTruthy()
    })

    it('should handle undefined viewCounts properties', () => {
      const incompleteCounts = {
        all: 100,
        clients: undefined,
        team: 50,
      }

      render(
        <SavedViewsButtons
          activeView="all"
          onViewChange={() => {}}
          viewCounts={incompleteCounts as any}
        />
      )

      expect(screen.getByTestId('view-btn-all')).toBeTruthy()
    })
  })
})
