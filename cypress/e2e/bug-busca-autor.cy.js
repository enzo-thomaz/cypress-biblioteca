function login() {
  cy.visit('/');
  cy.get('[data-cy=login-usuario]').type('aluno');
  cy.get('[data-cy=login-senha]').type('senai123');
  cy.get('[data-cy=btn-entrar]').click();
}

describe('BUG-01 - busca por autor ignora maiusculas e minusculas', () => {
  it('deve encontrar Machado de Assis quando a busca e digitada em minusculas', () => {
    login();
    cy.get('[data-cy=busca]').type('machado');
    // Este teste deve falhar ate que a busca por autor ignore maiusculas/minusculas.
    cy.contains('[data-cy=linha-livro]', 'Dom Casmurro').should('exist');
  });
});
