# Copilot Instructions for English Machine

## Project Overview

- **English Machine** is an open-source platform for English language practice, focused on verb tenses and phrasal verbs.
- The app is built with [Astro](https://astro.build/), React, and Tailwind CSS. It uses a public JSON-based question database.

## Key Architecture

- **Questions Database**: All question sets are in `src/dbs/*.json`, following `src/dbs/schema.json` (see `.github/instructions/questionsdb.instructions.md` for strict rules).
- **Pages**:
  - Main page: `src/pages/index.astro` (lists all question sets).
  - Exercise pages: `src/pages/q/[slug].astro` (dynamic route for each question set, uses `MultiChoiceLayout`).
- **Components**:
  - UI components in `src/components/ui/` (e.g., `button.tsx`, `accordion.tsx`).
  - Main quiz logic in `src/components/MultiChoice.tsx` (React, uses nanostores for state).
- **Layouts**: Shared layouts in `src/layouts/` (notably `MultiChoiceLayout.astro`).
- **State Management**: Uses [nanostores](https://nanostores.github.io/nanostores/) for session and quiz state (`src/stores/session.ts`).
- **Styling**: Tailwind CSS with custom variables in `src/styles/global.css`.

## Developer Workflows

- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (or use VS Code launch config)
- **Build for production**: `npm run build`
- **Format code**: `npm run fmt` (uses Prettier + Astro plugin)
- **Add question sets**: Copy `src/dbs/template.json`, follow schema and instructions in `.github/instructions/questionsdb.instructions.md`.
- **Deploy**: GitHub Actions auto-deploys `develop` branch to GitHub Pages.

## Project Conventions & Patterns

- **TypeScript**: All logic and data types are typed (see `src/components/dto/question.ts`).
- **Path Aliases**: Use `@/` for `src/` (see `tsconfig.json` and `components.json`).
- **React in Astro**: Use `client:load` for interactive components.
- **Accessibility**: All interactive elements must have proper ARIA labels and keyboard support.
- **Localization**: All question/answer content must be in English (`language: "en"` in DB files).
- **No backend**: All data is static and loaded at build/runtime from JSON.

## Examples

- To add a new exercise:
  1. Create `src/dbs/my-exercise.json` using the template and schema.
  2. The exercise will auto-appear on the homepage and at `/q/my-exercise`.
- To add a new UI component: Place in `src/components/ui/`, use Tailwind and `cn` utility from `src/lib/utils.ts`.

## References

- [README.md](../README.md): Project intro and setup
- [questionsdb.instructions.md](../.github/instructions/questionsdb.instructions.md): Strict DB file rules
- [schema.json](../src/dbs/schema.json): JSON schema for question sets

---

For any new code, follow the above conventions and reference existing files for structure and style. When in doubt, prefer explicit types, accessibility, and schema validation.
