/**
 * Accessibility (a11y) Test Suite
 *
 * Automated accessibility tests using cypress-axe for WCAG 2.1 AA compliance.
 * These tests check for common accessibility issues including:
 * - Proper use of ARIA attributes
 * - Color contrast ratios
 * - Keyboard navigation
 * - Form labels and structure
 * - Semantic HTML
 * - Focus management
 *
 * Installation:
 * npm install --save-dev cypress-axe axe-core
 *
 * Usage:
 * npx cypress run --spec "cypress/e2e/a11y.spec.ts"
 */

/// <reference types="cypress" />

import 'cypress-axe';

describe('Accessibility (WCAG 2.1 AA) Tests', () => {
  beforeEach(() => {
    // Inject axe-core before each test
    cy.visit('/');
    cy.injectAxe();
  });

  describe('Global Accessibility', () => {
    it('should have no accessibility violations on homepage', () => {
      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      });
    });

    it('should have proper document structure', () => {
      // Check for proper heading hierarchy
      cy.get('h1').should('exist').and('be.visible');

      // Check for main landmark
      cy.get('main').should('exist');

      // Check for skip link
      cy.get('a[href="#main-content"]').should('exist');
    });

    it('should have valid lang attribute', () => {
      cy.get('html').should('have.attr', 'lang');
    });

    it('should have a descriptive page title', () => {
      cy.title().should('not.be.empty');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be fully navigable with keyboard', () => {
      // Tab through interactive elements
      cy.get('body').tab();

      // Check that focus is visible
      cy.focused().should('exist').and('be.visible');

      // Continue tabbing
      cy.focused().tab();
      cy.focused().should('exist').and('be.visible');
    });

    it('should allow skipping to main content', () => {
      // Focus on skip link
      cy.get('body').tab();
      cy.focused().should('contain', 'Skip to');

      // Activate skip link
      cy.focused().type('{enter}');

      // Check that main content is focused
      cy.focused().should('have.attr', 'id', 'main-content');
    });

    it('should trap focus in modal dialogs', () => {
      // Open a modal (adjust selector as needed)
      cy.get('[data-testid="open-modal"]').click();

      // Tab through modal
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('body').tab();

      // Ensure focus stays within modal
      cy.focused().parents('[role="dialog"]').should('exist');
    });

    it('should close modal with Escape key', () => {
      cy.get('[data-testid="open-modal"]').click();
      cy.get('[role="dialog"]').should('be.visible');

      cy.get('body').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('Forms and Inputs', () => {
    beforeEach(() => {
      cy.visit('/login'); // Adjust to your login or form page
      cy.injectAxe();
    });

    it('should have no accessibility violations on form page', () => {
      cy.checkA11y('form', {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      });
    });

    it('should have properly labeled form fields', () => {
      // All inputs should have associated labels
      cy.get('input[type="text"], input[type="email"], input[type="password"]')
        .each(($input) => {
          const id = $input.attr('id');
          const ariaLabel = $input.attr('aria-label');
          const ariaLabelledby = $input.attr('aria-labelledby');

          // Input must have either a label, aria-label, or aria-labelledby
          if (id) {
            cy.get(`label[for="${id}"]`).should('exist');
          } else {
            expect(ariaLabel || ariaLabelledby).to.exist;
          }
        });
    });

    it('should indicate required fields', () => {
      cy.get('input[required], input[aria-required="true"]')
        .should('exist')
        .each(($input) => {
          const id = $input.attr('id');
          const ariaRequired = $input.attr('aria-required');
          const required = $input.attr('required');

          // Check that required is indicated
          expect(required !== undefined || ariaRequired === 'true').to.be.true;

          // Visual indicator should exist
          if (id) {
            cy.get(`label[for="${id}"]`)
              .invoke('text')
              .should('match', /\*/); // Or other required indicator
          }
        });
    });

    it('should show accessible error messages', () => {
      // Submit form without filling required fields
      cy.get('form').submit();

      // Check for error messages
      cy.get('[role="alert"], .error-message')
        .should('exist')
        .and('be.visible');

      // Check that inputs are marked as invalid
      cy.get('[aria-invalid="true"]').should('exist');
    });

    it('should associate error messages with inputs', () => {
      cy.get('form').submit();

      cy.get('[aria-invalid="true"]').each(($input) => {
        const describedBy = $input.attr('aria-describedby');
        expect(describedBy).to.exist;

        // Check that the error message exists
        cy.get(`#${describedBy}`).should('exist').and('be.visible');
      });
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient color contrast', () => {
      cy.checkA11y(null, {
        runOnly: {
          type: 'rule',
          values: ['color-contrast'],
        },
      });
    });

    it('should maintain contrast in dark mode', () => {
      // Toggle dark mode (adjust selector as needed)
      cy.get('[data-testid="theme-toggle"]').click();

      // Wait for theme change
      cy.get('html').should('have.class', 'dark');

      // Check color contrast in dark mode
      cy.checkA11y(null, {
        runOnly: {
          type: 'rule',
          values: ['color-contrast'],
        },
      });
    });
  });

  describe('Images and Media', () => {
    it('should have alt text for images', () => {
      cy.get('img').each(($img) => {
        const alt = $img.attr('alt');
        const role = $img.attr('role');

        // Images should have alt text or be marked as decorative
        expect(alt !== undefined || role === 'presentation').to.be.true;
      });
    });

    it('should not have empty alt text for meaningful images', () => {
      cy.checkA11y(null, {
        runOnly: {
          type: 'rule',
          values: ['image-alt'],
        },
      });
    });

    it('should have captions for video content', () => {
      cy.get('video').each(($video) => {
        // Check for captions/subtitles track
        cy.wrap($video)
          .find('track[kind="captions"], track[kind="subtitles"]')
          .should('exist');
      });
    });
  });

  describe('ARIA Usage', () => {
    it('should use valid ARIA attributes', () => {
      cy.checkA11y(null, {
        runOnly: {
          type: 'rule',
          values: [
            'aria-valid-attr',
            'aria-valid-attr-value',
            'aria-allowed-attr',
          ],
        },
      });
    });

    it('should have valid ARIA roles', () => {
      cy.checkA11y(null, {
        runOnly: {
          type: 'rule',
          values: ['aria-allowed-role', 'aria-required-attr'],
        },
      });
    });

    it('should use ARIA landmarks correctly', () => {
      // Check for proper landmark structure
      cy.get('[role="main"], main').should('exist');
      cy.get('[role="navigation"], nav').should('exist');
      cy.get('[role="banner"], header').should('exist');
      cy.get('[role="contentinfo"], footer').should('exist');
    });
  });

  describe('Interactive Elements', () => {
    it('should have accessible buttons', () => {
      cy.get('button, [role="button"]').each(($btn) => {
        // Button should have accessible text
        const text = $btn.text().trim();
        const ariaLabel = $btn.attr('aria-label');
        const ariaLabelledby = $btn.attr('aria-labelledby');

        expect(text || ariaLabel || ariaLabelledby).to.exist;
      });
    });

    it('should have accessible links', () => {
      cy.get('a[href]').each(($link) => {
        const text = $link.text().trim();
        const ariaLabel = $link.attr('aria-label');
        const ariaLabelledby = $link.attr('aria-labelledby');

        // Link should have accessible text
        expect(text || ariaLabel || ariaLabelledby).to.exist;

        // Check that link is not just "click here" or "read more"
        if (text) {
          expect(text.toLowerCase()).not.to.equal('click here');
          expect(text.toLowerCase()).not.to.equal('read more');
        }
      });
    });

    it('should have proper touch target sizes', () => {
      cy.get('button, a, input[type="button"], input[type="submit"]').each(
        ($el) => {
          const rect = $el[0].getBoundingClientRect();
          // WCAG 2.5.5 (AAA): Target size should be at least 44x44 pixels
          expect(rect.width).to.be.at.least(44);
          expect(rect.height).to.be.at.least(44);
        }
      );
    });
  });

  describe('Tables', () => {
    it('should have accessible table markup', () => {
      cy.get('table').each(($table) => {
        // Tables should have caption or aria-label
        const caption = $table.find('caption');
        const ariaLabel = $table.attr('aria-label');
        const ariaLabelledby = $table.attr('aria-labelledby');

        expect(
          caption.length > 0 || ariaLabel || ariaLabelledby
        ).to.be.true;

        // Tables should have th elements
        cy.wrap($table).find('th').should('exist');
      });
    });

    it('should have proper table headers', () => {
      cy.checkA11y('table', {
        runOnly: {
          type: 'rule',
          values: ['th-has-data-cells', 'td-headers-attr'],
        },
      });
    });
  });

  describe('Live Regions', () => {
    it('should announce status messages', () => {
      // Trigger an action that produces a status message
      cy.get('[data-testid="save-button"]').click();

      // Check for live region
      cy.get('[role="status"], [aria-live="polite"]')
        .should('exist')
        .and('not.be.empty');
    });

    it('should announce errors assertively', () => {
      // Trigger an error
      cy.get('form').submit();

      // Check for assertive live region
      cy.get('[role="alert"], [aria-live="assertive"]')
        .should('exist')
        .and('be.visible');
    });
  });

  describe('Responsive and Mobile Accessibility', () => {
    const viewports = [
      { device: 'iphone-x', width: 375, height: 812 },
      { device: 'ipad-2', width: 768, height: 1024 },
      { device: 'macbook-15', width: 1440, height: 900 },
    ];

    viewports.forEach((viewport) => {
      it(`should be accessible on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
        cy.injectAxe();

        cy.checkA11y(null, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa'],
          },
        });
      });
    });
  });

  describe('Page-Specific Accessibility', () => {
    const pages = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Profile', path: '/profile' },
      { name: 'Settings', path: '/settings' },
      { name: 'Appointments', path: '/appointments' },
    ];

    pages.forEach((page) => {
      it(`should have no violations on ${page.name} page`, () => {
        cy.visit(page.path);
        cy.injectAxe();

        cy.checkA11y(null, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        });
      });
    });
  });

  describe('Focus Management', () => {
    it('should return focus after closing modal', () => {
      // Store reference to trigger button
      cy.get('[data-testid="open-modal"]').as('trigger');

      // Open modal
      cy.get('@trigger').click();
      cy.get('[role="dialog"]').should('be.visible');

      // Close modal
      cy.get('[data-testid="close-modal"]').click();

      // Check that focus returned to trigger
      cy.get('@trigger').should('have.focus');
    });

    it('should have visible focus indicators', () => {
      cy.get('a, button, input, select, textarea').each(($el) => {
        // Focus the element
        cy.wrap($el).focus();

        // Check for focus indicator (outline or box-shadow)
        cy.wrap($el).should(($focused) => {
          const styles = window.getComputedStyle($focused[0]);
          const hasOutline =
            styles.outline !== 'none' && styles.outline !== '0px';
          const hasBoxShadow = styles.boxShadow !== 'none';

          expect(hasOutline || hasBoxShadow).to.be.true;
        });
      });
    });
  });
});

/**
 * Custom Commands
 *
 * Add custom Cypress commands for accessibility testing
 */

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to tab through elements
       */
      tab(): Chainable<Element>;

      /**
       * Check if element is keyboard accessible
       */
      shouldBeKeyboardAccessible(): Chainable<Element>;
    }
  }
}

// Tab command
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  cy.focused().trigger('keydown', {
    keyCode: 9,
    key: 'Tab',
    code: 'Tab',
  });

  return subject ? cy.wrap(subject) : cy.focused();
});

// Check keyboard accessibility
Cypress.Commands.add(
  'shouldBeKeyboardAccessible',
  { prevSubject: true },
  (subject) => {
    // Focus the element
    cy.wrap(subject).focus();

    // Check it can be focused
    cy.wrap(subject).should('have.focus');

    // Check it has a visible focus indicator
    cy.wrap(subject).should(($el) => {
      const styles = window.getComputedStyle($el[0]);
      const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
      const hasBoxShadow = styles.boxShadow !== 'none';

      expect(hasOutline || hasBoxShadow).to.be.true;
    });

    return cy.wrap(subject);
  }
);

export {};
