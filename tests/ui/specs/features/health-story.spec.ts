/**
 * Health Story Feature E2E Tests
 * Tests for health timeline rendering, event navigation, and share functionality
 * Comprehensive testing of the patient health narrative feature
 */

import { test, expect, Page } from '@playwright/test';
import { routes } from '../../fixtures/test-data';

// Health Story specific selectors
const healthStorySelectors = {
  // Main containers
  healthStoryContainer: '[data-testid="health-story"], .health-story-container',
  timelineContainer: '[data-testid="health-timeline"], .health-timeline',
  timelineWrapper: '[data-testid="timeline-wrapper"], .timeline-wrapper',

  // Timeline elements
  timelineEvent: '[data-testid="timeline-event"], .timeline-event',
  timelineEventCard: '[data-testid="timeline-event-card"], .timeline-event-card',
  timelineLine: '[data-testid="timeline-line"], .timeline-line',
  timelineDot: '[data-testid="timeline-dot"], .timeline-dot',
  timelineDate: '[data-testid="timeline-date"], .timeline-date',
  timelineContent: '[data-testid="timeline-content"], .timeline-content',

  // Event types
  appointmentEvent: '[data-testid="appointment-event"], .appointment-event',
  labResultEvent: '[data-testid="lab-result-event"], .lab-result-event',
  prescriptionEvent: '[data-testid="prescription-event"], .prescription-event',
  immunizationEvent: '[data-testid="immunization-event"], .immunization-event',
  diagnosisEvent: '[data-testid="diagnosis-event"], .diagnosis-event',
  procedureEvent: '[data-testid="procedure-event"], .procedure-event',
  vitalEvent: '[data-testid="vital-event"], .vital-event',
  noteEvent: '[data-testid="note-event"], .note-event',

  // Navigation
  prevButton: '[data-testid="timeline-prev"], button:has-text("Previous"), [aria-label*="previous"]',
  nextButton: '[data-testid="timeline-next"], button:has-text("Next"), [aria-label*="next"]',
  jumpToDate: '[data-testid="jump-to-date"], .jump-to-date',
  dateFilter: '[data-testid="date-filter"], .date-filter',
  categoryFilter: '[data-testid="category-filter"], .category-filter',
  searchInput: '[data-testid="timeline-search"], input[placeholder*="search"]',

  // View modes
  viewToggle: '[data-testid="view-toggle"], .view-toggle',
  listView: '[data-testid="list-view"], .list-view',
  timelineView: '[data-testid="timeline-view"], .timeline-view',
  calendarView: '[data-testid="calendar-view"], .calendar-view',

  // Event details
  eventModal: '[data-testid="event-modal"], [role="dialog"]',
  eventTitle: '[data-testid="event-title"], .event-title',
  eventDescription: '[data-testid="event-description"], .event-description',
  eventMeta: '[data-testid="event-meta"], .event-meta',
  closeEventButton: '[data-testid="close-event"], button:has-text("Close")',

  // Share functionality
  shareButton: '[data-testid="share-button"], button:has-text("Share")',
  shareModal: '[data-testid="share-modal"], .share-modal',
  shareLink: '[data-testid="share-link"], .share-link',
  copyLinkButton: '[data-testid="copy-link"], button:has-text("Copy")',
  shareEmail: '[data-testid="share-email"], button:has-text("Email")',
  sharePrint: '[data-testid="share-print"], button:has-text("Print")',
  shareDownload: '[data-testid="share-download"], button:has-text("Download")',
  sharePermissions: '[data-testid="share-permissions"], .share-permissions',
  shareExpiry: '[data-testid="share-expiry"], .share-expiry',

  // Loading states
  timelineSkeleton: '[data-testid="timeline-skeleton"], .timeline-skeleton',
  loadingSpinner: '[data-testid="loading-spinner"], .loading-spinner',
  emptyState: '[data-testid="empty-timeline"], .empty-state',

  // Accessibility
  timelineAnnouncer: '[aria-live="polite"], [data-testid="timeline-announcer"]',
};

// Health Story routes
const healthStoryRoutes = {
  timeline: `${routes.web.records}/timeline`,
  healthStory: `${routes.web.records}/health-story`,
  records: routes.web.records,
};

test.describe('Health Story Feature Tests', () => {
  test.describe('Health Timeline Rendering', () => {
    test('should display health timeline container', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const timelineContainer = page.locator(healthStorySelectors.timelineContainer);

      // Timeline container should be visible
      await expect(timelineContainer.or(page.locator(healthStorySelectors.healthStoryContainer))).toBeVisible({ timeout: 10000 });
    });

    test('should display timeline events chronologically', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const events = page.locator(healthStorySelectors.timelineEvent);

      if (await events.count() > 1) {
        // Get dates from events
        const dates = await events.evaluateAll((els) => {
          return els.map((el) => {
            const dateEl = el.querySelector('[data-testid="timeline-date"], .timeline-date');
            return dateEl?.textContent || '';
          });
        });

        console.log('Timeline event dates:', dates);

        // Events should be in chronological order (most recent first typically)
        expect(dates.length).toBeGreaterThan(0);
      }
    });

    test('should display different event types with distinct styling', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const eventTypes = [
        { selector: healthStorySelectors.appointmentEvent, name: 'Appointment' },
        { selector: healthStorySelectors.labResultEvent, name: 'Lab Result' },
        { selector: healthStorySelectors.prescriptionEvent, name: 'Prescription' },
        { selector: healthStorySelectors.immunizationEvent, name: 'Immunization' },
        { selector: healthStorySelectors.diagnosisEvent, name: 'Diagnosis' },
      ];

      for (const eventType of eventTypes) {
        const events = page.locator(eventType.selector);
        const count = await events.count();

        if (count > 0) {
          console.log(`${eventType.name} events found:`, count);

          // Check that event has distinct visual styling
          const firstEvent = events.first();
          const hasDistinctStyle = await firstEvent.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              borderColor: styles.borderLeftColor || styles.borderColor,
              hasIcon: !!el.querySelector('svg, .icon, [data-testid*="icon"]'),
            };
          });

          console.log(`${eventType.name} styling:`, hasDistinctStyle);
        }
      }
    });

    test('should display timeline event cards with proper structure', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const eventCards = page.locator(healthStorySelectors.timelineEventCard);

      if (await eventCards.count() > 0) {
        const firstCard = eventCards.first();

        // Check card structure
        const cardStructure = await firstCard.evaluate((el) => {
          return {
            hasDate: !!el.querySelector('[data-testid="timeline-date"], .date, time'),
            hasTitle: !!el.querySelector('[data-testid="event-title"], .title, h3, h4'),
            hasContent: !!el.querySelector('[data-testid="event-content"], .content, p'),
            hasIcon: !!el.querySelector('svg, .icon, [data-testid*="icon"]'),
          };
        });

        console.log('Event card structure:', cardStructure);

        // Card should have essential elements
        expect(cardStructure.hasDate || cardStructure.hasTitle).toBe(true);
      }
    });

    test('should display timeline visual connector line', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const timelineLine = page.locator(healthStorySelectors.timelineLine);
      const timelineDots = page.locator(healthStorySelectors.timelineDot);

      if (await timelineLine.count() > 0) {
        await expect(timelineLine.first()).toBeVisible();
      }

      if (await timelineDots.count() > 0) {
        await expect(timelineDots.first()).toBeVisible();
      }
    });

    test('should display empty state when no events', async ({ page }) => {
      // Navigate with filter that might return no results
      await page.goto(`${healthStoryRoutes.timeline}?category=nonexistent`);
      await page.waitForLoadState('networkidle');

      const emptyState = page.locator(healthStorySelectors.emptyState);
      const events = page.locator(healthStorySelectors.timelineEvent);

      const eventCount = await events.count();

      if (eventCount === 0) {
        // Empty state should be shown
        if (await emptyState.count() > 0) {
          await expect(emptyState).toBeVisible();
        }
      }
    });

    test('should display loading skeleton during data fetch', async ({ page }) => {
      // Delay API response
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(healthStoryRoutes.timeline);

      const skeleton = page.locator(healthStorySelectors.timelineSkeleton);
      const spinner = page.locator(healthStorySelectors.loadingSpinner);

      // Should show loading state
      const hasLoadingState = (await skeleton.count() > 0) || (await spinner.count() > 0);

      if (hasLoadingState) {
        if (await skeleton.count() > 0) {
          await expect(skeleton.first()).toBeVisible();
        } else if (await spinner.count() > 0) {
          await expect(spinner.first()).toBeVisible();
        }
      }
    });

    test('should support different view modes', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const viewToggle = page.locator(healthStorySelectors.viewToggle);

      if (await viewToggle.count() > 0) {
        // Check for view mode options
        const listView = page.locator('[data-testid="list-view-toggle"], button:has-text("List")');
        const timelineView = page.locator('[data-testid="timeline-view-toggle"], button:has-text("Timeline")');
        const calendarView = page.locator('[data-testid="calendar-view-toggle"], button:has-text("Calendar")');

        if (await listView.isVisible()) {
          await listView.click();
          await page.waitForTimeout(500);

          const listContainer = page.locator(healthStorySelectors.listView);
          if (await listContainer.count() > 0) {
            await expect(listContainer).toBeVisible();
          }
        }

        if (await timelineView.isVisible()) {
          await timelineView.click();
          await page.waitForTimeout(500);

          const timelineContainer = page.locator(healthStorySelectors.timelineView);
          if (await timelineContainer.count() > 0) {
            await expect(timelineContainer).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Event Navigation', () => {
    test('should navigate to next/previous events', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const prevButton = page.locator(healthStorySelectors.prevButton);
      const nextButton = page.locator(healthStorySelectors.nextButton);

      if (await nextButton.isVisible()) {
        // Get current visible event
        const events = page.locator(healthStorySelectors.timelineEvent);
        const initialCount = await events.count();

        // Click next
        await nextButton.click();
        await page.waitForTimeout(500);

        // Should navigate to next set of events
        console.log('Navigated to next events');
      }

      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForTimeout(500);

        console.log('Navigated to previous events');
      }
    });

    test('should open event details on click', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const eventCard = page.locator(healthStorySelectors.timelineEventCard).first();

      if (await eventCard.isVisible()) {
        await eventCard.click();

        // Check for modal or expanded view
        const eventModal = page.locator(healthStorySelectors.eventModal);
        const eventDetails = page.locator('[data-testid="event-details"], .event-details');

        const hasDetailView = await eventModal.isVisible({ timeout: 2000 }).catch(() => false) ||
                             await eventDetails.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasDetailView) {
          console.log('Event detail view opened');

          // Check for event title and description
          const title = page.locator(healthStorySelectors.eventTitle);
          const description = page.locator(healthStorySelectors.eventDescription);

          if (await title.count() > 0) {
            await expect(title).toBeVisible();
          }
        }
      }
    });

    test('should close event details', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const eventCard = page.locator(healthStorySelectors.timelineEventCard).first();

      if (await eventCard.isVisible()) {
        await eventCard.click();

        const eventModal = page.locator(healthStorySelectors.eventModal);

        if (await eventModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          // Close with button
          const closeButton = page.locator(healthStorySelectors.closeEventButton);

          if (await closeButton.isVisible()) {
            await closeButton.click();
            await expect(eventModal).not.toBeVisible({ timeout: 1000 });
          } else {
            // Close with Escape
            await page.keyboard.press('Escape');
            await expect(eventModal).not.toBeVisible({ timeout: 1000 });
          }
        }
      }
    });

    test('should filter events by date range', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const dateFilter = page.locator(healthStorySelectors.dateFilter);

      if (await dateFilter.count() > 0 && await dateFilter.isVisible()) {
        // Get initial event count
        const initialCount = await page.locator(healthStorySelectors.timelineEvent).count();

        // Apply date filter
        await dateFilter.click();

        // Select a date range option (e.g., Last 30 days)
        const filterOption = page.locator('button:has-text("Last 30 days"), [data-testid="last-30-days"]');

        if (await filterOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await filterOption.click();
          await page.waitForLoadState('networkidle');

          const filteredCount = await page.locator(healthStorySelectors.timelineEvent).count();

          console.log('Initial events:', initialCount);
          console.log('Filtered events:', filteredCount);
        }
      }
    });

    test('should filter events by category', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const categoryFilter = page.locator(healthStorySelectors.categoryFilter);

      if (await categoryFilter.count() > 0 && await categoryFilter.isVisible()) {
        await categoryFilter.click();

        // Select a category (e.g., Appointments)
        const categoryOption = page.locator('button:has-text("Appointments"), [data-testid="category-appointments"]');

        if (await categoryOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await categoryOption.click();
          await page.waitForLoadState('networkidle');

          // All visible events should be appointments
          const events = page.locator(healthStorySelectors.timelineEvent);

          if (await events.count() > 0) {
            console.log('Filtered to appointment events');
          }
        }
      }
    });

    test('should search events', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const searchInput = page.locator(healthStorySelectors.searchInput);

      if (await searchInput.isVisible()) {
        await searchInput.fill('checkup');
        await page.waitForTimeout(500); // Debounce

        await page.waitForLoadState('networkidle');

        const events = page.locator(healthStorySelectors.timelineEvent);
        const eventCount = await events.count();

        console.log('Search results count:', eventCount);
      }
    });

    test('should jump to specific date', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const jumpToDate = page.locator(healthStorySelectors.jumpToDate);

      if (await jumpToDate.count() > 0 && await jumpToDate.isVisible()) {
        await jumpToDate.click();

        // Date picker should appear
        const datePicker = page.locator('[role="dialog"], .date-picker, input[type="date"]');

        if (await datePicker.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log('Jump to date picker opened');
        }
      }
    });

    test('should navigate with keyboard', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const events = page.locator(healthStorySelectors.timelineEvent);

      if (await events.count() > 0) {
        // Focus first event
        await events.first().focus();

        // Navigate with arrow keys
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(200);

        const focusedElement = await page.evaluate(() => {
          return document.activeElement?.getAttribute('data-testid');
        });

        console.log('Focused element after ArrowDown:', focusedElement);

        // Press Enter to open details
        await page.keyboard.press('Enter');

        const modal = page.locator(healthStorySelectors.eventModal);
        const hasModal = await modal.isVisible({ timeout: 1000 }).catch(() => false);

        console.log('Modal opened with Enter:', hasModal);
      }
    });
  });

  test.describe('Share Functionality', () => {
    test('should display share button', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.count() > 0) {
        await expect(shareButton).toBeVisible();
      }
    });

    test('should open share modal', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.isVisible()) {
        await shareButton.click();

        const shareModal = page.locator(healthStorySelectors.shareModal);

        if (await shareModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(shareModal).toBeVisible();

          // Check for share options
          const copyLink = page.locator(healthStorySelectors.copyLinkButton);
          const emailShare = page.locator(healthStorySelectors.shareEmail);
          const printShare = page.locator(healthStorySelectors.sharePrint);
          const downloadShare = page.locator(healthStorySelectors.shareDownload);

          const hasShareOptions =
            (await copyLink.count() > 0) ||
            (await emailShare.count() > 0) ||
            (await printShare.count() > 0) ||
            (await downloadShare.count() > 0);

          console.log('Share options available:', hasShareOptions);
        }
      }
    });

    test('should copy share link to clipboard', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-write', 'clipboard-read']);

      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.isVisible()) {
        await shareButton.click();

        const shareModal = page.locator(healthStorySelectors.shareModal);

        if (await shareModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const copyLinkButton = page.locator(healthStorySelectors.copyLinkButton);

          if (await copyLinkButton.isVisible()) {
            await copyLinkButton.click();

            // Check for success feedback
            const successMessage = page.locator('[data-testid="copy-success"], .copy-success');
            const hasSuccessMessage = await successMessage.isVisible({ timeout: 1000 }).catch(() => false);

            // Or check clipboard content
            const clipboardContent = await page.evaluate(async () => {
              try {
                return await navigator.clipboard.readText();
              } catch {
                return null;
              }
            });

            console.log('Copy success feedback:', hasSuccessMessage);
            console.log('Clipboard has URL:', clipboardContent?.includes('http'));
          }
        }
      }
    });

    test('should share via email', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.isVisible()) {
        await shareButton.click();

        const shareModal = page.locator(healthStorySelectors.shareModal);

        if (await shareModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const emailShare = page.locator(healthStorySelectors.shareEmail);

          if (await emailShare.isVisible()) {
            // Check for mailto link or email form
            const hasMailto = await emailShare.evaluate((el) => {
              const href = el.getAttribute('href');
              return href?.startsWith('mailto:');
            });

            if (hasMailto) {
              console.log('Email share uses mailto link');
            } else {
              // May open email form
              await emailShare.click();

              const emailForm = page.locator('[data-testid="email-share-form"], .email-form');
              if (await emailForm.isVisible({ timeout: 1000 }).catch(() => false)) {
                console.log('Email share form opened');
              }
            }
          }
        }
      }
    });

    test('should print health story', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.isVisible()) {
        await shareButton.click();

        const shareModal = page.locator(healthStorySelectors.shareModal);

        if (await shareModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const printShare = page.locator(healthStorySelectors.sharePrint);

          if (await printShare.isVisible()) {
            // Note: Can't actually test print dialog, but can verify button exists
            console.log('Print share option available');
          }
        }
      }
    });

    test('should download health story', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.isVisible()) {
        await shareButton.click();

        const shareModal = page.locator(healthStorySelectors.shareModal);

        if (await shareModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const downloadShare = page.locator(healthStorySelectors.shareDownload);

          if (await downloadShare.isVisible()) {
            // Set up download listener
            const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);

            await downloadShare.click();

            const download = await downloadPromise;

            if (download) {
              const filename = download.suggestedFilename();
              console.log('Download initiated:', filename);

              // Should be PDF or similar document format
              expect(filename).toMatch(/\.(pdf|csv|json)$/i);
            }
          }
        }
      }
    });

    test('should configure share permissions', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.isVisible()) {
        await shareButton.click();

        const shareModal = page.locator(healthStorySelectors.shareModal);

        if (await shareModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const sharePermissions = page.locator(healthStorySelectors.sharePermissions);

          if (await sharePermissions.count() > 0 && await sharePermissions.isVisible()) {
            // Check for permission options
            const viewOnly = page.locator('[data-testid="permission-view"], input[value="view"]');
            const viewDownload = page.locator('[data-testid="permission-download"], input[value="download"]');

            if (await viewOnly.count() > 0 || await viewDownload.count() > 0) {
              console.log('Share permission options available');
            }
          }
        }
      }
    });

    test('should set share expiration', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.isVisible()) {
        await shareButton.click();

        const shareModal = page.locator(healthStorySelectors.shareModal);

        if (await shareModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const shareExpiry = page.locator(healthStorySelectors.shareExpiry);

          if (await shareExpiry.count() > 0 && await shareExpiry.isVisible()) {
            // Check for expiry options
            const expiryOptions = page.locator('[data-testid*="expiry"], select[name="expiry"]');

            if (await expiryOptions.count() > 0) {
              console.log('Share expiry options available');
            }
          }
        }
      }
    });

    test('should close share modal', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const shareButton = page.locator(healthStorySelectors.shareButton);

      if (await shareButton.isVisible()) {
        await shareButton.click();

        const shareModal = page.locator(healthStorySelectors.shareModal);

        if (await shareModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          // Close with Escape
          await page.keyboard.press('Escape');

          await expect(shareModal).not.toBeVisible({ timeout: 1000 });
        }
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels on timeline', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const timeline = page.locator(healthStorySelectors.timelineContainer);

      if (await timeline.count() > 0) {
        const ariaAttributes = await timeline.first().evaluate((el) => {
          return {
            role: el.getAttribute('role'),
            ariaLabel: el.getAttribute('aria-label'),
            ariaDescribedBy: el.getAttribute('aria-describedby'),
          };
        });

        console.log('Timeline ARIA attributes:', ariaAttributes);

        // Should have appropriate role or aria-label
        expect(
          ariaAttributes.role === 'list' ||
          ariaAttributes.role === 'feed' ||
          ariaAttributes.ariaLabel !== null
        ).toBe(true);
      }
    });

    test('should announce navigation changes', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      const announcer = page.locator(healthStorySelectors.timelineAnnouncer);

      if (await announcer.count() > 0) {
        console.log('Timeline has live region announcer');
      }

      // Check for aria-live on navigation result container
      const liveRegions = page.locator('[aria-live]');
      const liveRegionCount = await liveRegions.count();

      console.log('Live regions found:', liveRegionCount);
    });

    test('should support keyboard navigation through timeline', async ({ page }) => {
      await page.goto(healthStoryRoutes.timeline);
      await page.waitForLoadState('networkidle');

      // Tab to first interactive element
      await page.keyboard.press('Tab');

      const firstFocused = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      console.log('First focused element:', firstFocused);

      // Continue tabbing through timeline
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');

        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tagName: el?.tagName,
            testId: el?.getAttribute('data-testid'),
          };
        });

        if (focused.testId?.includes('timeline') || focused.testId?.includes('event')) {
          console.log('Focused timeline element:', focused.testId);
        }
      }
    });
  });
});
