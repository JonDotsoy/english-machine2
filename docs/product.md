# English Machine: Product Overview

## What is English Machine?

**English Machine** is an open-source, web-based platform designed to help users practice and reinforce their English language skills. The platform focuses on verb tenses, phrasal verbs, and essential vocabulary, providing a wide variety of interactive exercises and quizzes. All content is curated in English and follows a strict schema for consistency and quality.

## Key Features

- **Open Source & Free**: Licensed under MIT, English Machine is free to use and modify.
- **Extensive Question Database**: All exercises are stored in a public JSON-based database, making it easy to add or update question sets.
- **Focus on English Grammar & Vocabulary**: Covers verb tenses, phrasal verbs, and basic vocabulary (including English-Spanish sets for household and restaurant terms).
- **Interactive Quizzes**: Dynamic, multi-choice and fill-in-the-blank exercises with instant feedback.
- **Modern UI**: Built with Astro, React, and Tailwind CSS for a fast, accessible, and responsive experience.
- **No Backend Required**: All data is static and loaded at build/runtime, ensuring privacy and simplicity.
- **Accessibility**: All interactive elements are ARIA-labeled and keyboard-friendly.
- **Localization**: All content is in English, with some bilingual sets for vocabulary practice.
- **Easy Contribution**: Developers can add new question sets by following a clear schema and instructions.
- **Auto-Deploy**: GitHub Actions automatically deploys the latest version to GitHub Pages.

## Benefits

- **For Learners**: Practice English grammar, phrasal verbs, and vocabulary at your own pace, with immediate feedback and clear examples.
- **For Educators**: Use as a classroom supplement or homework tool; easily create custom question sets for your students.
- **For Developers**: Contribute new exercises or UI components, or fork the project to create your own language-learning platform.
- **Privacy-Friendly**: No user accounts or tracking; all data is local and public.

## Key Use Cases

- **Self-Study**: Learners can independently practice and test their English skills.
- **Classroom Support**: Teachers can direct students to specific exercises or create new ones.
- **Custom Quiz Creation**: Anyone can add new question sets by copying the template and following the schema.
- **Open Data Reference**: The question database can be reused or extended for other educational projects.

## How It Works

1. **Browse Exercises**: The homepage lists all available question sets.
2. **Practice**: Select a set to start an interactive quiz, with multiple choice and fill-in-the-blank formats.
3. **Contribute**: Developers can add new sets by copying the template and following the schema and instructions.

## Technology Stack

- **Astro**: Static site generator for fast, modern web apps.
- **React**: For interactive quiz components.
- **Tailwind CSS**: Utility-first CSS for styling.
- **Nanostores**: Lightweight state management for session and quiz state.

## Getting Started

- Clone the repo and run `npm install`.
- Start the dev server with `npm run dev`.
- Add new question sets in `src/dbs/` following the template and schema.

For more details, see the [README.md](../README.md) and [questionsdb.instructions.md](../.github/instructions/questionsdb.instructions.md).
