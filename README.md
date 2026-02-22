# Access Request System

An internal service for managing application access requests with AI-powered evaluation.

## General Architecture Diagram

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    classDef backend fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef infra fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,color:#e65100
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c

    subgraph "Frontend (React + Vite)"
        UI[User Interface]:::frontend
        SDK[Access SDK]:::frontend
        UI --> SDK
    end

    subgraph "Backend (NestJS)"
        API[REST API]:::backend
        GQL[GraphQL API]:::backend
        Auth[Auth Module]:::backend
        OAI[OpenAI Module]:::backend
        Prisma[Prisma ORM]:::backend

        SDK --> API
        SDK --> GQL
        API --> Auth
        GQL --> Auth
        Auth --> OAI
        Auth --> Prisma
        OAI --> Prisma
    end

    subgraph "Infrastructure"
        DB[(PostgreSQL Database)]:::infra

        Prisma --> DB
    end

    subgraph "External Services"
        OpenAIAPI[OpenAI API]:::external
        OAI -.-> OpenAIAPI
    end
```

## Database Schema Diagram (ERD)

```mermaid
erDiagram
    Employee ||--o{ AccessRequest : ""
    Employee ||--|| EmployeeMetadata : "has"

    AccessRequest ||--|| AiEvaluation : "has"

    Employee {
        String id PK
        String email UK
        String name
        String password
        Role role "EMPLOYEE | APPROVER"
        DateTime createdAt
    }

    EmployeeMetadata {
        String id PK
        String employeeId FK
        String department
        String jobTitle
        Int tenureMonths
        DateTime updatedAt
    }

    AccessRequest {
        String id PK
        String requestorId FK
        String subjectId FK
        String resource
        String reason
        RequestStatus status "PENDING | APPROVED | DENIED"
        String decisionBy FK
        DateTime decisionAt
        DateTime createdAt
        DateTime updatedAt
    }

    AiEvaluation {
        String id PK
        String requestId FK
        String recommendation
        String reasoning
        Float confidenceScore
        DateTime createdAt
    }
```

## Key Architectural Decisions and Assumptions

- **Monorepo Structure**: Built within an Nx monorepo.
- **NestJS Backend**: Chosen for its modular architecture, strong TypeScript support, and built-in support for both REST and GraphQL.
- **Dual API Approach**:
  - **REST**: Used for authentication and potentially other standard operations.
  - **GraphQL**: Used for complex data fetching of access requests, providing flexibility for the frontend.
- **Prisma ORM**: Used for type-safe database access and easy schema migrations.
- **AI-Powered Evaluation**: Integrates with OpenAI to provide automated recommendations for access requests based on requestor/subject metadata and the reason for the request.
- **Mock AI Mode**: The system gracefully falls back to a mock evaluation if no OpenAI API key is provided, allowing for local development without external dependencies.
- **Vibe Design System**: The frontend utilizes the `@vibe/core` design system for a consistent and modern UI.
- **Authentication**: Implemented using **JWT (JSON Web Tokens)** with **Passport.js**. The system uses a stateless authentication flow where the token is stored on the client and sent with each request (including GraphQL) to authorize users based on their roles.
- **Testing**:
  - **Unit Tests**: Implemented for core services and utilities.
  - **E2E Tests**: Implemented using Cypress for critical user flows (e.g., login).

## How to Run the Service

### Prerequisites

- Node.js (v20+)
- Docker and Docker Compose (for database)

### Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/GuySimai/access-request-system.git
    cd access-request-system
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:

    - Create a `.env` file in `apps/access-backend/`:

      ```env
      # Database Credentials
      DB_USER=postgres
      DB_PASSWORD=1234
      DB_NAME=access_db
      DB_PORT=5433

      # Prisma Connection URL (uses the variables above)
      DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public"

      # App Settings
      PORT=3000
      NODE_ENV=local
      JWT_SECRET=monday_access_system_secret_2026
      OPENAI_API_KEY=your_openai_api_key
      ```

    - Create a `.env` file in `apps/access-frontend/`:
      ```env
      VITE_API_URL=http://localhost:3000/api
      VITE_GQL_URL=http://localhost:3000/graphql
      ```

4.  **Start the database**:
    ```bash
    docker-compose -f apps/access-backend/docker-compose.yml up -d
    ```
5.  **Run database migrations and seed**:
    ```bash
    npx nx prisma-generate access-backend
    npx nx prisma-deploy access-backend
    npm run db:seed
    ```
6.  **Generate SDK Types**:
    ```bash
    npx nx typegen access-backend
    ```
7.  **Start the Backend**:
    ```bash
    npx nx serve access-backend
    ```
8.  **Start the Frontend**:
    ```bash
    npx nx serve access-frontend
    ```
    The frontend will be available at `http://localhost:5173`.

### Test Accounts

You can log in using the following seeded accounts:

- **Admin** (`admin@monday.com` / Password: `1234`): Has an **APPROVER** role. Can view all access requests in the system and has the authority to approve or deny them.
- **Employee** (`employee1@monday.com` / Password: `1234`): Has an **EMPLOYEE** role. Can create new access requests and view only the requests they have submitted or those where they are the subject.

## Example and Explanation of Deployment to AWS (Kubernetes & ArgoCD)

This section outlines a modern GitOps deployment strategy for the Access Request System on AWS using Kubernetes (EKS) and ArgoCD.

```mermaid
graph TD
    subgraph "CI/CD Pipeline"
        Dev[Developer] -->|Push Code| GitHub[GitHub Repo]
        GitHub -->|Trigger CI| CI["CI Pipeline (GitHub Actions)"]
        CI -->|Build & Push Image| ECR[Amazon ECR]
        CI -->|Update Manifest| GitHub
    end

    subgraph "AWS Cloud"
        subgraph "EKS Cluster (Kubernetes)"
            ArgoCD[ArgoCD Controller]

            subgraph "Application Namespace"
                Pod[App Pods]
                K8sSecret[K8s Secrets]
            end
        end

        SSM[Parameter Store]
        ESO[External Secrets Operator]
    end

    ArgoCD -- "Watches & Syncs" --> GitHub
    ArgoCD -- "Deploys" --> Pod

    SSM -- "Syncs Secrets" --> ESO
    ESO -- "Creates" --> K8sSecret
    K8sSecret -.-> Pod
```

### Deployment Flow:

1.  **CI Process**:

    - Code is pushed to **GitHub**.
    - A CI pipeline (e.g., GitHub Actions) builds the Docker image and pushes it to **Amazon ECR**.
    - The pipeline updates the Kubernetes manifests (Kustomize) in the repository with the new image tag.

2.  **CD Process (GitOps)**:

    - **ArgoCD**, running inside the **EKS (Kubernetes)** cluster, detects the change in the GitHub repository.
    - It automatically syncs the cluster state to match the new configuration, deploying the new version of the application pods.

3.  **Secrets Management**:
    - Sensitive data (DB credentials, API keys) is managed in **AWS Systems Manager Parameter Store**.
    - An **External Secrets Operator** (or similar mechanism) running in the cluster syncs these values into native **Kubernetes Secrets**, which are then mounted into the application pods.
