'use client'

import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../../../../test-mocks/testing-library-react'
import { WorkstationMainContent } from '../WorkstationMainContent'

describe('WorkstationMainContent - Comprehensive Unit Tests', () => {
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ]

  const mockStats = {
    total: 3,
    clients: 1,
    staff: 1,
    admins: 1,
  }

  // Test 1: Basic Rendering
  describe('Basic Rendering', () => {
    it('should render main content area with all sections', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      // Sections should be present
      expect(screen.getByLabelText('Quick Actions')).toBeTruthy()
      expect(screen.getByLabelText('User Metrics')).toBeTruthy()
      expect(screen.getByLabelText('User Directory')).toBeTruthy()
    })

    it('should render quick actions bar with buttons', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByRole('button', { name: /Add new user/i })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Import/i })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Bulk/i })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Export/i })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Refresh/i })).toBeTruthy()
    })

    it('should render user directory section with title', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      const title = screen.getByText('User Directory')
      expect(title).toBeTruthy()
    })

    it('should render pagination section', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByLabelText('Pagination')).toBeTruthy()
    })
  })

  // Test 2: User List Display
  describe('User List Display', () => {
    it('should display user count when users provided', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('3 users')).toBeTruthy()
    })

    it('should display message when no users found', () => {
      render(
        <WorkstationMainContent
          users={[] as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText(/No users found/i)).toBeTruthy()
    })

    it('should show users loaded count in table placeholder', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText(/3 users loaded/i)).toBeTruthy()
    })

    it('should handle single user', () => {
      render(
        <WorkstationMainContent
          users={[mockUsers[0]] as any}
          stats={{ total: 1, clients: 1, staff: 0, admins: 0 } as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('1 users')).toBeTruthy()
    })
  })

  // Test 3: Loading State
  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={true}
        />
      )

      expect(screen.getByText(/Loading user directory/i)).toBeTruthy()
    })

    it('should hide users table when loading', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={true}
        />
      )

      const emptyState = screen.queryByText(/No users found/i)
      expect(emptyState).toBeFalsy()
    })

    it('should show users when loading completes', () => {
      const { rerender } = render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={true}
        />
      )

      expect(screen.getByText(/Loading user directory/i)).toBeTruthy()

      rerender(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.queryByText(/Loading user directory/i)).toBeFalsy()
      expect(screen.getByText('3 users')).toBeTruthy()
    })
  })

  // Test 4: Metrics Cards
  describe('Metrics Cards', () => {
    it('should display metrics when stats provided', () => {
      const stats = {
        total: 150,
        clients: 50,
        staff: 75,
        admins: 25,
      }

      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={stats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('Total Users')).toBeTruthy()
      expect(screen.getByText('150')).toBeTruthy()
    })

    it('should display all metric cards', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('Total Users')).toBeTruthy()
      expect(screen.getByText('Pending')).toBeTruthy()
      expect(screen.getByText('In Progress')).toBeTruthy()
      expect(screen.getByText('Due This Week')).toBeTruthy()
    })

    it('should handle missing stats gracefully', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={undefined}
          isLoading={false}
        />
      )

      expect(screen.getByText('User Directory')).toBeTruthy()
    })
  })

  // Test 5: Action Buttons
  describe('Action Buttons', () => {
    it('should call onAddUser when Add User button clicked', () => {
      const onAddUser = jest.fn()

      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
          onAddUser={onAddUser}
        />
      )

      const addBtn = screen.getByRole('button', { name: /Add new user/i })
      fireEvent.click(addBtn)

      expect(onAddUser).toHaveBeenCalled()
    })

    it('should call onImport when Import button clicked', () => {
      const onImport = jest.fn()

      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
          onImport={onImport}
        />
      )

      const importBtn = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importBtn)

      expect(onImport).toHaveBeenCalled()
    })

    it('should call onBulkOperation when Bulk button clicked', () => {
      const onBulkOperation = jest.fn()

      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
          onBulkOperation={onBulkOperation}
        />
      )

      const bulkBtn = screen.getByRole('button', { name: /Bulk/i })
      fireEvent.click(bulkBtn)

      expect(onBulkOperation).toHaveBeenCalled()
    })

    it('should call onExport when Export button clicked', () => {
      const onExport = jest.fn()

      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
          onExport={onExport}
        />
      )

      const exportBtn = screen.getByRole('button', { name: /Export/i })
      fireEvent.click(exportBtn)

      expect(onExport).toHaveBeenCalled()
    })

    it('should call onRefresh when Refresh button clicked', async () => {
      const onRefresh = jest.fn(async () => {})

      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
          onRefresh={onRefresh}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh/i })
      fireEvent.click(refreshBtn)

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled()
      })
    })

    it('should disable Refresh button while refreshing', async () => {
      const onRefresh = jest.fn(async () => {
        return new Promise(resolve => setTimeout(resolve, 100))
      })

      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
          onRefresh={onRefresh}
        />
      )

      const refreshBtn = screen.getByRole('button', { name: /Refresh/i }) as HTMLButtonElement
      fireEvent.click(refreshBtn)

      expect(refreshBtn.disabled).toBe(true)
    })
  })

  // Test 6: Pagination
  describe('Pagination', () => {
    it('should show correct page count', () => {
      const users = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
      }))

      render(
        <WorkstationMainContent
          users={users as any}
          stats={{ total: 100 } as any}
          isLoading={false}
        />
      )

      expect(screen.getByText(/Page 1 of 2/i)).toBeTruthy()
    })

    it('should show single page when users fit on one page', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText(/Page 1 of 1/i)).toBeTruthy()
    })

    it('should have navigation buttons', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByRole('button', { name: /Previous page/i })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Next page/i })).toBeTruthy()
    })
  })

  // Test 7: Accessibility
  describe('Accessibility', () => {
    it('should have proper semantic structure with main element', () => {
      const { container } = render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      const mainElement = container.querySelector('main')
      expect(mainElement).toBeTruthy()
    })

    it('should have ARIA labels on all sections', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByLabelText('Quick Actions')).toBeTruthy()
      expect(screen.getByLabelText('User Metrics')).toBeTruthy()
      expect(screen.getByLabelText('User Directory')).toBeTruthy()
      expect(screen.getByLabelText('Pagination')).toBeTruthy()
    })

    it('should have ARIA labels on action buttons', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByRole('button', { name: /Add new user/i })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Refresh user list/i })).toBeTruthy()
    })
  })

  // Test 8: Props Validation
  describe('Props Validation', () => {
    it('should accept all valid prop combinations', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
          onAddUser={() => {}}
          onImport={() => {}}
          onBulkOperation={() => {}}
          onExport={() => {}}
          onRefresh={async () => {}}
        />
      )

      expect(screen.getByText('User Directory')).toBeTruthy()
    })

    it('should handle missing optional props', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('User Directory')).toBeTruthy()
    })

    it('should handle undefined users', () => {
      render(
        <WorkstationMainContent
          users={undefined}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('User Directory')).toBeTruthy()
    })

    it('should handle undefined stats', () => {
      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={undefined}
          isLoading={false}
        />
      )

      expect(screen.getByText('User Directory')).toBeTruthy()
    })
  })

  // Test 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle empty user array', () => {
      render(
        <WorkstationMainContent
          users={[] as any}
          stats={{ total: 0 } as any}
          isLoading={false}
        />
      )

      expect(screen.getByText(/No users found/i)).toBeTruthy()
    })

    it('should handle very large user list', () => {
      const users = Array.from({ length: 10000 }, (_, i) => ({
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
      }))

      render(
        <WorkstationMainContent
          users={users as any}
          stats={{ total: 10000 } as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('10000 users')).toBeTruthy()
    })

    it('should handle users with special characters in names', () => {
      const users = [
        { id: '1', name: 'John O\'Brien', email: 'john@example.com' },
        { id: '2', name: '张三', email: 'zhang@example.com' },
        { id: '3', name: 'José García', email: 'jose@example.com' },
      ]

      render(
        <WorkstationMainContent
          users={users as any}
          stats={{ total: 3 } as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('3 users')).toBeTruthy()
    })

    it('should handle very large stat values', () => {
      const stats = {
        total: 1000000,
        clients: 500000,
        staff: 400000,
        admins: 100000,
      }

      render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={stats as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('1000000')).toBeTruthy()
    })
  })

  // Test 10: Memoization
  describe('Memoization', () => {
    it('should handle prop updates efficiently', () => {
      const { rerender } = render(
        <WorkstationMainContent
          users={mockUsers as any}
          stats={mockStats as any}
          isLoading={false}
        />
      )

      rerender(
        <WorkstationMainContent
          users={[...mockUsers, { id: '4', name: 'New User', email: 'new@example.com' }] as any}
          stats={{ total: 4, clients: 2, staff: 1, admins: 1 } as any}
          isLoading={false}
        />
      )

      expect(screen.getByText('4 users')).toBeTruthy()
    })
  })
})
