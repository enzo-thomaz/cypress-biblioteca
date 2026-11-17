function login() {
  cy.visit('/');
  cy.get('[data-cy=login-usuario]').type('aluno');
  cy.get('[data-cy=login-senha]').type('senai123');
  cy.get('[data-cy=btn-entrar]').click();
}

describe('Cadastro de livros', () => {
  beforeEach(login);

  it('mostra o contador inicial do acervo', () => {
    cy.get('[data-cy=contador]').should('have.text', '4 livro(s) no acervo, 1 emprestado(s)');
  });

  it('cadastra Duna e atualiza tabela e contador', () => {
    cy.get('[data-cy=input-titulo]').type('Duna');
    cy.get('[data-cy=input-autor]').type('Frank Herbert');
    cy.get('[data-cy=input-ano]').type('1965');
    cy.get('[data-cy=select-genero]').select('Ficcao');
    cy.get('[data-cy=btn-cadastrar]').click();
    cy.contains('[data-cy=linha-livro]', 'Duna').should('exist');
    cy.get('[data-cy=linha-livro]').should('have.length', 5);
    cy.get('[data-cy=contador]').should('have.text', '5 livro(s) no acervo, 1 emprestado(s)');
    cy.get('[data-cy=aviso]').should('have.text', 'Livro cadastrado com sucesso');
  });

  it('mostra erro se titulo e autor estiverem vazios', () => {
    cy.get('[data-cy=btn-cadastrar]').click();
    cy.get('[data-cy=form-erro]').should('have.text', 'Titulo e autor sao obrigatorios');
  });

  it('mostra erro quando o ano esta no futuro', () => {
    cy.get('[data-cy=input-titulo]').type('Livro Futuro');
    cy.get('[data-cy=input-autor]').type('Autor Teste');
    cy.get('[data-cy=input-ano]').type('2999');
    cy.get('[data-cy=btn-cadastrar]').click();
    cy.get('[data-cy=form-erro]').should('have.text', 'Ano invalido');
  });

  it('impede cadastrar um titulo que ja existe ignorando maiusculas', () => {
    cy.get('[data-cy=input-titulo]').type('dom casmurro');
    cy.get('[data-cy=input-autor]').type('Outro Autor');
    cy.get('[data-cy=input-ano]').type('2020');
    cy.get('[data-cy=btn-cadastrar]').click();
    cy.get('[data-cy=form-erro]').should('have.text', 'Livro ja cadastrado');
  });

  it('limpa os campos depois de cadastrar com sucesso', () => {
    cy.get('[data-cy=input-titulo]').type('Duna');
    cy.get('[data-cy=input-autor]').type('Frank Herbert');
    cy.get('[data-cy=input-ano]').type('1965');
    cy.get('[data-cy=select-genero]').select('Ficcao');
    cy.get('[data-cy=btn-cadastrar]').click();
    cy.get('[data-cy=input-titulo]').should('have.value', '');
    cy.get('[data-cy=input-autor]').should('have.value', '');
    cy.get('[data-cy=input-ano]').should('have.value', '');
  });
});
