# Project Overview

This monorepo contains three interconnected applications designed to modernize business operations and improve client engagement.

---

### 1. **API**

Node.js server built with **TypeScript**, bundled with **tsup**.

- **Primary Functionality:**
  - Handles authentication via **AWS Cognito**.
  - Manages session state with **express-session**.
  - Provides REST API endpoints for client data, attendance tracking, and internal operations.

- **Hosting & Services:**
  - **Hosted on**: AWS EC2 with **PM2** for process management.
  - **AWS Services Used**:
    - **IAM** — access control
    - **Secrets Manager** — credential management
    - **RDS (PostgreSQL)** — persistent data storage
    - **SES** — transactional email services
    - **Cognito** — user authentication and token management

- **Commands:**

  ```bash
  npm install   # Run at project root
  npm run dev --workspace=api
  npm run build --workspace=api
  npm run start --workspace=api
  ```

---

### 2. **Internal App**

React-based internal web application for business operations.

- **Functionality:**
  - Provides authenticated access for staff to manage attendance records and client information.
  - Implements role-based access control via **Cognito** integration.
  - Currently expanding with a dashboard for metrics on attendance trends and client engagement.

- **UI & Styling:**
  - Built with **shadcn/ui** components.

- **Hosting Plan:**
  - To be hosted on **Cloudflare Pages** (in progress).

- **Commands:**

  ```bash
  npm install   # Run at project root
  npm run dev --workspace=internal-app
  npm run build --workspace=internal-app
  ```

---

### 3. **Public Website**

Static marketing website built with **Astro**.

- **Functionality:**
  - Provides public-facing company information.
  - Modified from [Start Bootstrap Agency](https://github.com/startbootstrap/startbootstrap-agency) templates.

- **Hosted on**: **Cloudflare Pages**

- **Live Site**: [https://adexperiences.com/](https://adexperiences.com/)

- **Commands:**

  ```bash
  npm install   # Run at project root
  npm run dev --workspace=website
  npm run build --workspace=website
  ```

---

### Monorepo Structure

- Managed with **npm workspaces**.
- Dependencies installed at the root.
- Separate workspaces for API, Internal App, and Public Website.

---

### Credits

- **Public Website**: Modified from [Start Bootstrap Agency](https://github.com/startbootstrap/startbootstrap-agency).
- **Internal App UI**: Built with [shadcn/ui](https://ui.shadcn.com/) components.

---
