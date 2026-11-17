
import { useEffect, useState } from 'react';

const USUARIO = 'aluno';
const SENHA = 'senai123';

const LIVROS_INICIAIS = [
  {
    id: 1,
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    ano: 1899,
    genero: 'Romance',
    leitor: null,
  },
  {
    id: 2,
    titulo: 'O Hobbit',
    autor: 'J. R. R. Tolkien',
    ano: 1937,
    genero: 'Fantasia',
    leitor: 'Carlos',
  },
  {
    id: 3,
    titulo: 'Codigo Limpo',
    autor: 'Robert C. Martin',
    ano: 2008,
    genero: 'Tecnologia',
    leitor: null,
  },
  {
    id: 4,
    titulo: '1984',
    autor: 'George Orwell',
    ano: 1949,
    genero: 'Ficcao',
    leitor: null,
  },
];

const GENEROS = [
  'Romance',
  'Fantasia',
  'Tecnologia',
  'Ficcao',
  'Outro',
];

export default function App() {
  const [usuario, setUsuario] = useState(null);

  if (!usuario) {
    return <Login onEntrar={setUsuario} />;
  }

  return (
    <main>
      <header>
        <h1>Biblioteca SENAI</h1>

        <div>
          <span data-cy="saudacao">
            Ola, {usuario}
          </span>{' '}

          <button
            data-cy="btn-sair"
            onClick={() => setUsuario(null)}
          >
            Sair
          </button>
        </div>
      </header>

      <Acervo />
    </main>
  );
}

function Login({ onEntrar }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function entrar(e) {
    e.preventDefault();

    if (!usuario.trim() || !senha) {
      setErro('Preencha usuario e senha');
      return;
    }

    if (usuario !== USUARIO || senha !== SENHA) {
      setErro('Usuario ou senha invalidos');
      return;
    }

    onEntrar(usuario);
  }

  return (
    <main className="login">
      <h1>Biblioteca SENAI</h1>

      <form onSubmit={entrar}>
        <label>
          Usuario

          <input
            data-cy="login-usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </label>

        <label>
          Senha

          <input
            data-cy="login-senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>

        <button data-cy="btn-entrar" type="submit">
          Entrar
        </button>

        {erro && (
          <p className="erro" data-cy="login-erro">
            {erro}
          </p>
        )}
      </form>
    </main>
  );
}

function Acervo() {
  const [livros, setLivros] = useState(LIVROS_INICIAIS);
  const [proximoId, setProximoId] = useState(5);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [aviso, setAviso] = useState('');
  const [emprestando, setEmprestando] = useState(null);
  const [removendo, setRemovendo] = useState(null);

  useEffect(() => {
    if (!aviso) return;

    const temporizador = setTimeout(() => {
      setAviso('');
    }, 3000);

    return () => clearTimeout(temporizador);
  }, [aviso]);

  function cadastrar(livro) {
    setLivros((atuais) => [
      ...atuais,
      {
        ...livro,
        id: proximoId,
        leitor: null,
      },
    ]);

    setProximoId((id) => id + 1);
    setAviso('Livro cadastrado com sucesso');
  }

  function emprestar(id, leitor) {
    setLivros((atuais) =>
      atuais.map((livro) =>
        livro.id === id
          ? { ...livro, leitor }
          : livro
      )
    );

    setEmprestando(null);
    setAviso('Emprestimo registrado');
  }

  function devolver(id) {
    setLivros((atuais) =>
      atuais.map((livro) =>
        livro.id === id
          ? { ...livro, leitor: null }
          : livro
      )
    );

    setAviso('Livro devolvido');
  }

  function remover(id) {
    setLivros((atuais) =>
      atuais.filter((livro) => livro.id !== id)
    );

    setRemovendo(null);
    setAviso('Livro removido');
  }

  const termo = busca.trim().toLowerCase();

  // Busca por titulo ou autor sem diferenciar
  // letras maiusculas e minusculas.
  const visiveis = livros
    .filter((livro) => {
      return (
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo)
      );
    })
    .filter((livro) => {
      if (filtro === 'disponiveis') {
        return !livro.leitor;
      }

      if (filtro === 'emprestados') {
        return Boolean(livro.leitor);
      }

      return true;
    });

  const totalEmprestados = livros.filter(
    (livro) => livro.leitor
  ).length;

  return (
    <>
      {aviso && (
        <div className="aviso" data-cy="aviso">
          {aviso}
        </div>
      )}

      <FormLivro
        livros={livros}
        onCadastrar={cadastrar}
      />

      <section>
        <h2>Acervo</h2>

        <p data-cy="contador">
          {livros.length} livro(s) no acervo,{' '}
          {totalEmprestados} emprestado(s)
        </p>

        <div className="filtros">
          <input
            data-cy="busca"
            placeholder="Buscar por titulo ou autor"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select
            data-cy="filtro-status"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="disponiveis">Disponiveis</option>
            <option value="emprestados">Emprestados</option>
          </select>
        </div>

        {visiveis.length === 0 ? (
          <p data-cy="vazio">
            Nenhum livro encontrado
          </p>
        ) : (
          <table data-cy="tabela-livros">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Autor</th>
                <th>Ano</th>
                <th>Genero</th>
                <th>Situacao</th>
                <th>Acoes</th>
              </tr>
            </thead>

            <tbody>
              {visiveis.map((livro) => (
                <tr
                  key={livro.id}
                  data-cy="linha-livro"
                >
                  <td>{livro.titulo}</td>
                  <td>{livro.autor}</td>
                  <td>{livro.ano}</td>
                  <td>{livro.genero}</td>

                  <td data-cy="situacao">
                    {livro.leitor
                      ? `Emprestado para ${livro.leitor}`
                      : 'Disponivel'}
                  </td>

                  <td className="acoes">
                    {livro.leitor ? (
                      <button
                        data-cy="btn-devolver"
                        onClick={() => devolver(livro.id)}
                      >
                        Devolver
                      </button>
                    ) : (
                      <button
                        data-cy="btn-emprestar"
                        onClick={() => setEmprestando(livro)}
                      >
                        Emprestar
                      </button>
                    )}

                    <button
                      data-cy="btn-remover"
                      disabled={Boolean(livro.leitor)}
                      title={
                        livro.leitor
                          ? 'Livro emprestado nao pode ser removido'
                          : ''
                      }
                      onClick={() => setRemovendo(livro)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {emprestando && (
        <ModalEmprestimo
          livro={emprestando}
          onConfirmar={(leitor) =>
            emprestar(emprestando.id, leitor)
          }
          onCancelar={() => setEmprestando(null)}
        />
      )}

      {removendo && (
        <div className="modal-fundo">
          <div className="modal" data-cy="modal-remover">
            <p>
              Tem certeza que deseja remover "
              {removendo.titulo}"?
            </p>

            <button
              data-cy="btn-confirmar-remocao"
              onClick={() => remover(removendo.id)}
            >
              Confirmar
            </button>{' '}

            <button
              data-cy="btn-cancelar-remocao"
              onClick={() => setRemovendo(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FormLivro({ livros, onCadastrar }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [ano, setAno] = useState('');
  const [genero, setGenero] = useState('Romance');
  const [erro, setErro] = useState('');

  function enviar(e) {
    e.preventDefault();

    const anoAtual = new Date().getFullYear();

    if (!titulo.trim() || !autor.trim()) {
      setErro('Titulo e autor sao obrigatorios');
      return;
    }

    if (
      !ano ||
      Number(ano) < 1000 ||
      Number(ano) > anoAtual
    ) {
      setErro('Ano invalido');
      return;
    }

    const duplicado = livros.some(
      (livro) =>
        livro.titulo.toLowerCase() ===
        titulo.trim().toLowerCase()
    );

    if (duplicado) {
      setErro('Livro ja cadastrado');
      return;
    }

    onCadastrar({
      titulo: titulo.trim(),
      autor: autor.trim(),
      ano: Number(ano),
      genero,
    });

    setTitulo('');
    setAutor('');
    setAno('');
    setGenero('Romance');
    setErro('');
  }

  return (
    <section>
      <h2>Cadastrar livro</h2>

      <form
        onSubmit={enviar}
        className="form-livro"
      >
        <input
          data-cy="input-titulo"
          placeholder="Titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          data-cy="input-autor"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <input
          data-cy="input-ano"
          placeholder="Ano"
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />

        <select
          data-cy="select-genero"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        >
          {GENEROS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          data-cy="btn-cadastrar"
          type="submit"
        >
          Cadastrar
        </button>
      </form>

      {erro && (
        <p className="erro" data-cy="form-erro">
          {erro}
        </p>
      )}
    </section>
  );
}

function ModalEmprestimo({
  livro,
  onConfirmar,
  onCancelar,
}) {
  const [leitor, setLeitor] = useState('');
  const [erro, setErro] = useState('');

  function confirmar() {
    if (!leitor.trim()) {
      setErro('Informe o nome do leitor');
      return;
    }

    onConfirmar(leitor.trim());
  }

  return (
    <div className="modal-fundo">
      <div className="modal" data-cy="modal-emprestimo">
        <p>Emprestar "{livro.titulo}"</p>

        <input
          data-cy="input-leitor"
          placeholder="Nome do leitor"
          value={leitor}
          onChange={(e) => setLeitor(e.target.value)}
        />

        {erro && (
          <p className="erro" data-cy="emprestimo-erro">
            {erro}
          </p>
        )}

        <button
          data-cy="btn-confirmar-emprestimo"
          onClick={confirmar}
        >
          Confirmar
        </button>{' '}

        <button
          data-cy="btn-cancelar-emprestimo"
          onClick={onCancelar}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
