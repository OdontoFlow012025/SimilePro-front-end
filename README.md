# Simile Pro - Dental Clinic Management System

**Simile Pro** is a modern, comprehensive web application designed to streamline the management of dental clinics. It integrates administrative, financial, and clinical workflows into a single, intuitive platform.

## 🚀 Key Features

*   **Multi-Tenant Architecture:** Designed to serve multiple clinics and units efficiently.
*   **Internationalization (i18n):** Native support for **Portuguese (pt-BR)**, **English (en)**, and **Spanish (es)**.
*   **Reception Module:**
    *   **Patient Check-in:** Streamlined flow for tracking patient arrival and waiting times.
    *   **Kanban Board:** Visual management of appointments (Scheduled, Waiting, In Service).
    *   **RNDS Compliance:** Patient registration form aligned with Brazilian National Health Data Network standards.
*   **Scheduling:** Smart calendar validation, preventing conflicts and organizing daily agendas.
*   **Dashboard:** Real-time metrics for clinic performance (Revenue, Appointments, Occupancy).
*   **Authentication:** Secure login and customized access for Dentists, Receptionists, and Managers.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** JavaScript / TypeScript
*   **Styling:** Tailwind CSS
*   **Internationalization:** `next-i18n-router`
*   **State/Validation:** `zod` for schemas, React Hooks.
*   **Icons:** Google Material Symbols

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Yarn or NPM

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Simile Pro012025/similepro-front-end.git
    cd similepro-front-end
    ```

2.  Install dependencies:
    ```bash
    yarn install
    # or
    npm install
    ```

3.  Run the development server:
    ```bash
    yarn dev
    # or
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the application.

## 🌐 Localization

The application automatically detects the browser language or uses the URL path prefix:
- `/pt-BR/...` for Portuguese
- `/en/...` for English
- `/es/...` for Spanish

To update translations, edit the JSON files in `src/dictionaries/`.

## 🤝 Contributing

Please ensure you create a feature branch for any changes:
```bash
git checkout -b feat/your-feature-name
```
For bug fixes:
```bash
git checkout -b fix/your-fix-name
```

---
© 2026 Simile Pro Inc.
