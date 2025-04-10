Here's the updated README based on your requests, including all the key points you've mentioned:

---

# AmigoLocal

AmigoLocal is a lightweight, collaborative project using Vue.js with Vuetify as the front-end framework and Firebase for backend services.

## .env File Setup

The required `.env` file will be shared privately and should be placed in the root directory of the project. This file contains critical environment variables for the project configuration and should not be shared publicly.

## Tech Stack

This project utilizes:
- **Vuetify**: As the main front-end UI framework, integrated with Vue.js.
- **Firebase**: Used as the backend for database, authentication, and hosting.

## Project Structure

The repository is organized in a structured manner, with components and views separated for better scalability:

- **src/components**: Contains reusable components such as forms, icons, metrics, and specialized views like promoters, events, etc.
- **src/views**: Contains main views such as `Login.vue`, `About.vue`, `Home.vue`, and others.
- **router**: Vue Router configuration files for managing application routes.
- **store**: Vuex store for state management.
- **schemas**: Project-specific schema definitions.
- **styles**: Global and local styles.

Refer to the folder structure in the project for a clear view of how components and views are organized.

## Project Setup

To install dependencies, choose one of the following commands based on your preferred package manager:

```bash
# Using Yarn
yarn

# Using NPM
npm install

# Using PNPM
pnpm install

# Using Bun
bun install
```

### Starting the Project for Development

To start the project with hot-reloads for development, run one of the following commands:

```bash
# Using Yarn
yarn dev

# Using NPM
npm run dev

# Using PNPM
pnpm dev

# Using Bun
bun run dev
```

This will start a local development server, usually available at `http://localhost:3000`.

### Production Build

To build the project for production, use:

```bash
# Using Yarn
yarn build

# Using NPM
npm run build

# Using PNPM
pnpm build

# Using Bun
bun run build
```

### Linting

Lint and fix the files with:

```bash
# Using Yarn
yarn lint

# Using NPM
npm run lint

# Using PNPM
pnpm lint

# Using Bun
bun run lint
```

## Git Workflow and Branching Convention

When contributing to the project, it's important to follow the correct branch naming convention and commit message structure to ensure consistent code management.

### Branch Naming Convention

For every new branch, use one of the following prefixes to indicate the type of change being made:

- `feature-`: For adding a new feature (e.g., `feature-promoter-page`).
- `fix-`: For fixing a bug in the code (e.g., `fix-login-issue`).
- `docs-`: For changes to the documentation.
- `style-`: For formatting or stylistic changes (e.g., missing semicolons, etc.).
- `refactor-`: For refactoring code without changing its functionality (e.g., `refactor-auth-module`).
- `test-`: For adding or updating tests.
- `chore-`: For maintenance tasks like updating dependencies or config files.

### Commit Message Structure

Ensure each commit message follows these conventions:

- **feat**: A new feature (for the user).
- **fix**: A bug fix (for the user).
- **docs**: Changes to documentation.
- **style**: Code style changes (whitespace, formatting, missing semicolons).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **test**: Adding or updating tests.
- **chore**: Minor tasks or updates, such as dependency changes.

---

This README now includes all necessary information, from setup and project structure to the branching and commit conventions, making collaboration smoother across your team.


Funcionalidades Detalhadas e Implicações de Desenvolvimento: Gestão de Eventos: Funcionalidade: O sistema permite a criação e gestão de eventos, incluindo informações como data, hora, local, e listas de convidados. Implicações de Desenvolvimento: Modelagem de dados robusta para armazenar informações do evento. Interface para criação e edição de eventos. Calendário ou visualização de eventos. Potencial para integração com sistemas de mapas para localização de eventos. Gestão de Convidados: Funcionalidade: O sistema permite o gerenciamento de listas de convidados, incluindo a importação de listas, a marcação de presenças (check-in) e a exportação de dados. Implicações de Desenvolvimento: Funcionalidade de importação/exportação de dados (Excel, CSV). Sistema de busca e filtragem de convidados. Integração com dispositivos de check-in (leitores de código de barras, etc.). Rastreamento do histórico de check-in. Implementação de listas de convidados VIP e listas de pagamentos via pix. Check-in: Funcionalidade: O sistema oferece funcionalidades de check-in, permitindo o registro da entrada de convidados no evento. Implicações de Desenvolvimento: Interface de check-in otimizada para dispositivos móveis. Registro de data e hora do check-in. Relatórios e estatísticas de check-in em tempo real. Relatórios de checkin por hostess. Gestão de Promotores e Hostess: Funcionalidade: O sistema permite a gestão de promotores e hostess, incluindo a atribuição de listas de convidados e o acompanhamento do desempenho. Implicações de Desenvolvimento: Sistema de controle de acesso baseado em roles (RBAC). Relatórios de desempenho de promotores e hostess. Ferramentas de comunicação entre gestores, promotores e hostess. Relatórios e Estatísticas: Funcionalidade: O sistema gera relatórios e estatísticas sobre o evento, incluindo o número de convidados, o número de check-ins e o desempenho de promotores e hostess. Implicações de Desenvolvimento: Geração de relatórios em diferentes formatos (PDF, Excel). Visualização de dados em gráficos e dashboards. Cálculo de métricas de desempenho. Gestão de Listas: Funcionalidade: O sistema permite a criação e gestão de listas de convidados personalizadas, incluindo a definição de cotas e a configuração de horários de virada de lista. Implicações de Desenvolvimento: Interface para criação e edição de listas personalizadas. Sistema de controle de cotas. Funcionalidade de virada de lista automática. Controle de visibilidade das listas.