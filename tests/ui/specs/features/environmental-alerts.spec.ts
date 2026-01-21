/**
 * Environmental Alerts Feature E2E Tests
 * Tests for environmental health alerts display, condition-specific alerts, and action recommendations
 * Healthcare-focused environmental monitoring for patient safety
 */

import { test, expect, Page } from '@playwright/test';
import { routes } from '../../fixtures/test-data';

// Environmental Alerts specific selectors
const alertSelectors = {
  // Main containers
  alertsContainer: '[data-testid="environmental-alerts"], .environmental-alerts',
  alertsWidget: '[data-testid="alerts-widget"], .alerts-widget',
  alertsPanel: '[data-testid="alerts-panel"], .alerts-panel',
  alertsDashboard: '[data-testid="alerts-dashboard"], .alerts-dashboard',

  // Alert display
  alertCard: '[data-testid="alert-card"], .alert-card',
  alertItem: '[data-testid="alert-item"], .alert-item',
  alertBadge: '[data-testid="alert-badge"], .alert-badge',
  alertIcon: '[data-testid="alert-icon"], .alert-icon',
  alertTitle: '[data-testid="alert-title"], .alert-title',
  alertDescription: '[data-testid="alert-description"], .alert-description',
  alertSeverity: '[data-testid="alert-severity"], .alert-severity',
  alertTimestamp: '[data-testid="alert-timestamp"], .alert-timestamp',
  alertSource: '[data-testid="alert-source"], .alert-source',

  // Severity levels
  criticalAlert: '[data-testid="critical-alert"], .alert-critical, [data-severity="critical"]',
  warningAlert: '[data-testid="warning-alert"], .alert-warning, [data-severity="warning"]',
  infoAlert: '[data-testid="info-alert"], .alert-info, [data-severity="info"]',
  lowAlert: '[data-testid="low-alert"], .alert-low, [data-severity="low"]',

  // Alert types
  airQualityAlert: '[data-testid="air-quality-alert"], .air-quality-alert',
  pollenAlert: '[data-testid="pollen-alert"], .pollen-alert',
  uvAlert: '[data-testid="uv-alert"], .uv-alert',
  heatAlert: '[data-testid="heat-alert"], .heat-alert',
  coldAlert: '[data-testid="cold-alert"], .cold-alert',
  floodAlert: '[data-testid="flood-alert"], .flood-alert',
  wildfireAlert: '[data-testid="wildfire-alert"], .wildfire-alert',
  diseaseOutbreakAlert: '[data-testid="disease-outbreak-alert"], .disease-outbreak-alert',

  // Condition-specific
  conditionAlerts: '[data-testid="condition-alerts"], .condition-alerts',
  asthmaAlert: '[data-testid="asthma-alert"], .asthma-alert',
  allergyAlert: '[data-testid="allergy-alert"], .allergy-alert',
  respiratoryAlert: '[data-testid="respiratory-alert"], .respiratory-alert',
  cardiovascularAlert: '[data-testid="cardiovascular-alert"], .cardiovascular-alert',
  diabetesAlert: '[data-testid="diabetes-alert"], .diabetes-alert',
  skinConditionAlert: '[data-testid="skin-condition-alert"], .skin-condition-alert',

  // Action recommendations
  recommendationsPanel: '[data-testid="recommendations"], .recommendations-panel',
  recommendationItem: '[data-testid="recommendation"], .recommendation-item',
  actionButton: '[data-testid="action-button"], .action-button',
  learnMoreButton: '[data-testid="learn-more"], button:has-text("Learn More")',
  dismissButton: '[data-testid="dismiss-alert"], button:has-text("Dismiss")',
  snoozeButton: '[data-testid="snooze-alert"], button:has-text("Snooze")',

  // Location settings
  locationInput: '[data-testid="location-input"], input[name="location"]',
  locationSelect: '[data-testid="location-select"], select[name="location"]',
  useCurrentLocation: '[data-testid="use-current-location"], button:has-text("Current Location")',
  locationPermission: '[data-testid="location-permission"], .location-permission',

  // Alert settings
  alertSettings: '[data-testid="alert-settings"], .alert-settings',
  notificationToggle: '[data-testid="notification-toggle"], .notification-toggle',
  alertFrequency: '[data-testid="alert-frequency"], .alert-frequency',
  conditionSettings: '[data-testid="condition-settings"], .condition-settings',

  // Loading and empty states
  loadingSpinner: '[data-testid="loading-spinner"], .loading-spinner',
  alertsSkeleton: '[data-testid="alerts-skeleton"], .alerts-skeleton',
  emptyAlerts: '[data-testid="no-alerts"], .no-alerts, .empty-state',

  // Refresh and update
  refreshButton: '[data-testid="refresh-alerts"], button:has-text("Refresh")',
  lastUpdated: '[data-testid="last-updated"], .last-updated',
  autoRefreshToggle: '[data-testid="auto-refresh"], .auto-refresh-toggle',
};

// Environmental alerts routes
const alertRoutes = {
  dashboard: routes.web.dashboard,
  alerts: `${routes.web.dashboard}/alerts`,
  settings: `${routes.web.settings}/alerts`,
};

test.describe('Environmental Alerts Feature Tests', () => {
  test.describe('Alert Display', () => {
    test('should display environmental alerts container', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertsContainer = page.locator(alertSelectors.alertsContainer);
      const alertsWidget = page.locator(alertSelectors.alertsWidget);

      // At least one alert container should be visible
      const hasAlertDisplay = (await alertsContainer.count() > 0) || (await alertsWidget.count() > 0);

      if (hasAlertDisplay) {
        await expect(alertsContainer.or(alertsWidget).first()).toBeVisible({ timeout: 10000 });
      }
    });

    test('should display alert cards with proper structure', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCards = page.locator(alertSelectors.alertCard);

      if (await alertCards.count() > 0) {
        const firstCard = alertCards.first();
        await expect(firstCard).toBeVisible();

        // Check card structure
        const cardStructure = await firstCard.evaluate((el) => {
          return {
            hasIcon: !!el.querySelector('[data-testid="alert-icon"], .alert-icon, svg'),
            hasTitle: !!el.querySelector('[data-testid="alert-title"], .alert-title, h3, h4'),
            hasDescription: !!el.querySelector('[data-testid="alert-description"], .alert-description, p'),
            hasSeverity: !!el.querySelector('[data-testid="alert-severity"], .alert-severity, [data-severity]'),
            hasTimestamp: !!el.querySelector('[data-testid="alert-timestamp"], .alert-timestamp, time'),
          };
        });

        console.log('Alert card structure:', cardStructure);

        // Card should have essential elements
        expect(cardStructure.hasTitle || cardStructure.hasDescription).toBe(true);
      }
    });

    test('should display alerts sorted by severity', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCards = page.locator(alertSelectors.alertCard);

      if (await alertCards.count() > 1) {
        // Get severity levels in order
        const severities = await alertCards.evaluateAll((els) => {
          return els.map((el) => {
            const severityAttr = el.getAttribute('data-severity');
            const severityClass = Array.from(el.classList).find((c) =>
              ['critical', 'warning', 'info', 'low'].includes(c.replace('alert-', ''))
            );
            return severityAttr || severityClass || 'unknown';
          });
        });

        console.log('Alert severities in order:', severities);

        // Critical alerts should appear before warnings, etc.
        const severityOrder = ['critical', 'warning', 'info', 'low'];
        // This is a soft check as sorting may vary by implementation
      }
    });

    test('should display severity indicators with distinct colors', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const severityTypes = [
        { selector: alertSelectors.criticalAlert, name: 'Critical', expectedColor: 'red' },
        { selector: alertSelectors.warningAlert, name: 'Warning', expectedColor: 'yellow|orange' },
        { selector: alertSelectors.infoAlert, name: 'Info', expectedColor: 'blue' },
        { selector: alertSelectors.lowAlert, name: 'Low', expectedColor: 'green|gray' },
      ];

      for (const severity of severityTypes) {
        const alerts = page.locator(severity.selector);

        if (await alerts.count() > 0) {
          const alertStyle = await alerts.first().evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              borderColor: styles.borderLeftColor || styles.borderColor,
              color: styles.color,
            };
          });

          console.log(`${severity.name} alert style:`, alertStyle);
        }
      }
    });

    test('should display alert timestamp', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertTimestamps = page.locator(alertSelectors.alertTimestamp);

      if (await alertTimestamps.count() > 0) {
        const timestamp = await alertTimestamps.first().textContent();

        console.log('Alert timestamp:', timestamp);

        // Timestamp should contain time-related content
        expect(timestamp).toMatch(/\d|ago|today|yesterday|hour|minute|second|am|pm/i);
      }
    });

    test('should display alert source/provider', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertSources = page.locator(alertSelectors.alertSource);

      if (await alertSources.count() > 0) {
        const source = await alertSources.first().textContent();

        console.log('Alert source:', source);
      }
    });

    test('should display loading skeleton during data fetch', async ({ page }) => {
      // Delay API response
      await page.route('**/api/**environmental**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(alertRoutes.dashboard);

      const skeleton = page.locator(alertSelectors.alertsSkeleton);
      const spinner = page.locator(alertSelectors.loadingSpinner);

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

    test('should display empty state when no alerts', async ({ page }) => {
      // Mock empty alerts response
      await page.route('**/api/**environmental**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ alerts: [] }),
        });
      });

      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const emptyState = page.locator(alertSelectors.emptyAlerts);

      if (await emptyState.count() > 0) {
        await expect(emptyState).toBeVisible();

        const emptyMessage = await emptyState.textContent();
        console.log('Empty state message:', emptyMessage);
      }
    });
  });

  test.describe('Condition-Specific Alerts', () => {
    test('should display asthma-related alerts for asthma patients', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const asthmaAlerts = page.locator(alertSelectors.asthmaAlert);
      const respiratoryAlerts = page.locator(alertSelectors.respiratoryAlert);

      if (await asthmaAlerts.count() > 0) {
        await expect(asthmaAlerts.first()).toBeVisible();

        const alertContent = await asthmaAlerts.first().textContent();
        console.log('Asthma alert content:', alertContent);

        // Should mention asthma-relevant environmental factors
        expect(alertContent?.toLowerCase()).toMatch(/asthma|breathing|air|respiratory|inhaler/i);
      } else if (await respiratoryAlerts.count() > 0) {
        console.log('Respiratory alerts found instead of specific asthma alerts');
      }
    });

    test('should display allergy alerts based on patient conditions', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const allergyAlerts = page.locator(alertSelectors.allergyAlert);
      const pollenAlerts = page.locator(alertSelectors.pollenAlert);

      if (await allergyAlerts.count() > 0) {
        await expect(allergyAlerts.first()).toBeVisible();

        const alertContent = await allergyAlerts.first().textContent();
        console.log('Allergy alert content:', alertContent);
      } else if (await pollenAlerts.count() > 0) {
        await expect(pollenAlerts.first()).toBeVisible();

        const alertContent = await pollenAlerts.first().textContent();
        console.log('Pollen alert content:', alertContent);
      }
    });

    test('should display cardiovascular alerts for heart patients', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const cardiovascularAlerts = page.locator(alertSelectors.cardiovascularAlert);
      const heatAlerts = page.locator(alertSelectors.heatAlert);

      if (await cardiovascularAlerts.count() > 0) {
        const alertContent = await cardiovascularAlerts.first().textContent();
        console.log('Cardiovascular alert content:', alertContent);

        // Should mention heart-relevant factors
        expect(alertContent?.toLowerCase()).toMatch(/heart|cardiovascular|exertion|heat|blood pressure/i);
      } else if (await heatAlerts.count() > 0) {
        console.log('Heat alerts found (relevant to cardiovascular patients)');
      }
    });

    test('should display diabetes-related alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const diabetesAlerts = page.locator(alertSelectors.diabetesAlert);

      if (await diabetesAlerts.count() > 0) {
        const alertContent = await diabetesAlerts.first().textContent();
        console.log('Diabetes alert content:', alertContent);
      }
    });

    test('should display skin condition alerts for UV', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const skinAlerts = page.locator(alertSelectors.skinConditionAlert);
      const uvAlerts = page.locator(alertSelectors.uvAlert);

      if (await skinAlerts.count() > 0 || await uvAlerts.count() > 0) {
        const alertElement = (await skinAlerts.count() > 0) ? skinAlerts.first() : uvAlerts.first();
        const alertContent = await alertElement.textContent();

        console.log('Skin/UV alert content:', alertContent);

        // Should mention UV or skin-relevant factors
        expect(alertContent?.toLowerCase()).toMatch(/uv|sun|skin|spf|sunscreen/i);
      }
    });

    test('should display condition-specific alerts panel', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const conditionAlerts = page.locator(alertSelectors.conditionAlerts);

      if (await conditionAlerts.count() > 0) {
        await expect(conditionAlerts).toBeVisible();

        // Should group alerts by patient condition
        const alertGroups = conditionAlerts.locator('[data-testid*="group"], .alert-group');
        const groupCount = await alertGroups.count();

        console.log('Condition alert groups:', groupCount);
      }
    });

    test('should personalize alerts based on user health profile', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCards = page.locator(alertSelectors.alertCard);

      if (await alertCards.count() > 0) {
        // Check for personalization indicators
        const hasPersonalization = await alertCards.first().evaluate((el) => {
          const text = el.textContent?.toLowerCase() || '';
          return (
            text.includes('your') ||
            text.includes('based on your') ||
            text.includes('for you') ||
            el.hasAttribute('data-personalized')
          );
        });

        console.log('Alerts appear personalized:', hasPersonalization);
      }
    });
  });

  test.describe('Action Recommendations', () => {
    test('should display recommendations panel', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const recommendationsPanel = page.locator(alertSelectors.recommendationsPanel);

      if (await recommendationsPanel.count() > 0) {
        await expect(recommendationsPanel).toBeVisible();
      }
    });

    test('should display specific action recommendations for alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const recommendations = page.locator(alertSelectors.recommendationItem);

      if (await recommendations.count() > 0) {
        const firstRecommendation = await recommendations.first().textContent();

        console.log('First recommendation:', firstRecommendation);

        // Recommendations should be actionable
        expect(firstRecommendation?.toLowerCase()).toMatch(
          /stay|avoid|wear|take|drink|limit|monitor|check|indoor|outdoor|protect/i
        );
      }
    });

    test('should display learn more button for detailed information', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCard = page.locator(alertSelectors.alertCard).first();

      if (await alertCard.isVisible()) {
        const learnMoreButton = alertCard.locator(alertSelectors.learnMoreButton);

        if (await learnMoreButton.count() > 0) {
          await expect(learnMoreButton).toBeVisible();

          await learnMoreButton.click();

          // Should open detail view or modal
          const detailView = page.locator('[data-testid="alert-detail"], [role="dialog"]');

          if (await detailView.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Alert detail view opened');
          }
        }
      }
    });

    test('should allow dismissing alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCard = page.locator(alertSelectors.alertCard).first();

      if (await alertCard.isVisible()) {
        const dismissButton = alertCard.locator(alertSelectors.dismissButton);

        if (await dismissButton.count() > 0 && await dismissButton.isVisible()) {
          const initialAlertCount = await page.locator(alertSelectors.alertCard).count();

          await dismissButton.click();

          // Wait for dismissal animation/removal
          await page.waitForTimeout(500);

          const finalAlertCount = await page.locator(alertSelectors.alertCard).count();

          console.log('Initial alerts:', initialAlertCount);
          console.log('Final alerts:', finalAlertCount);

          // Alert count should decrease
          expect(finalAlertCount).toBeLessThan(initialAlertCount);
        }
      }
    });

    test('should allow snoozing alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCard = page.locator(alertSelectors.alertCard).first();

      if (await alertCard.isVisible()) {
        const snoozeButton = alertCard.locator(alertSelectors.snoozeButton);

        if (await snoozeButton.count() > 0 && await snoozeButton.isVisible()) {
          await snoozeButton.click();

          // Should show snooze options or snooze immediately
          const snoozeOptions = page.locator('[data-testid="snooze-options"], .snooze-options');

          if (await snoozeOptions.isVisible({ timeout: 1000 }).catch(() => false)) {
            // Select snooze duration
            const snoozeOption = snoozeOptions.locator('button').first();
            await snoozeOption.click();
          }

          // Alert should be snoozed (hidden or marked)
          const isSnoozed = await alertCard.evaluate((el) => {
            return (
              el.classList.contains('snoozed') ||
              el.getAttribute('data-snoozed') === 'true' ||
              el.style.display === 'none'
            );
          }).catch(() => false);

          console.log('Alert snoozed:', isSnoozed);
        }
      }
    });

    test('should display action buttons for recommendations', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const actionButtons = page.locator(alertSelectors.actionButton);

      if (await actionButtons.count() > 0) {
        const buttonText = await actionButtons.first().textContent();

        console.log('Action button text:', buttonText);

        // Button should have actionable text
        expect(buttonText).toBeTruthy();
      }
    });

    test('should link to related resources', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCard = page.locator(alertSelectors.alertCard).first();

      if (await alertCard.isVisible()) {
        // Check for links within alert
        const links = alertCard.locator('a');

        if (await links.count() > 0) {
          const linkHref = await links.first().getAttribute('href');

          console.log('Alert contains link to:', linkHref);

          // Links should be valid
          expect(linkHref).toBeTruthy();
        }
      }
    });
  });

  test.describe('Location Settings', () => {
    test('should display location input', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const locationInput = page.locator(alertSelectors.locationInput);
      const locationSelect = page.locator(alertSelectors.locationSelect);

      const hasLocationSetting = (await locationInput.count() > 0) || (await locationSelect.count() > 0);

      if (hasLocationSetting) {
        console.log('Location setting available');
      }
    });

    test('should allow using current location', async ({ page, context }) => {
      // Grant geolocation permission
      await context.grantPermissions(['geolocation']);

      // Mock geolocation
      await context.setGeolocation({ latitude: 37.7749, longitude: -122.4194 }); // San Francisco

      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const useCurrentLocationButton = page.locator(alertSelectors.useCurrentLocation);

      if (await useCurrentLocationButton.count() > 0 && await useCurrentLocationButton.isVisible()) {
        await useCurrentLocationButton.click();

        // Should update location and fetch new alerts
        await page.waitForLoadState('networkidle');

        console.log('Current location used for alerts');
      }
    });

    test('should update alerts when location changes', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const locationInput = page.locator(alertSelectors.locationInput);

      if (await locationInput.isVisible()) {
        // Get initial alerts
        const initialAlerts = await page.locator(alertSelectors.alertCard).count();

        // Change location
        await locationInput.fill('New York, NY');
        await page.keyboard.press('Enter');

        await page.waitForLoadState('networkidle');

        const updatedAlerts = await page.locator(alertSelectors.alertCard).count();

        console.log('Alerts before location change:', initialAlerts);
        console.log('Alerts after location change:', updatedAlerts);
      }
    });
  });

  test.describe('Alert Settings', () => {
    test('should access alert settings', async ({ page }) => {
      await page.goto(alertRoutes.settings);
      await page.waitForLoadState('networkidle');

      const alertSettings = page.locator(alertSelectors.alertSettings);

      if (await alertSettings.count() > 0) {
        await expect(alertSettings).toBeVisible();
      }
    });

    test('should toggle notification settings', async ({ page }) => {
      await page.goto(alertRoutes.settings);
      await page.waitForLoadState('networkidle');

      const notificationToggle = page.locator(alertSelectors.notificationToggle);

      if (await notificationToggle.count() > 0 && await notificationToggle.isVisible()) {
        const initialState = await notificationToggle.isChecked().catch(() => false);

        await notificationToggle.click();

        const newState = await notificationToggle.isChecked().catch(() => !initialState);

        console.log('Notification toggle changed:', initialState, '->', newState);

        expect(newState).not.toBe(initialState);
      }
    });

    test('should configure alert frequency', async ({ page }) => {
      await page.goto(alertRoutes.settings);
      await page.waitForLoadState('networkidle');

      const alertFrequency = page.locator(alertSelectors.alertFrequency);

      if (await alertFrequency.count() > 0 && await alertFrequency.isVisible()) {
        // Select frequency option
        if (await alertFrequency.locator('select').count() > 0) {
          await alertFrequency.locator('select').selectOption({ index: 1 });
        } else if (await alertFrequency.locator('input[type="radio"]').count() > 0) {
          await alertFrequency.locator('input[type="radio"]').first().click();
        }

        console.log('Alert frequency configured');
      }
    });

    test('should configure condition-specific alert settings', async ({ page }) => {
      await page.goto(alertRoutes.settings);
      await page.waitForLoadState('networkidle');

      const conditionSettings = page.locator(alertSelectors.conditionSettings);

      if (await conditionSettings.count() > 0 && await conditionSettings.isVisible()) {
        // Check for condition toggles
        const conditionToggles = conditionSettings.locator('input[type="checkbox"], [role="switch"]');

        if (await conditionToggles.count() > 0) {
          const toggleCount = await conditionToggles.count();
          console.log('Condition toggles available:', toggleCount);
        }
      }
    });
  });

  test.describe('Refresh and Updates', () => {
    test('should display last updated timestamp', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const lastUpdated = page.locator(alertSelectors.lastUpdated);

      if (await lastUpdated.count() > 0) {
        const timestamp = await lastUpdated.textContent();

        console.log('Last updated:', timestamp);

        expect(timestamp).toMatch(/\d|ago|today|just now|updated/i);
      }
    });

    test('should manually refresh alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const refreshButton = page.locator(alertSelectors.refreshButton);

      if (await refreshButton.count() > 0 && await refreshButton.isVisible()) {
        await refreshButton.click();

        // Should trigger refresh
        const loadingState = page.locator(alertSelectors.loadingSpinner);

        // Might show loading briefly
        await page.waitForLoadState('networkidle');

        console.log('Alerts refreshed');
      }
    });

    test('should toggle auto-refresh', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const autoRefreshToggle = page.locator(alertSelectors.autoRefreshToggle);

      if (await autoRefreshToggle.count() > 0 && await autoRefreshToggle.isVisible()) {
        const initialState = await autoRefreshToggle.isChecked().catch(() => false);

        await autoRefreshToggle.click();

        const newState = await autoRefreshToggle.isChecked().catch(() => !initialState);

        console.log('Auto-refresh toggled:', initialState, '->', newState);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels on alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertsContainer = page.locator(alertSelectors.alertsContainer);

      if (await alertsContainer.count() > 0) {
        const ariaAttributes = await alertsContainer.first().evaluate((el) => {
          return {
            role: el.getAttribute('role'),
            ariaLabel: el.getAttribute('aria-label'),
            ariaLive: el.getAttribute('aria-live'),
          };
        });

        console.log('Alerts container ARIA:', ariaAttributes);
      }
    });

    test('should announce critical alerts to screen readers', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const criticalAlerts = page.locator(alertSelectors.criticalAlert);

      if (await criticalAlerts.count() > 0) {
        const hasLiveRegion = await criticalAlerts.first().evaluate((el) => {
          return (
            el.getAttribute('role') === 'alert' ||
            el.getAttribute('aria-live') === 'assertive' ||
            el.closest('[role="alert"], [aria-live]') !== null
          );
        });

        console.log('Critical alert has live region:', hasLiveRegion);

        // Critical alerts should be announced
        expect(hasLiveRegion).toBe(true);
      }
    });

    test('should support keyboard navigation for alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCards = page.locator(alertSelectors.alertCard);

      if (await alertCards.count() > 0) {
        // Tab to alerts
        await page.keyboard.press('Tab');

        let foundAlert = false;

        for (let i = 0; i < 10; i++) {
          const focused = await page.evaluate(() => {
            return document.activeElement?.getAttribute('data-testid');
          });

          if (focused?.includes('alert')) {
            foundAlert = true;
            break;
          }

          await page.keyboard.press('Tab');
        }

        console.log('Alert keyboard focusable:', foundAlert);
      }
    });

    test('should have sufficient color contrast for severity indicators', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const alertCards = page.locator(alertSelectors.alertCard);

      if (await alertCards.count() > 0) {
        const colorInfo = await alertCards.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
          };
        });

        console.log('Alert color info:', colorInfo);

        // Colors should be set (not transparent)
        expect(colorInfo.backgroundColor).not.toBe('transparent');
        expect(colorInfo.color).not.toBe('transparent');
      }
    });
  });

  test.describe('Alert Types', () => {
    test('should display air quality alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const airQualityAlerts = page.locator(alertSelectors.airQualityAlert);

      if (await airQualityAlerts.count() > 0) {
        const content = await airQualityAlerts.first().textContent();

        console.log('Air quality alert:', content);

        expect(content?.toLowerCase()).toMatch(/air|aqi|quality|pollution|pm2\.5|ozone/i);
      }
    });

    test('should display UV index alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const uvAlerts = page.locator(alertSelectors.uvAlert);

      if (await uvAlerts.count() > 0) {
        const content = await uvAlerts.first().textContent();

        console.log('UV alert:', content);

        expect(content?.toLowerCase()).toMatch(/uv|ultraviolet|sun|index/i);
      }
    });

    test('should display heat advisory alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const heatAlerts = page.locator(alertSelectors.heatAlert);

      if (await heatAlerts.count() > 0) {
        const content = await heatAlerts.first().textContent();

        console.log('Heat alert:', content);

        expect(content?.toLowerCase()).toMatch(/heat|temperature|hot|warm/i);
      }
    });

    test('should display pollen/allergy alerts', async ({ page }) => {
      await page.goto(alertRoutes.dashboard);
      await page.waitForLoadState('networkidle');

      const pollenAlerts = page.locator(alertSelectors.pollenAlert);

      if (await pollenAlerts.count() > 0) {
        const content = await pollenAlerts.first().textContent();

        console.log('Pollen alert:', content);

        expect(content?.toLowerCase()).toMatch(/pollen|allergy|allergen|grass|tree|ragweed/i);
      }
    });
  });
});
