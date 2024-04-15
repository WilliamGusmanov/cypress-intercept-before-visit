/**
 * @fileoverview checks that cypress intercept occurs before a visit
 * @author 
 */
"use strict";
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-visit-before-intercepts"),
  RuleTester = require("eslint").RuleTester;

const parserOptions = { ecmaVersion: 6 }
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("cypress-intercept-before-visit", rule, {
  valid: [
  { 
    code: `
      describe(() => {
        it('', () => {
          cy.intercept('test');
          cy.visit('test');
        });
      });
    `,
    parserOptions
  },
  {
    code: `
      describe(() => {
        context(() => {
          it('', () => {
            cy.intercept('test');
            cy.visit('test');
          });
        });
      });
    `,
    parserOptions
  },
  {
    code: `
      describe(() => {
        context(() => {
          it('', () => {
            cy.intercept('test');
            cy.visit('test');
            let y = null;
            cy.wait('@someAlias').then(({request}) => {
              cy.someAction(request.query);
              y = request.y.z;
            });
          });
        });
      });
    `,
    parserOptions
  },
  {
    code: `
      describe(() => {
        beforeEach(() => {
          cy.intercept('test').as('someAlias');
        });
        it('', () => {
          cy.visit('test');
        });
      });
    `,
    errors: [{ messageId: 'unexpected' }],
    parserOptions
  },
  ],

  invalid: [ 
    {
      code: `
        describe(() => {
          it('', () => {
            cy.visit('test');
            cy.intercept('test').as('someAlias');
          });
        });
      `,
      errors: [{ messageId: 'unexpected' }],
      parserOptions
    },
    {
      code: `
        describe(() => {
          beforeEach(() => {
            cy.visit('test');
          });
          it('', () => {
            cy.intercept('test').as('someAlias');
          });
        });
      `,
      errors: [{ messageId: 'unexpected' }],
      parserOptions
    },
    {
      code: `
        describe(() => {
          it('', { someConfig: true }, () => {
            cy.visit('test');
            cy.intercept('test').as('someAlias');
          });
        });
      `,
      errors: [{ messageId: 'unexpected' }],
      parserOptions
    },
    {
      code: `
        describe(() => {
          it('', () => {
            cy.visit('test');
            cy.intercept('test');
          });
        });
      `,
      errors: [{ messageId: 'unexpected' }],
      parserOptions
    },
    {
      code: `
        describe(() => {
          context('', () => {
            it('', () => {
              cy.visit('test');
              cy.intercept('test');
            });
          });
        });
      `,
      errors: [{ messageId: 'unexpected' }],
      parserOptions
    }
  ],
});
