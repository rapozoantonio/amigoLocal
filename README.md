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
