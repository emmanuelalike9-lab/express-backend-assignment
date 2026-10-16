# EXPRESS.JS BACKEND ASSIGNMENT



This repository contains:
- A simple CRUD app (students) implemented in one server file (server.js).
- A Server-Sent Events (SSE) endpoint that streams live server time to the browser every 2 seconds.
- An HTML client (index.html) that connects to SSE and displays the live time.
- This README which contains the required research and instructions.

---

SECTION A: FOLDER ARRANGEMENT (Typical Express app)

Below are common folders/files in a properly organized Express app and what each should contain:

1. services/
- Purpose: Business-logic layer. Services perform the actual data processing and complex operations (e.g., sending emails, payment processing, orchestrating repository calls).
- Contains: Functions/classes that implement use-cases, reusable operations that controllers call. Should have minimal HTTP knowledge.

2. controllers/
- Purpose: Receive HTTP request, call services, return HTTP response.
- Contains: Functions mapped to routes (e.g., createStudent, getStudents). Responsible for input validation coordination and sending proper HTTP responses.

3. models/
- Purpose: Data layer representations (ORM/ODM schemas, database queries).
- Contains: Schema definitions (Mongoose models, Sequelize models), query helpers and data-access abstractions.

4. routes/
- Purpose: Define HTTP routes and attach controllers.
- Contains: route definitions (e.g., /api/students -> router), route-level middlewares.

5. middlewares/
- Purpose: Reusable request/response processing steps.
- Contains: Authentication, authorization, logging, error-handling, validation middlewares.

6. config/
- Purpose: Application configuration.
- Contains: Code to read environment variables and configuration per environment (development, production), and often constants.

7. utils/
- Purpose: Generic helper functions shared across the project.
- Contains: small helpers (formatting, token generators, date helpers).

8. app.js
- Purpose: Express application setup.
- Contains: Creation of the express app, middleware registration (body parsing, CORS, logging), route mounting, error handling. Does NOT start the HTTP server.

9. server.js
- Purpose: Entry point that starts the HTTP server and listens on a port.
- Contains: imports app (from app.js), reads PORT, calls app.listen(), handles process events (SIGINT/SIGTERM) and graceful shutdown.

Request flow (high level)
1. Incoming HTTP request arrives at server.js which accepts network connections and forwards them to app (Express).
2. In app.js, middleware stack runs (e.g., logging, body parsing, authentication).
3. Route matching: the request is routed to the route handler defined in routes/ which forwards to a controller.
4. Controller: extracts/validates request data, calls one or more services to perform business logic.
5. Services: interact with models/data layer to read/write DB or perform side-effects.
6. Model/data layer: performs DB queries and returns results to services.
7. Response bubble-up: service returns to controller → controller formats HTTP response and sends it back.
8. Error handling middleware catches any thrown error and returns an appropriate HTTP error response.

---

SECTION B: ENVIRONMENTAL VARIABLES

1. What are environment variables?
Environment variables are key-value pairs provided to processes from the operating system (or environment) that influence application behavior without changing code. Examples: PORT=3000, DATABASE_URL, NODE_ENV=production.

2. Why do we need them in backend development?
- Separate configuration from code (12-factor app).
- Allow different settings per environment (development, staging, production).
- Avoid hardcoding environment-specific values and secrets in code.

3. Why we don’t hardcode sensitive things like DB URL, PORT, secret keys?
- Security: hardcoded secrets can leak via source control.
- Flexibility: easier to change config without editing code.
- Best practice: secrets and environment-specific config belong outside code.

4. What is dotenv and what does it do?
- dotenv is an npm package that reads a .env file and loads environment variables into process.env when the application starts (mainly for local development).

5. What is .env and what is .gitignore and why we must not push .env to GitHub?
- .env is a file (usually at the project root) storing variable assignments for local development, e.g. PORT=3000.
- .gitignore tells git which files to ignore. You must include .env in .gitignore because .env often contains secrets (API keys, DB passwords). Committing it risks exposing credentials publicly.

6. Example .env file content
PORT=3000
NODE_ENV=development
JWT_SECRET=verysecretvalue
DATABASE_URL=mongodb://username:password@localhost:27017/mydb

(Place an example file .env.example in the repo that shows keys without actual secrets.)

---

SECTION C: SERVER-SENT EVENTS (SSE)

1. What is Server-Sent Events?
SSE is a unidirectional streaming technology (server → client) that allows a server to push updates to browsers over a single long-lived HTTP connection. In browsers, SSE is exposed via the EventSource API.

2. Differences: SSE vs WebSockets vs Long Polling vs normal REST API
- REST API: request-response; client initiates and server responds once. No push.
- Long polling: client makes request; server holds it open until data available, then returns; client immediately re-requests. Emulates push but heavy on requests.
- WebSockets: full-duplex, bi-directional persistent TCP-level connection; both client and server can send messages.
- SSE: server-to-client streamed updates over HTTP (text/event-stream); client receives pushed events; simpler and good for one-way updates. Uses automatic reconnection.

3. When to use SSE? (3 real examples)
- Real-time stock price or market ticker where server streams updates to many watchers.
- Live news feed / server log streaming (administration dashboards).
- Real-time notifications or status updates for background tasks (build systems, CI logs).

4. Advantages and disadvantages of SSE
Advantages:
- Simple to implement on server and client (EventSource in browsers).
- Lightweight for server→client streaming and auto-reconnect built-in.
- Works over HTTP and is friendly to proxies/load balancers.

Disadvantages:
- Unidirectional only (server → client). For two-way you need WebSockets or separate endpoints.
- Not supported in older browsers (but widely supported in modern browsers).
- Limited binary support (text-based).


---

ADDITIONAL: POSTMAN DOCUMENTATION (published)

Public Postman documentation for this project:
https://documenter.getpostman.com/view/59015334/2sBYHSxL8C

---

SUBMISSION CHECKLIST

Files/links to submit
1. README.pdf — a PDF version of this README containing Sections A–E.
2. GitHub repo link — https://github.com/emmanuelalike9-lab/express-backend-assignment
3. Postman Documentation (public) link — https://documenter.getpostman.com/view/59015334/2sBYHSxL8C

