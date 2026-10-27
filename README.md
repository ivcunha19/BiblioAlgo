# BiblioAlgo

Visualizador didático passo a passo de **Algoritmos e Estruturas de Dados (AEDS)** com foco em estruturas lineares dinâmicas encadeadas em Java (**Fila**, **Pilha** e **Lista** com célula sentinela).

O sistema permite executar as operações de cada TAD, acompanhar a alocação de células na memória (Heap), observar o comportamento das referências (ponteiros) e seguir a execução linha a linha do código-fonte em Java.

---

## Estrutura do Projeto

- `BiblioAlgo/` — **Frontend** em React 19 + Vite + Tailwind CSS (possui também simulação local integrada caso o backend não esteja rodando).
- `Backend/` — **API Backend** em Java 25 + Spring Boot 4 (executa as classes Java reais e gera os snapshots de execução passo a passo).

---

## Pré-requisitos

- **Node.js** (v18+ ou v20+ recomendado) e **npm**
- **Java JDK 25** (necessário apenas se desejar rodar o backend Spring Boot; o Maven já está incluído via `./mvnw`)

---

## Como Rodar o Sistema

### 1. Rodar o Frontend (React / Vite)

Em um terminal, acesse a pasta `BiblioAlgo`, instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd BiblioAlgo
npm install
npm run dev
```

O frontend estará disponível em: **`http://localhost:5173`**

> **Nota:** O frontend possui um **Modo de Estudo Local** integrado. Mesmo que o backend não esteja em execução, todas as estruturas (Fila, Pilha e Lista) e animações passo a passo funcionam normalmente no navegador.

---

### 2. Rodar o Backend (Opcional — Spring Boot)

Se desejar executar as operações diretamente no servidor Java (porta `8080`, automaticamente conectada via proxy do Vite em `/api`):

Em outro terminal, acesse a pasta `Backend` e execute:

**No Linux / macOS:**
```bash
cd Backend
./mvnw spring-boot:run
```

**No Windows (PowerShell / CMD):**
```cmd
cd Backend
mvnw.cmd spring-boot:run
```

O backend iniciará em **`http://localhost:8080`**.

---

## Comandos Úteis

### Frontend (`BiblioAlgo/`)
| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run build` | Gera o build de produção na pasta `dist/` |
| `npm run preview` | Visualiza localmente o build de produção |
| `npm run lint` | Executa a verificação estática de código (`oxlint`) |

### Backend (`Backend/`)
| Comando | Descrição |
| :--- | :--- |
| `./mvnw spring-boot:run` | Inicia a API Spring Boot na porta `8080` |
| `./mvnw test` | Executa os testes automatizados JUnit |
