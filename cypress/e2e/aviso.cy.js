function login() {
  cy.visit('/');
  cy.get('[data-cy=login-usuario]').type('aluno');
  cy.get('[data-cy=login-senha]').type('senai123');
  cy.get('[data-cy=btn-entrar]').click();
}

function cadastrarLivro() {
  cy.get('[data-cy=input-titulo]').type('Duna');
  cy.get('[data-cy=input-autor]').type('Frank Herbert');
  cy.get('[data-cy=input-ano]').type('1965');
  cy.get('[data-cy=select-genero]').select('Ficcao');
  cy.get('[data-cy=btn-cadastrar]').click();
}

describe('Aviso de sucesso', () => {
  it('aparece e some depois de aproximadamente 3 segundos', () => {
    login();
    cadastrarLivro();
    cy.get('[data-cy=aviso]').should('have.text', 'Livro cadastrado com sucesso');
    cy.get('[data-cy=aviso]').should('not.exist');
  });

  it('aparece e some usando o relogio controlado do Cypress', () => {
    cy.clock();
    login();
    cadastrarLivro();
    cy.get('[data-cy=aviso]').should('exist');
    cy.tick(3000);
    cy.get('[data-cy=aviso]').should('not.exist');
  });
});
