## **FinChat System Architecture**

This diagram shows the end-to-end flow of data and requests, from the user's browser to the backend services and external AI models.

#### **1\. User & Client Layer**

* **User's Browser**: The entry point for all user interaction.  
* **Frontend Container (Nginx \+ React)**:  
  * The user accesses the application via `http://localhost`.  
  * A dedicated **Nginx** server serves the static React application files (`index.html`, JS, CSS).  
  * This Nginx is configured for Single-Page Applications (SPAs), correctly handling client-side routing (e.g., `/login`, `/dashboard`). All requests for pages are directed to `index.html`.

#### **2\. Gateway & Security Layer**

* **API Gateway Container (Nginx Reverse Proxy)**:  
  * This is the single, secure entry point for the backend, accessible at `http://localhost:8080`.  
  * It performs **SSL/TLS Termination**, encrypting all external traffic.  
  * It routes all API requests (e.g., `/api/v1/...`) to the FastAPI backend service.  
  * It provides a layer of abstraction and security, hiding the internal network structure.

#### **3\. Application & Logic Layer**

* **Backend Container (FastAPI)**:  
  * Handles all business logic.  
  * **Authentication**: Manages user registration and login, issuing **JWTs** upon successful authentication.  
  * **API Endpoints**: Provides secure endpoints for chat, file upload, and user management. It validates the JWT on every protected request.  
  * **RAG Orchestration**: When a chat query is received, it orchestrates the entire RAG pipeline.  
* **Worker Container (Celery)**:  
  * Runs as a separate process to handle long-running, asynchronous tasks.  
  * Its primary job is **Data Ingestion**: processing large JSON files, creating semantic chunks, and generating vector embeddings without blocking the main API.

#### **4\. Data & State Layer**

* **Database Container (PostgreSQL \+ pgvector)**:  
  * **Relational Data**: Stores user accounts and tenant information in a `public` schema.  
  * **Multi-Tenant Data**: For each tenant, a dedicated schema (e.g., `tenant_abc`) is created to store their financial data and document chunks, ensuring strict data isolation.  
  * **Vector Data**: The `pgvector` extension allows for efficient storage and similarity search of text embeddings.  
* **Message Broker Container (Redis)**:  
  * Acts as the communication backbone between the FastAPI backend and the Celery worker.  
  * When a file is uploaded, the backend places a "job" message into the Redis queue. The worker picks up this job and begins processing.

#### **5\. Intelligence Layer**

* **Embedding Model (`sentence-transformers`)**:  
  * This model runs **locally** inside both the `backend` and `worker` containers.  
  * It's used to convert text (user queries and document chunks) into numerical vectors.  
* **External Cloud LLM (Perplexity Pro)**:  
  * The "brain" of the application.  
  * The FastAPI backend makes a secure, server-to-server API call to Perplexity, sending the user's query along with the context retrieved from the database.

---

### **Data Flows in Action**

#### **Flow 1: User Registration**

1. User fills out the registration form in the **React App**.  
2. The request goes to the **API Gateway**, which forwards it to the **FastAPI Backend**.  
3. The backend creates a new `tenant` and `user` in the **PostgreSQL** public schema.  
4. It then creates a new, dedicated schema (e.g., `tenant_xyz`) for the new tenant.

#### **Flow 2: Data Upload & Processing**

1. An authenticated user uploads a JSON file via the **React App**.  
2. The request hits the **API Gateway** and is forwarded to the **FastAPI Backend**.  
3. The backend places a task message (containing the file path and `tenant_id`) into the **Redis** queue.  
4. The **Celery Worker** picks up the task.  
5. The worker processes the file, chunks the text, and uses the local **Embedding Model** to create vectors.  
6. The worker then connects to **PostgreSQL** and saves the chunks and vectors into the correct tenant's schema.

#### **Flow 3: Chat Query**

1. An authenticated user sends a message from the **React App**.  
2. The request goes through the **API Gateway** to the **FastAPI Backend**.  
3. The backend uses the local **Embedding Model** to convert the user's query into a vector.  
4. It queries the **PostgreSQL** database (in the user's tenant schema) to find the most relevant document chunks using vector similarity search.  
5. The backend constructs a detailed prompt containing the user's query and the retrieved context.  
6. It sends this prompt in an API call to the **Perplexity Pro LLM**.  
7. Perplexity returns a factually-grounded answer.  
8. The backend sends this answer back through the gateway to the React app, which displays it to the user.

