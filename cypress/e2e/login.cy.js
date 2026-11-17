
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('entra com usuario e senha validos', () => {
    cy.get('[data-cy=login-usuario]').type('aluno');
    cy.get('[data-cy=login-senha]').type('senai123');
    cy.get('[data-cy=btn-entrar]').click();

    cy.get('[data-cy=saudacao]')
      .should('have.text', 'Ola, aluno');
  });
});
