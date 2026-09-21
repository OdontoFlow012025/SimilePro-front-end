# SimilePro-front-end

SimilePro is a modern, responsive web application designed for dental clinic management. This repository contains the front-end source code, built with the latest web technologies to ensure a high-performance, accessible, and user-friendly experience for both clinic administrators and patients.

## System Overview & Evaluation

SimilePro provides a comprehensive suite of tools tailored to streamline dental practice workflows. The front-end is designed as a landing page and dashboard interface (currently featuring mockups) that highlights the system's core capabilities:
- **Smart Scheduling**: Manage appointments and calendars efficiently.
- **Financial Management**: Track revenue, invoices, and payments.
- **Patient Charts (Electronic Health Records)**: Securely manage patient histories and documents.

The architecture strictly follows modern React patterns, utilizing Server Components and the Next.js App Router for optimal performance and SEO. The UI is component-driven, responsive by design, and supports both theming and multiple languages out of the box.

## Main Updates & Features

- **Framework Upgrade**: Upgraded to **Next.js 16** leveraging the robust App Router architecture.
- **React 19 Integration**: Utilizing the latest React 19 features for improved rendering performance and state management.
- **Next-Gen Styling**: Migrated to **Tailwind CSS v4** for faster builds and a streamlined utility-first styling approach.
- **Internationalization (i18n)**: Fully integrated multi-language support using `next-i18n-router`, allowing localized content based on user preference.
- **Dark/Light Mode**: Seamless theme switching implementation powered by `next-themes`.
- **Component Architecture**: Modular component structure (Hero, Features, Stats, Testimonials, RoleSection, CTABanner) for easy maintainability and reusability.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Theming**: `next-themes`
- **Internationalization**: `next-i18n-router`
- **Linting**: ESLint

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.
