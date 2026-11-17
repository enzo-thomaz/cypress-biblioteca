function login() {
  cy.visit('/');
  cy.get('[data-cy=login-usuario]').type('aluno');
  cy.get('[data-cy=login-senha]').type('senai123');
  cy.get('[data-cy=btn-entrar]').click();
}

describe('Busca, filtros, emprestimo e remocao', () => {
  beforeEach(login);

  it('busca por hobbit e mostra apenas um livro', () => {
    cy.get('[data-cy=busca]').type('hobbit');
    cy.get('[data-cy=linha-livro]').should('have.length', 1).and('contain', 'O Hobbit');
  });

  it('mostra mensagem quando nenhum livro e encontrado', () => {
    cy.get('[data-cy=busca]').type('zzz');
    cy.get('[data-cy=vazio]').should('have.text', 'Nenhum livro encontrado');
  });

  it('filtra os livros emprestados', () => {
    cy.get('[data-cy=filtro-status]').select('emprestados');
    cy.get('[data-cy=linha-livro]').should('have.length', 1).and('contain', 'O Hobbit');
  });

  it('empresta 1984 para Maria e atualiza a situacao e o contador', () => {
    cy.contains('[data-cy=linha-livro]', '1984').find('[data-cy=btn-emprestar]').click();
    cy.get('[data-cy=input-leitor]').type('Maria');
    cy.get('[data-cy=btn-confirmar-emprestimo]').click();
    cy.contains('[data-cy=linha-livro]', '1984').should('contain', 'Emprestado para Maria');
    cy.get('[data-cy=contador]').should('have.text', '4 livro(s) no acervo, 2 emprestado(s)');
  });

  it('pede o nome do leitor se o emprestimo for confirmado sem nome', () => {
    cy.contains('[data-cy=linha-livro]', '1984').find('[data-cy=btn-emprestar]').click();
    cy.get('[data-cy=btn-confirmar-emprestimo]').click();
    cy.get('[data-cy=emprestimo-erro]').should('have.text', 'Informe o nome do leitor');
  });

  it('fecha o modal ao cancelar emprestimo e mantem o livro disponivel', () => {
    cy.contains('[data-cy=linha-livro]', '1984').find('[data-cy=btn-emprestar]').click();
    cy.get('[data-cy=btn-cancelar-emprestimo]').click();
    cy.get('[data-cy=modal-emprestimo]').should('not.exist');
    cy.contains('[data-cy=linha-livro]', '1984').should('contain', 'Disponivel');
  });

  it('devolve O Hobbit e volta a ficar disponivel', () => {
    cy.contains('[data-cy=linha-livro]', 'O Hobbit').find('[data-cy=btn-devolver]').click();
    cy.contains('[data-cy=linha-livro]', 'O Hobbit').should('contain', 'Disponivel');
  });

  it('desabilita remover para livro emprestado', () => {
    cy.contains('[data-cy=linha-livro]', 'O Hobbit').find('[data-cy=btn-remover]').should('be.disabled');
  });

  it('mantem o livro quando a remocao e cancelada', () => {
    cy.contains('[data-cy=linha-livro]', 'Dom Casmurro').find('[data-cy=btn-remover]').click();
    cy.get('[data-cy=btn-cancelar-remocao]').click();
    cy.contains('[data-cy=linha-livro]', 'Dom Casmurro').should('exist');
  });

  it('remove o livro quando a remocao e confirmada', () => {
    cy.contains('[data-cy=linha-livro]', 'Dom Casmurro').find('[data-cy=btn-remover]').click();
    cy.get('[data-cy=btn-confirmar-remocao]').click();
    cy.contains('[data-cy=linha-livro]', 'Dom Casmurro').should('not.exist');
  });
});
