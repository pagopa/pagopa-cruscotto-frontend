/* eslint-disable @typescript-eslint/no-namespace */
export type Account = Record<string, string | boolean | number>;

Cypress.Commands.add('getAccount', () => {
  return cy
    .request({
      method: 'GET',
      url: '/api/account',
    })
    .then(response => response.body as Account);
});

Cypress.Commands.add('saveAccount', (account: Account) => {
  return cy.request({
    method: 'POST',
    url: '/api/account',
    body: account,
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      getAccount(): Cypress.Chainable<Account>;
      saveAccount(account: Account): Cypress.Chainable<Cypress.Response<Account>>;
    }
  }
}
