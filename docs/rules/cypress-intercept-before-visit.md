# checks that cypress intercept occurs before a visit (`cypress-intercept-before-visit`)

 Stubbing errors can sometimes occur when intercepts are registered before visit calls are made. To make sure the network intercept is registered before the application makes the visit call, cy.intercept should be set up before cy.visit.

## Rule Details
Note: Currently does not handle checks between beforeEach, befores and visits.

Examples of **incorrect** code for this rule:

```js
 describe(() => {
    it('', () => {
        cy.visit('test');
        cy.intercept('test');
    });
});

describe(() => {
    context('', () => {
        it('', () => {
            cy.visit('test');
            cy.intercept('test');
        });
    });
});
```

Examples of **correct** code for this rule:

```js
describe(() => {
    it('', () => {
        cy.intercept('test');
        cy.visit('test');
    });
});

describe(() => {
    context(() => {
        it('', () => {
            cy.intercept('test');
            cy.visit('test');
        });
    });
});
```

## Further Reading

Related to: https://stackoverflow.com/questions/65014050/cy-intercept-not-stubbing-api-in-cypress