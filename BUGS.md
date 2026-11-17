# Relatorio de bugs — Biblioteca SENAI

## BUG-01: Busca por autor diferencia maiusculas e minusculas

- **Passos para reproduzir:** 1. Entrar com usuario `aluno` e senha `senai123`. 2. Digitar `machado` no campo de busca. 3. Observar os resultados.
- **Resultado esperado:** O livro `Dom Casmurro`, de Machado de Assis, deve aparecer, pois a busca por autor deve funcionar independentemente de maiusculas e minusculas.
- **Resultado obtido:** A lista fica vazia, porque o titulo e comparado convertendo para minusculas, mas o nome do autor e pesquisado sem normalizar as letras.
- **Severidade:** média — a busca falha para termos de autor digitados com capitalizacao diferente, dificultando encontrar livros existentes.
- **Teste que reproduz:** `cypress/e2e/bug-busca-autor.cy.js`, teste `deve encontrar Machado de Assis quando a busca e digitada em minusculas`. O teste deve falhar enquanto o defeito existir.

## Desafio extra — aviso que some

O aviso de sucesso e verificado em `cypress/e2e/aviso.cy.js`. O segundo teste usa `cy.clock()` e `cy.tick(3000)` para avançar o tempo sem esperar de verdade.

Controlar o relogio deixa a suite mais rapida porque nao precisa aguardar os tres segundos reais. Tambem deixa o teste mais confiavel, pois o tempo e avancado de forma previsivel, sem depender da velocidade do computador.
