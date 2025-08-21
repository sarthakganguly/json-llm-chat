# FinChat: AI-Powered Financial Data Analysis

FinChat is a secure, multi-tenant, production-ready application that allows users to upload complex financial data from JSON files and interact with it through a conversational AI interface. The system uses a Retrieval-Augmented Generation (RAG) pipeline to provide contextually accurate answers grounded in the user's private data.



---

## ✨ Features

* **Secure Multi-Tenancy**: Complete data isolation between tenants using a schema-per-tenant model in PostgreSQL.
* **Role-Based Access Control (RBAC)**: JWT-based authentication and authorization for users.
* **Asynchronous Data Ingestion**: Upload large JSON files (up to 1GB) which are processed in the background by a Celery worker, preventing API blockage.
* **Retrieval-Augmented Generation (RAG)**: User queries are answered by a cloud LLM (Perplexity Pro) using relevant context retrieved from a `pgvector` database, ensuring factual and accurate responses.
* **Dockerized Environment**: The entire application stack is containerized with Docker and managed by Docker Compose for easy setup and deployment.
* **Modern Frontend**: A responsive and professional user interface built with React, TypeScript, and Tailwind CSS.
* **Secure API Gateway**: Nginx is used as a reverse proxy for both the backend API and the frontend application.

---

## 🏗️ Architecture

The application is built on a microservices architecture, with each component running in its own Docker container:

* **Frontend**: A React SPA served by a lightweight Nginx server.
* **API Gateway**: An Nginx reverse proxy that routes traffic to the appropriate backend service.
* **Backend**: A high-performance API built with FastAPI (Python).
* **Database**: PostgreSQL with the `pgvector` extension for storing both relational and vector data.
* **Worker**: A Celery worker for handling long-running background tasks like file ingestion and embedding.
* **Message Broker**: Redis, used by Celery to manage the task queue.

---

## 🚀 Getting Started

Follow these instructions to get the entire application running on your local machine.

### Prerequisites

* **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
* **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd financial-chat-app
    ```

2.  **Configure Environment Variables**
    * Make a copy of the example environment file:
        ```bash
        cp .env.example .env
        ```
    * Open the `.env` file and add your **Perplexity Pro API key**:
        ```
        PERPLEXITY_API_KEY=your_perplexity_api_key_here
        ```
    * (Optional) You can also change the default database credentials and JWT secret key in this file.

3.  **Build and Run the Application**
    From the root directory of the project, run the following command. This will build all the Docker images and start the services.
    ```bash
    docker-compose up --build
    ```
    The first build may take a few minutes as it needs to download the base images and install all dependencies.

### Accessing the Application

* **Frontend Application**: Open your browser and navigate to `http://localhost`
* **Backend API Docs**: The interactive Swagger UI for the API is available at `http://localhost:8080/docs`

---

## 📁 Project Structure

This structure separates the frontend, backend, and gateway services into their own directories, each with its own Dockerfile, while the docker-compose.yml at the root orchestrates everything.
```
.
├── .env                # Local environment variables (API keys, DB credentials) - NOT in Git
├── .gitignore          # Specifies files and folders to be ignored by Git
├── api_gateway/
│   └── nginx.conf      # Nginx configuration for the backend API reverse proxy
├── backend/
│   ├── app/            # Main FastAPI and Celery application source code
│   ├── Dockerfile      # Instructions to build the backend and worker Docker image
│   └── requirements.txt  # Python package dependencies
├── docker-compose.yml  # The master file to orchestrate all services
├── frontend/
│   ├── public/         # Static assets for the frontend
│   ├── src/            # Main React application source code
│   ├── Dockerfile      # Instructions to build the frontend Docker image
│   ├── nginx.conf      # Nginx configuration to serve the React app
│   └── package.json    # Node.js project manifest and dependencies
└── README.md           # Project documentation
```
---

## 💻 Technology Stack

* **Backend**: Python, FastAPI, Celery, SQLAlchemy
* **Frontend**: React, TypeScript, Vite, Tailwind CSS, Axios
* **Database**: PostgreSQL, pgvector
* **Infrastructure**: Docker, Docker Compose, Nginx, Redis
* **AI**: Perplexity Pro (Cloud LLM), Sentence-Transformers (Embedding)
