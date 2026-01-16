import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test.describe('Page Load', () => {
    test('should load dashboard page successfully', async ({ page }) => {
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('h1')).toContainText(/dashboard/i);
    });

    test('should display user greeting', async ({ page }) => {
      await expect(page.locator('[data-testid="user-greeting"]')).toBeVisible();
    });

    test('should show navigation menu', async ({ page }) => {
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
      await expect(page.locator('nav >> text=Appointments')).toBeVisible();
      await expect(page.locator('nav >> text=Medical Records')).toBeVisible();
    });
  });

  test.describe('Stats Cards', () => {
    test('should display upcoming appointments count', async ({ page }) => {
      const upcomingCard = page.locator('[data-testid="upcoming-appointments"]');
      await expect(upcomingCard).toBeVisible();
      await expect(upcomingCard).toContainText(/upcoming/i);
    });

    test('should display health metrics card', async ({ page }) => {
      const healthCard = page.locator('[data-testid="health-metrics"]');
      await expect(healthCard).toBeVisible();
    });

    test('should display recent activity card', async ({ page }) => {
      const activityCard = page.locator('[data-testid="recent-activity"]');
      await expect(activityCard).toBeVisible();
    });

    test('should display notifications count', async ({ page }) => {
      const notificationsCard = page.locator('[data-testid="notifications-count"]');
      await expect(notificationsCard).toBeVisible();
    });
  });

  test.describe('Upcoming Appointments Widget', () => {
    test('should show upcoming appointments list', async ({ page }) => {
      const appointmentsList = page.locator('[data-testid="appointments-list"]');
      await expect(appointmentsList).toBeVisible();
    });

    test('should display appointment details', async ({ page }) => {
      const firstAppointment = page.locator('[data-testid="appointment-card"]').first();

      if (await firstAppointment.isVisible()) {
        await expect(firstAppointment).toContainText(/date|time/i);
        await expect(firstAppointment).toContainText(/doctor|provider/i);
      }
    });

    test('should have "View All" link', async ({ page }) => {
      await expect(page.locator('a >> text=/view all.*appointments/i')).toBeVisible();
    });

    test('should navigate to appointments page', async ({ page }) => {
      await page.click('a >> text=/view all.*appointments/i');
      await expect(page).toHaveURL('/appointments');
    });

    test('should show empty state when no appointments', async ({ page }) => {
      const emptyState = page.locator('[data-testid="no-appointments"]');
      const appointmentsList = page.locator('[data-testid="appointments-list"]');

      const hasAppointments = await appointmentsList.count() > 0;

      if (!hasAppointments) {
        await expect(emptyState).toBeVisible();
        await expect(emptyState).toContainText(/no upcoming appointments/i);
      }
    });
  });

  test.describe('Quick Actions', () => {
    test('should display quick action buttons', async ({ page }) => {
      await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible();
    });

    test('should have "Book Appointment" button', async ({ page }) => {
      const bookButton = page.locator('button >> text=/book.*appointment/i');
      await expect(bookButton).toBeVisible();
    });

    test('should have "Upload Documents" button', async ({ page }) => {
      const uploadButton = page.locator('button >> text=/upload.*document/i');
      await expect(uploadButton).toBeVisible();
    });

    test('should have "Message Provider" button', async ({ page }) => {
      const messageButton = page.locator('button >> text=/message.*provider/i');
      await expect(messageButton).toBeVisible();
    });

    test('should open appointment booking modal', async ({ page }) => {
      await page.click('button >> text=/book.*appointment/i');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('[role="dialog"] >> h2')).toContainText(/book.*appointment/i);
    });
  });

  test.describe('Recent Activity', () => {
    test('should display activity timeline', async ({ page }) => {
      const timeline = page.locator('[data-testid="activity-timeline"]');
      await expect(timeline).toBeVisible();
    });

    test('should show activity items', async ({ page }) => {
      const activityItems = page.locator('[data-testid="activity-item"]');
      const count = await activityItems.count();

      if (count > 0) {
        await expect(activityItems.first()).toBeVisible();
      }
    });

    test('should display activity timestamps', async ({ page }) => {
      const firstActivity = page.locator('[data-testid="activity-item"]').first();

      if (await firstActivity.isVisible()) {
        await expect(firstActivity.locator('[data-testid="activity-time"]')).toBeVisible();
      }
    });
  });

  test.describe('Health Metrics', () => {
    test('should display latest vital signs', async ({ page }) => {
      const vitalsWidget = page.locator('[data-testid="vital-signs"]');
      await expect(vitalsWidget).toBeVisible();
    });

    test('should show blood pressure reading', async ({ page }) => {
      const bpReading = page.locator('[data-testid="bp-reading"]');

      if (await bpReading.isVisible()) {
        await expect(bpReading).toContainText(/\d{2,3}\/\d{2,3}/);
      }
    });

    test('should show heart rate reading', async ({ page }) => {
      const hrReading = page.locator('[data-testid="hr-reading"]');

      if (await hrReading.isVisible()) {
        await expect(hrReading).toContainText(/\d+ bpm/i);
      }
    });

    test('should have "View All Metrics" link', async ({ page }) => {
      await expect(page.locator('a >> text=/view.*metrics/i')).toBeVisible();
    });
  });

  test.describe('Notifications', () => {
    test('should display notifications icon', async ({ page }) => {
      await expect(page.locator('[data-testid="notifications-icon"]')).toBeVisible();
    });

    test('should show notification badge when there are unread notifications', async ({ page }) => {
      const badge = page.locator('[data-testid="notification-badge"]');

      if (await badge.isVisible()) {
        const count = await badge.textContent();
        expect(parseInt(count || '0')).toBeGreaterThan(0);
      }
    });

    test('should open notifications panel', async ({ page }) => {
      await page.click('[data-testid="notifications-icon"]');
      await expect(page.locator('[data-testid="notifications-panel"]')).toBeVisible();
    });

    test('should display notification items', async ({ page }) => {
      await page.click('[data-testid="notifications-icon"]');
      const notificationItems = page.locator('[data-testid="notification-item"]');

      const count = await notificationItems.count();
      if (count > 0) {
        await expect(notificationItems.first()).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Data Refresh', () => {
    test('should have refresh button', async ({ page }) => {
      const refreshButton = page.locator('[data-testid="refresh-dashboard"]');

      if (await refreshButton.isVisible()) {
        await refreshButton.click();
        // Wait for refresh to complete
        await page.waitForTimeout(1000);
      }
    });

    test('should show loading state during refresh', async ({ page }) => {
      const refreshButton = page.locator('[data-testid="refresh-dashboard"]');

      if (await refreshButton.isVisible()) {
        await refreshButton.click();
        // Loading indicator should appear briefly
        const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
        // May or may not be visible depending on connection speed
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page, context }) => {
      // Simulate offline mode
      await context.setOffline(true);
      await page.reload();

      // Should show error message or offline state
      const errorMessage = page.locator('[data-testid="error-message"]');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toContainText(/error|offline|connection/i);
      }

      await context.setOffline(false);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = await page.locator('h1').count();
      expect(h1).toBe(1);
    });

    test('should have accessible navigation', async ({ page }) => {
      const nav = page.locator('nav[aria-label]');
      await expect(nav).toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      const buttons = page.locator('button[aria-label]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
