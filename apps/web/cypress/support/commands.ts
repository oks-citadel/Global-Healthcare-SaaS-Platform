/**
 * Cypress Custom Commands
 *
 * Additional commands for accessibility testing
 */

/// <reference types="cypress" />

import 'cypress-axe';

/**
 * Type definitions for custom commands
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Inject axe-core for accessibility testing
       * @example cy.injectAxe()
       */
      injectAxe(): Chainable<void>;

      /**
       * Check accessibility violations
       * @example cy.checkA11y()
       */
      checkA11y(
        context?: string | Node | axe.ContextObject,
        options?: axe.RunOptions,
        violationCallback?: (violations: axe.Result[]) => void,
        skipFailures?: boolean
      ): Chainable<void>;

      /**
       * Tab to next focusable element
       * @example cy.tab()
       */
      tab(): Chainable<Element>;

      /**
       * Shift+Tab to previous focusable element
       * @example cy.shiftTab()
       */
      shiftTab(): Chainable<Element>;

      /**
       * Check if element is keyboard accessible
       * @example cy.get('button').shouldBeKeyboardAccessible()
       */
      shouldBeKeyboardAccessible(): Chainable<Element>;
    }
  }
}

/**
 * Tab to next element
 */
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  const selector = subject ? cy.wrap(subject) : cy.focused();

  selector.trigger('keydown', {
    key: 'Tab',
    code: 'Tab',
    keyCode: 9,
    which: 9,
  });

  return cy.focused();
});

/**
 * Shift+Tab to previous element
 */
Cypress.Commands.add('shiftTab', { prevSubject: 'optional' }, (subject) => {
  const selector = subject ? cy.wrap(subject) : cy.focused();

  selector.trigger('keydown', {
    key: 'Tab',
    code: 'Tab',
    keyCode: 9,
    which: 9,
    shiftKey: true,
  });

  return cy.focused();
});

/**
 * Check if element is keyboard accessible
 */
Cypress.Commands.add(
  'shouldBeKeyboardAccessible',
  { prevSubject: true },
  (subject) => {
    // Element should be focusable
    cy.wrap(subject).focus().should('have.focus');

    // Element should have visible focus indicator
    cy.wrap(subject).should(($el) => {
      const styles = window.getComputedStyle($el[0]);
      const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
      const hasBoxShadow = styles.boxShadow !== 'none';
      const hasFocusVisible = $el.hasClass('focus-visible');

      expect(hasOutline || hasBoxShadow || hasFocusVisible).to.be.true;
    });

    return cy.wrap(subject);
  }
);

export {};
