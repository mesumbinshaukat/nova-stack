````markdown
# NovaStackJS

**NovaStackJS** is a fully featured, open-source, monorepo-style web development framework built primarily in TypeScript/JavaScript with embedded PHP via WebAssembly. It enables PHP scripts to run natively alongside modern JavaScript/TypeScript code. NovaStackJS is designed for modern full-stack development, supporting multiple frontends, robust backend features, versatile database adapters, and even a custom AI chatbot engine. Its architecture and tooling prioritize modularity, security, and ease of deployment on cloud-native or edge platforms.

---

## Table of Contents

1. [Overview](#overview)  
2. [Core Language Support](#core-language-support)  
3. [Frontend Integration](#frontend-integration)  
4. [Backend Features](#backend-features)  
   - [RESTful API Structure](#restful-api-structure)  
   - [Authentication & Security](#authentication--security)  
   - [Error Handling & Logging](#error-handling--logging)  
5. [Database Layer](#database-layer)  
   - [Relational (SQL) Adapters](#relational-sql-adapters)  
   - [NoSQL Adapters](#nosql-adapters)  
6. [Admin & Dev Tools](#admin--dev-tools)  
   - [Admin Dashboard](#admin-dashboard)  
   - [CLI Tooling](#cli-tooling)  
   - [Global Configuration](#global-configuration)  
7. [Deployment Compatibility](#deployment-compatibility)  
   - [Vercel & Netlify](#vercel--netlify)  
   - [Docker & VPS (DigitalOcean, Render, Railway, etc.)](#docker--vps-digitalocean-render-railway-etc)  
   - [CI/CD Examples](#cicd-examples)  
8. [AI Chatbot Engine](#ai-chatbot-engine)  
   - [Model Architecture & Training](#model-architecture--training)  
   - [API & Frontend Integration](#api--frontend-integration)  
9. [UX & UI Frameworks](#ux--ui-frameworks)  
10. [PHP Framework Compatibility](#php-framework-compatibility)  
11. [Monorepo Structure](#monorepo-structure)  
12. [Ease of Use & Documentation](#ease-of-use--documentation)  
13. [Getting Started](#getting-started)  
14. [Contributing](#contributing)  
15. [License](#license)  

---

## Overview

NovaStackJS is a monorepo framework that combines:

- **TypeScript/JavaScript** as the primary backend language  
- A **WASM-compiled PHP interpreter** for running PHP code natively  
- Prebuilt templates and integration for major frontend frameworks  
- A modular, pluggable **database adapter** system (SQL + NoSQL)  
- Built-in **authentication**, **security**, **logging**, and **error handling**  
- An **Admin dashboard** with role-based access control  
- A zero-dependency, custom **AI chatbot engine** (written in Python + NumPy)  
- Support for deployment on **Vercel**, **Netlify**, and **Docker/VPS** environments  

Everything is organized in a Yarn/NPM workspaces monorepo, ensuring consistent tooling and easy collaboration. New developers can clone the repo and run a single command to get started.

---

## Core Language Support

- The entire framework is written in **Node.js with TypeScript** for the backend and CLI, providing strong type safety and modern ES features.  
- A **WebAssembly-compiled PHP interpreter** is embedded into the runtime. We compile the official PHP source (Zend Engine) to a Wasm target (e.g. `wasm32-unknown-unknown` or `wasm32-emscripten`) and load it in Node.js using the WebAssembly API. This allows NovaStackJS to run PHP scripts side-by-side with JavaScript handlers.

  ```ts
  // packages/wasm-engine/src/phpRunner.ts
  import fs from 'fs';
  import path from 'path';

  // Load and compile the PHP WASM module
  const wasmBuffer = fs.readFileSync(path.resolve(__dirname, 'php.wasm'));
  const phpModule = await WebAssembly.compile(wasmBuffer);
  const phpInstance = await WebAssembly.instantiate(phpModule, {
    /* Provide any required imports, e.g. for file I/O */
  });

  // Now phpInstance.exports contains PHP runtime functions such as `php_run`.
  export default phpInstance;
````

* With this setup, a route in the server can decide whether to invoke a PHP script or a TypeScript/JavaScript handler. For example:

  ```ts
  // packages/server/src/routes/blog.ts
  import { Router, Request, Response } from 'express';
  import phpInstance from '@nova/wasm-engine/phpRunner';

  const router = Router();

  router.get('/blog/:id', async (req: Request, res: Response) => {
    // Pass superglobals into PHP run call
    const output = await phpInstance.exports.php_run(`render_post.php`, {
      GET: { id: req.params.id },
      /* other superglobals as needed */
    });
    res.send(output.html);
  });

  export default router;
  ```

* This design ensures that legacy PHP applications or new PHP scripts can run seamlessly in the same project as modern TypeScript code.

---

## Frontend Integration

NovaStackJS provides **prebuilt templates** for all major frontend frameworks. Each is organized under its own workspace within the monorepo:

* **React / Next.js** (`packages/frontend-react`)

  * Uses Next.js for SSR/SSG
  * Example pages, API calls, and `vercel.json` preconfigured
* **Vue 3** (`packages/frontend-vue`)

  * Uses Vite & Vue Router
* **Angular** (`packages/frontend-angular`)

  * Uses Angular CLI
* **Svelte / SvelteKit** (`packages/frontend-svelte`)
* **SolidJS** (`packages/frontend-solid`)

  * Uses Vite & Solid Router
* **Qwik** (`packages/frontend-qwik`)

  * Uses official Qwik starter

Each template includes:

1. Example pages with routing configured
2. Sample components demonstrating how to call backend APIs
3. Configuration files for deployment (e.g., `vercel.json`, `netlify.toml`)
4. A basic folder structure (`src/`, `public/`, etc.)

To scaffold a new frontend workspace, run:

```bash
npx novastack create app --template <framework> my-frontend
```

Where `<framework>` can be `react`, `next`, `vue`, `angular`, `svelte`, `solid`, or `qwik`. If a desired framework is not listed, the user can still integrate it by manually adding a new workspace following NovaStackJS conventions.

---

## Backend Features

The NovaStackJS backend is a **Node.js/TypeScript** server framework that ships with Express.js by default (but is pluggable). It offers:

### RESTful API Structure

* Controllers are organized under `packages/server/src/controllers`. Each controller exports functions that handle incoming requests and use the database layer.

* Example: `packages/server/src/controllers/itemController.ts`:

  ```ts
  import { Request, Response } from 'express';
  import db from '@nova/server/db';

  export async function getItem(req: Request, res: Response) {
    const item = await db.find('items', { id: req.params.id });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  }
  ```

* The main router (`packages/server/src/index.ts`) assembles all controllers and mounts them under appropriate paths, e.g.:

  ```ts
  import express from 'express';
  import { getItem } from './controllers/itemController';
  import blogRouter from './routes/blog';

  const app = express();
  app.use(express.json());

  app.get('/api/items/:id', getItem);
  app.use('/api/blog', blogRouter);

  export default app;
  ```

### Authentication & Security

NovaStackJS includes a robust, pluggable authentication system:

1. **JWT Authentication**

   * Uses `jsonwebtoken` to issue and verify JSON Web Tokens.
   * On successful login, the server issues a JWT containing the user’s ID, which is stored client-side (e.g. in an HTTP-only cookie or localStorage).
   * A JWT verification middleware checks the `Authorization: Bearer <token>` header for protected routes.

   ```ts
   // packages/server/src/middleware/jwtAuth.ts
   import { Request, Response, NextFunction } from 'express';
   import jwt from 'jsonwebtoken';
   import config from '@nova/server/config';

   export function jwtAuth(req: Request, res: Response, next: NextFunction) {
     const authHeader = req.headers['authorization'];
     if (!authHeader) return res.status(401).json({ error: 'No token provided' });

     const token = authHeader.split(' ')[1];
     try {
       const payload = jwt.verify(token, config.auth.jwtSecret);
       req.user = payload; // attach user info to request
       next();
     } catch (err) {
       return res.status(401).json({ error: 'Invalid token' });
     }
   }
   ```

2. **OAuth2**

   * Built with Passport.js strategies for providers such as Google, GitHub, etc.
   * Example: `/auth/google` initiates Google OAuth flow, and on success, the server issues a JWT.

3. **Session-Based Authentication**

   * Uses `express-session` with a secure session store (e.g., Redis).
   * Session cookies are set with secure, HTTP-only flags.
   * Example configuration for Express:

   ```ts
   import session from 'express-session';
   import connectRedis from 'connect-redis';
   import Redis from 'ioredis';
   import config from '@nova/server/config';

   const RedisStore = connectRedis(session);
   const redisClient = new Redis(config.redisUrl);

   app.use(
     session({
       store: new RedisStore({ client: redisClient }),
       secret: config.auth.sessionSecret,
       resave: false,
       saveUninitialized: false,
       name: 'nova_sid',
       cookie: {
         httpOnly: true,
         secure: config.env === 'production',
         maxAge: 1000 * 60 * 60 * 24, // 1 day
       },
     })
   );
   ```

### Built-In Security Measures

* **CSRF Protection**:
  Uses the `csurf` middleware on any state-changing routes. The server issues a CSRF token and verifies it on form submissions or AJAX POST/PUT/DELETE requests.

  ```ts
  import csurf from 'csurf';
  // Apply CSRF protection to all stateful routes
  app.use(csurf({ cookie: true }));
  ```

* **XSS Protection & HTTP Headers**:
  Uses `helmet` to set secure HTTP headers (Content Security Policy, HSTS, etc.) to mitigate XSS and clickjacking.

  ```ts
  import helmet from 'helmet';
  app.use(helmet());
  ```

* **SQL Injection Prevention**:
  The database layer always uses parameterized queries or ORM methods (never string concatenation). All user inputs are validated/sanitized with `express-validator`.

  ```ts
  import { body, validationResult } from 'express-validator';

  app.post(
    '/api/items',
    [
      body('name').isString().trim().notEmpty(),
      body('price').isFloat({ gt: 0 }),
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, price } = req.body;
      const newItem = await db.insert('items', { name, price });
      res.status(201).json(newItem);
    }
  );
  ```

### Error Handling & Logging

* A **global error middleware** catches uncaught exceptions and returns a standardized JSON error response.

  ```ts
  // packages/server/src/middleware/errorHandler.ts
  import { Request, Response, NextFunction } from 'express';

  export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error('Error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
  }
  ```

* **Logging**:
  Uses a logging library such as **Winston** or **Pino** to log requests and errors in JSON format. Logs can be written to files or streamed to hosted log services (e.g., LogDNA, Datadog). Example with Pino:

  ```ts
  import pino from 'pino';
  import pinoHttp from 'pino-http';

  const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
  app.use(pinoHttp({ logger }));
  ```

---

## Database Layer

NovaStackJS supports multiple relational and NoSQL databases through a **pluggable adapter system**. Each adapter implements a common interface (`connect`, `query`, and `close`).

### Relational (SQL) Adapters

* **Supported Engines**:

  * MySQL
  * PostgreSQL
  * SQLite
  * MSSQL

* **ORM Options**:

  * **TypeORM** or **Prisma** can be used interchangeably. The CLI can scaffold entities and migrations for either choice.
  * Example TypeORM entity:

  ```ts
  // packages/server/src/models/User.ts
  import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

  @Entity({ name: 'users' })
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    passwordHash!: string;

    @Column({ default: false })
    isAdmin!: boolean;
  }
  ```

* **Configuration**:
  Top-level `config.yaml` determines which relational database to use:

  ```yaml
  database:
    default: postgres
    postgres:
      host: localhost
      port: 5432
      username: postgres
      password: secret
      database: nova_db
  ```

### NoSQL Adapters

* **Supported Engines**:

  * **MongoDB** (Mongoose or official driver)
  * **Redis** (for caching or simple key-value data)
  * **Firebase Firestore**
  * **Cassandra**
  * **Neo4j**

* **Adapter Example** (MySQL shown earlier, similarly for others):

  ```ts
  // packages/server/src/db/adapters/MySQLAdapter.ts
  import mysql from 'mysql2/promise';
  import { DbAdapter } from '../adapter';

  export class MySQLAdapter implements DbAdapter {
    private pool: mysql.Pool;

    constructor(private cfg: any) {}

    async connect(): Promise<void> {
      this.pool = mysql.createPool({
        host: this.cfg.host,
        user: this.cfg.user,
        password: this.cfg.password,
        database: this.cfg.database,
      });
    }

    async query(query: string, params: any[] = []): Promise<any> {
      const [rows] = await this.pool.execute(query, params);
      return rows;
    }

    async close(): Promise<void> {
      await this.pool.end();
    }
  }
  ```

* The database layer exposes a unified API (`db.find`, `db.insert`, `db.update`, `db.delete`) regardless of the underlying engine. This makes it trivial to switch from MySQL to MongoDB or Redis by updating the config.

---

## Admin & Dev Tools

NovaStackJS provides built-in tools to make development and administration seamless.

### Admin Dashboard

* Built using **AdminJS** (formerly AdminBro), which auto-generates a React-based admin interface based on defined data models.

* Role-Based Access Control (RBAC) is enforced via middleware that checks the user’s role (e.g., `isAdmin`) stored in JWT/session before granting access to admin routes.

  ```ts
  // packages/server/src/admin.ts
  import AdminJS from 'adminjs';
  import AdminJSExpress from '@adminjs/express';
  import { User, Post } from './models';
  import { Application } from 'express';

  export default function mountAdmin(app: Application) {
    const adminJs = new AdminJS({
      resources: [
        { resource: User, options: { parent: { name: 'Users' } } },
        { resource: Post, options: { parent: { name: 'Content' } } },
      ],
      rootPath: '/admin',
    });

    const ADMIN = {
      email: 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'changeme',
    };

    const router = AdminJSExpress.buildAuthenticatedRouter(
      adminJs,
      {
        authenticate: async (email, password) => {
          if (email === ADMIN.email && password === ADMIN.password) {
            return ADMIN;
          }
          return null;
        },
        cookiePassword: process.env.COOKIE_SECRET || 'cookie-secret',
      },
      null,
      {
        resave: false,
        saveUninitialized: true,
        name: 'admin-session',
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        },
      }
    );

    app.use(adminJs.options.rootPath, router);
  }
  ```

* Once mounted, visiting `https://<domain>/admin` displays a fully functional UI for managing Users, Posts, Roles, and any other registered resources.

### CLI Tooling

NovaStackJS ships with a CLI (`nova`) built on Node.js (using [yargs](https://github.com/yargs/yargs) or [commander](https://github.com/tj/commander.js)). It provides zero-config commands to scaffold and maintain projects:

* `nova setup`:

  * Installs dependencies across all workspaces (using `yarn install` or `npm install`).
  * Sets up Docker containers (e.g., a local MySQL or MongoDB instance) if desired.
  * Runs initial database migrations.

* `nova dev`:

  * Starts all relevant development servers simultaneously:

    * Backend server (Express) in watch mode
    * Frontend dev servers (React, Vue, etc.)
    * Chatbot training/serving process (optional)
  * Uses a utility like [concurrently](https://github.com/open-cli-tools/concurrently) to run multiple processes with one command.

  ```json
  // package.json (root)
  {
    "scripts": {
      "dev": "concurrently \"yarn workspace server dev\" \"yarn workspace frontend-react dev\""
    }
  }
  ```

* `nova build`:

  * Compiles TypeScript in the server and CLI workspaces.
  * Runs the build scripts for each frontend workspace (e.g., `next build`, `vite build`, etc.).
  * Bundles the PHP WASM module if it needs recompilation.

* `nova deploy`:

  * Automates deployment steps based on the target platform configured in `config.yaml`.
  * Examples:

    * For Vercel: runs `vercel --prod` with appropriate environment variables.
    * For Docker/VPS: builds a Docker image, tags it, and pushes to Docker Hub (or directly deploys to a provider).

* `nova generate:model <Name>`:

  * Scaffolds a new database model in `packages/server/src/models/<Name>.ts`.
  * Creates a migration file under `packages/server/src/migrations/`.

* `nova generate:service <Name>`:

  * Scaffolds a new service/controller file under `packages/server/src/services`.

* `nova generate:pages <framework> <Name>`:

  * Creates a new page/component in the specified frontend workspace (e.g., `packages/frontend-react/src/pages/<Name>.tsx`).

* `nova admin:generate`:

  * Updates AdminJS resource registration to include any new models.

All CLI commands read from the global `config.yaml` to determine default values (e.g., database engine, ports, environment variables). This ensures minimal friction for new developers.

### Global Configuration

A top-level `config.yaml` or `config.json` (project root) centralizes settings:

```yaml
app:
  name: NovaStackApp

env: development

server:
  port: 3000

database:
  default: mysql
  mysql:
    host: localhost
    port: 3306
    username: root
    password: secret
    database: nova_db
  postgres:
    host: localhost
    port: 5432
    username: postgres
    password: secret
    database: nova_db
  sqlite:
    filepath: './data/nova.sqlite'

redis:
  url: redis://localhost:6379

auth:
  jwtSecret: supersecretjwtkey
  sessionSecret: supersecretSessionKey
  oauth:
    google:
      clientId: 'GOOGLE_CLIENT_ID'
      clientSecret: 'GOOGLE_CLIENT_SECRET'
    github:
      clientId: 'GITHUB_CLIENT_ID'
      clientSecret: 'GITHUB_CLIENT_SECRET'

deployment:
  target: vercel  # or 'netlify', 'docker', 'digitalocean', etc.
```

* The CLI and runtime code read this configuration at startup (using a library like [`yaml`](https://www.npmjs.com/package/yaml) or [`node-config`](https://github.com/node-config/node-config)).
* Changing the `database.default` value automatically switches between MySQL, PostgreSQL, or SQLite, etc., without changing application code.

---

## Deployment Compatibility

NovaStackJS is designed to deploy seamlessly to multiple modern hosting environments.

### Vercel & Netlify

* **Vercel**:

  * A default `vercel.json` is included in the project root.
  * All API routes (e.g., files under `packages/server/api/*.ts`) are automatically mapped to Vercel Serverless Functions.
  * Frontend Next.js or other static frontends are deployed via Vercel’s file-based deployment system.
  * Example `vercel.json`:

    ```json
    {
      "version": 2,
      "builds": [
        {
          "src": "packages/server/src/index.ts",
          "use": "@vercel/node",
          "config": { "maxDuration": 10 }
        },
        {
          "src": "packages/frontend-react/next.config.js",
          "use": "@vercel/next"
        }
      ],
      "routes": [
        { "src": "/api/(.*)", "dest": "packages/server/src/index.ts" },
        { "src": "/(.*)", "dest": "packages/frontend-react/$1" }
      ]
    }
    ```

* **Netlify**:

  * A default `netlify.toml` is included.
  * Netlify functions are created by building the Express server into a Netlify Function (e.g., via [netlify-lambda](https://github.com/netlify/netlify-lambda) or by using the AWS Lambda adaptor).
  * The frontend is published as a Netlify site, and any static assets are served directly by the CDN.

  ```toml
  [build]
    functions = "packages/server/netlify-functions"
    publish = "packages/frontend-react/out"

  [[redirects]]
    from = "/api/*"
    to = "/.netlify/functions/server"
    status = 200
    force = true
  ```

### Docker & VPS (DigitalOcean, Render, Railway, etc.)

For custom VPS or cloud deployments, a Dockerfile and supporting documentation are provided.

```dockerfile
# Dockerfile at project root
FROM node:18-alpine

# Create and set working directory
WORKDIR /app

# Copy monorepo package.json & lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all source code
COPY . .

# Build everything
RUN yarn build

# Expose port
EXPOSE 3000

# Start the server (backend entrypoint)
CMD ["node", "packages/server/dist/index.js"]
```

* To run locally via Docker:

  ```bash
  docker build -t novastackjs-app .
  docker run -d -p 3000:3000 --name novastackjs-container novastackjs-app
  ```

* This image can be deployed to any Docker-compatible host (DigitalOcean App Platform, AWS ECS, Google Cloud Run, Render, Railway, etc.).

### CI/CD Examples

NovaStackJS includes example workflows for GitHub Actions. These can be adapted for GitLab CI/CD, CircleCI, or Bitbucket Pipelines.

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  lint-build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Lint code
        run: yarn lint

      - name: Run tests
        run: yarn test

      - name: Build all workspaces
        run: yarn build

  deploy:
    runs-on: ubuntu-latest
    needs: lint-build-test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Deploy to Vercel
        run: yarn deploy
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

* The `deploy` job runs only when pushing to `main`. For other targets (e.g., Docker Hub, DigitalOcean), adjust the `deploy` step accordingly.

---

## AI Chatbot Engine

NovaStackJS includes a fully custom **AI chatbot** written from scratch in Python—**no external model APIs** (e.g., OpenAI or HuggingFace) are required. It relies only on minimal dependencies such as NumPy and a basic tokenizer.

### Model Architecture & Training

* The chatbot uses a small Transformer-based architecture implemented purely with **NumPy**.
* Tokenization is handled via a simple byte-pair encoding (BPE) tokenizer implemented in Python (or imported via a lightweight `tokenizers` library).
* On the first run (e.g., `python packages/chatbot/setup.py`), the chatbot trains or fine-tunes on the project’s own codebase, documentation, and database entries—thereby creating a project-specific knowledge base.

Example training script:

```python
# packages/chatbot/train.py
import os
import numpy as np
from tokenizer import BPETokenizer
from model import ChatbotModel

# Load or build the tokenizer
tokenizer = BPETokenizer(vocab_size=5000)
code_strings = []
for root, _, files in os.walk('../'):
    for file in files:
        if file.endswith(('.ts', '.js', '.php', '.md')):
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                code_strings.append(f.read())

# Tokenize all project files
token_sequences = [tokenizer.encode(text) for text in code_strings]

# Initialize model (e.g., 2-layer Transformer, small hidden size)
model = ChatbotModel(vocab_size=tokenizer.vocab_size, hidden_size=128, num_layers=2)

# Train model on token sequences
model.train(token_sequences, epochs=3, lr=0.001)

# Save model parameters
model.save('chatbot_model.npz')
print("Chatbot training complete.")
```

A simplified model example (pseudocode):

```python
# packages/chatbot/model.py
import numpy as np

class ChatbotModel:
    def __init__(self, vocab_size, hidden_size, num_layers=1):
        # Randomly initialized weights for a minimal Transformer
        self.vocab_size = vocab_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        # Example parameters (one linear layer and one output layer)
        self.W1 = np.random.randn(vocab_size, hidden_size) * 0.01
        self.W2 = np.random.randn(hidden_size, vocab_size) * 0.01

    def train(self, token_sequences, epochs=1, lr=0.001):
        for epoch in range(epochs):
            for seq in token_sequences:
                # Simple forward pass: one-hot → hidden → logits
                x = np.eye(self.vocab_size)[seq[:-1]]  # shape: (seq_len-1, vocab_size)
                hidden = x.dot(self.W1)                # shape: (seq_len-1, hidden_size)
                logits = hidden.dot(self.W2)           # shape: (seq_len-1, vocab_size)
                # Compute cross-entropy loss and gradients (omitted for brevity)
                # Update W1 and W2 via gradient descent
            print(f"Epoch {epoch + 1}/{epochs} complete")
        print("Training finished.")

    def save(self, filepath):
        np.savez_compressed(filepath, W1=self.W1, W2=self.W2)

    @classmethod
    def load(cls, filepath):
        data = np.load(filepath)
        model = cls(vocab_size=data['W1'].shape[0], hidden_size=data['W1'].shape[1])
        model.W1 = data['W1']
        model.W2 = data['W2']
        return model

    def generate(self, input_tokens, max_length=50):
        # Simplified sampling: feed input through W1→W2, pick highest-prob token, repeat
        generated = []
        x = np.eye(self.vocab_size)[input_tokens]  # one-hot for input
        hidden = x.dot(self.W1)
        for _ in range(max_length):
            logits = hidden[-1:].dot(self.W2)  # take last token’s hidden
            next_token = int(np.argmax(logits, axis=-1)[0])
            generated.append(next_token)
            # Append next_token to hidden for next iteration
            new_one_hot = np.zeros((1, self.vocab_size))
            new_one_hot[0, next_token] = 1
            new_hidden = new_one_hot.dot(self.W1)
            hidden = np.vstack([hidden, new_hidden])
        return generated
```

> **Note**: In a production-ready version, you would implement proper attention layers, softmax, backpropagation, batching, and optimization (e.g., Adam optimizer). The above is a minimal proof of concept.

### API & Frontend Integration

Once trained, the chatbot runs as a **Flask** or **FastAPI** microservice under `packages/chatbot/`. Example with Flask:

```python
# packages/chatbot/app.py
from flask import Flask, request, jsonify
from tokenizer import BPETokenizer
from model import ChatbotModel

app = Flask(__name__)
tokenizer = BPETokenizer.from_file('bytelevelbpe.json')
model = ChatbotModel.load('chatbot_model.npz')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('text', '')
    input_tokens = tokenizer.encode(user_input)
    reply_tokens = model.generate(input_tokens, max_length=50)
    reply_text = tokenizer.decode(reply_tokens)
    return jsonify({ 'reply': reply_text })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

* This microservice exposes a `POST /api/chat` endpoint.
* The JavaScript/TypeScript backend can proxy or directly call this endpoint.
* Each frontend template (React, Vue, etc.) includes an example Chatbot component.

#### React Chatbot Component Example

```jsx
// packages/frontend-react/src/components/Chatbot.tsx
import React, { useState } from 'react';

type Message = {
  question: string;
  answer: string;
};

export default function Chatbot() {
  const [chat, setChat] = useState<Message[]>([]);
  const [text, setText] = useState('');

  const sendMessage = async () => {
    if (!text.trim()) return;
    setChat((prev) => [...prev, { question: text, answer: '...' }]);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const { reply } = await response.json();
    setChat((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].answer = reply;
      return updated;
    });
    setText('');
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {chat.map((msg, i) => (
          <div key={i} className="chat-message">
            <p className="chat-user"><strong>You:</strong> {msg.question}</p>
            <p className="chat-bot"><strong>Bot:</strong> {msg.answer}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
```

> The above component can be adapted for Vue, Angular, Svelte, or any other frontend framework by following a similar pattern: maintain a chat array in local state, send POST requests to `/api/chat`, and render messages.

---

## UX & UI Frameworks

NovaStackJS supports popular UI toolkits out-of-the-box. In the project’s config, users can select their preferred CSS framework:

```yaml
ui:
  framework: tailwind  # Options: 'tailwind', 'bootstrap', 'shadcn', 'daisy', 'custom'
  theme: light         # Options: 'light' or 'dark'
```

* **TailwindCSS** (with DaisyUI and ShadCN/UI support)
* **Bootstrap**
* **ShadCN/UI** (Radix-based, Tailwind utility classes)
* **DaisyUI** (Tailwind plugin for component classes)
* **Custom CSS** (any user-provided stylesheet)

### Enabling TailwindCSS & DaisyUI

```bash
# From project root
npm install -D tailwindcss postcss autoprefixer daisyui
npx tailwindcss init -p
```

Add the following to `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './packages/frontend-react/src/**/*.{js,jsx,ts,tsx}',
    './packages/frontend-vue/src/**/*.{vue,js,ts}',
    // Add other frontend workspaces as needed
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark', 'cupcake', 'retro'],
  },
};
```

* All starter templates for frontend include a preconfigured `index.css` (or equivalent) that imports Tailwind base, components, and utilities.
* If `ui.framework` is set to `bootstrap`, the template will install `bootstrap` and import its CSS in the main entrypoint (e.g., `index.tsx` for React).
* ShadCN/UI components are scaffolded automatically when the user selects `shadcn` as their UI framework, with example usage in `packages/frontend-react/src/components/`.

---

## PHP Framework Compatibility

Beyond plain PHP scripts, NovaStackJS can integrate entire PHP frameworks via the embedded WASM engine:

* **Supported PHP Frameworks**:

  * Laravel
  * Symfony
  * CodeIgniter
  * CakePHP
  * Magento
  * WordPress

* **How It Works**:

  1. Clone or scaffold a PHP framework project under `packages/php-laravel/` (or `packages/php-symfony/`, etc.).
  2. NovaStackJS’s build pipeline compiles the PHP framework code into the WASM runtime.
  3. Incoming web requests to `/laravel/*` are proxied to the PHP WASM interpreter, which runs `public/index.php` or equivalent.

* **Example Route for Laravel**:

  ```ts
  // packages/server/src/routes/laravel.ts
  import { Router, Request, Response } from 'express';
  import phpInstance from '@nova/wasm-engine/phpRunner';
  import path from 'path';

  const router = Router();

  router.all('/*', async (req: Request, res: Response) => {
    // Map request to Laravel’s public/index.php
    const indexPhpPath = path.resolve(__dirname, '../../php-laravel/public/index.php');

    // Build superglobals based on req
    const superglobals = {
      GET: req.query,
      POST: req.body,
      SERVER: {
        REQUEST_URI: req.originalUrl,
        REQUEST_METHOD: req.method,
        // ... other necessary server variables
      },
      // Include cookies, headers, etc.
    };

    const output = await phpInstance.exports.php_run(indexPhpPath, superglobals);
    res.status(output.statusCode || 200).send(output.html);
  });

  export default router;
  ```

* **Compatibility Checks**:

  * When a user runs `nova create app react-native`, the CLI throws an explicit error:

    ```ts
    // packages/cli/src/commands/createApp.ts
    import { Framework } from '../types';

    function createApp(framework: Framework, name: string) {
      const mobileOnly = ['react-native', 'flutter', 'ionic'];
      if (mobileOnly.includes(framework)) {
        throw new Error(
          `Framework "${framework}" is not compatible with NovaStackJS (mobile-only).`
        );
      }
      // Continue scaffolding...
    }
    ```

  * If a user attempts to include a mobile-only or serverless-only stack, NovaStackJS informs them that it is not supported and suggests alternative web-oriented frameworks.

---

## Monorepo Structure

NovaStackJS is organized as a Yarn/NPM workspaces monorepo. The root `package.json` is marked `"private": true` and declares all workspace packages under `packages/*`.

```
nova-stackjs/
├── packages/
│   ├── server/            # Backend (Express, DB, Auth, Admin, etc.)
│   ├── frontend-react/    # React/Next.js application
│   ├── frontend-vue/      # Vue 3 application
│   ├── frontend-angular/  # Angular application
│   ├── frontend-svelte/   # Svelte/SvelteKit application
│   ├── frontend-solid/    # SolidJS application
│   ├── frontend-qwik/     # Qwik application
│   ├── wasm-engine/       # PHP WASM binaries and loader
│   ├── php-laravel/       # Example Laravel project (optional)
│   ├── php-symfony/       # Example Symfony project (optional)
│   ├── chatbot/           # Python chatbot code (model, API)
│   ├── cli/               # NovaStackJS CLI tool (Node/TypeScript)
│   └── utils/             # Shared utility library
├── docs/                  # Documentation (Markdown or Docusaurus)
├── .gitignore
├── package.json           # Root configuration for workspaces
└── config.yaml            # Global configuration file
```

* **Workspaces**: Each folder under `packages/` is an independent npm package with its own `package.json`.
* **Yarn Workspaces**: All dependencies are hoisted to the root `node_modules` when possible, reducing duplication.
* **Cross-Workspace References**: Packages can depend on each other using the [`workspace:` protocol](https://docs.npmjs.com/cli/v7/configuring-workspaces/workspaces), e.g., `"@nova/utils": "workspace:^"` to reference shared utilities.
* **Consistent Tooling**: Running `yarn build` at the root will trigger the build script in each workspace. Linting, testing, and other tasks can be run across all packages with `yarn workspaces run lint` or `yarn workspaces run test`.

This monorepo setup ensures that frontend, backend, chatbot, and CLI code live together in one repository, simplifying development and version control.

---

## Ease of Use & Documentation

NovaStackJS prioritizes developer experience by providing comprehensive documentation and zero-config workflows:

* **Documentation**:

  * Located in the `docs/` folder (Markdown files).
  * Optionally set up a [Docusaurus](https://docusaurus.io/) site under `docs/` for a polished documentation website.
  * Covers:

    * Installation & Prerequisites
    * Getting Started (cloning, setup, development)
    * Detailed Architecture Overview
    * Frontend Integration Guides (React, Vue, Angular, etc.)
    * Backend API Reference
    * Database Adapter Usage
    * Admin Dashboard Customization
    * AI Chatbot Setup & Fine-Tuning
    * Deployment Tutorials (Vercel, Netlify, Docker, etc.)
    * Contribution Guidelines & Code of Conduct

* **Zero-Config CLI**:

  1. **Clone the repository**

     ```bash
     git clone https://github.com/your-org/novastackjs.git
     cd novastackjs
     ```

  2. **Install dependencies**

     ```bash
     yarn install
     ```

  3. **Run initial setup**

     ```bash
     yarn nova setup
     ```

     * Installs any additional dependencies, initializes databases (e.g., starts Docker containers if configured), and runs migrations.

  4. **Start development environment**

     ```bash
     yarn nova dev
     ```

     * This concurrently starts:

       * The Express TypeScript server (in watch mode)
       * The chosen frontend dev server (e.g., `next dev`, `vite`)
       * The Python chatbot microservice (if enabled)

  5. **Access the app**

     * Backend API: `http://localhost:3000/api/`
     * Admin Dashboard: `http://localhost:3000/admin`
     * Frontend App: [http://localhost:3001/](http://localhost:3001/) (port depends on chosen framework)
     * Chatbot API: `http://localhost:5000/api/chat`

* **Environment Configuration**:

  * All sensitive credentials (database passwords, JWT secrets, OAuth credentials) are managed via a `.env` file at the project root. Example `.env`:

    ```dotenv
    NODE_ENV=development
    PORT=3000

    # Database Credentials (MySQL example)
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASS=secret
    DB_NAME=nova_db

    # Redis (for sessions or caching)
    REDIS_URL=redis://localhost:6379

    # Authentication
    JWT_SECRET=supersecretjwtkey
    SESSION_SECRET=supersecretSessionKey

    # OAuth Providers
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    ```

  * The CLI and application code load environment variables using a library like [`dotenv`](https://www.npmjs.com/package/dotenv).

---

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-org/novastackjs.git
   cd novastackjs
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root with necessary keys (see [Ease of Use & Documentation](#ease-of-use--documentation) for a sample).

4. **Run Initial Setup**

   ```bash
   yarn nova setup
   ```

   * Installs dependencies across all workspaces
   * Initializes or spins up Docker containers for the database if configured
   * Runs database migrations

5. **Start Development Servers**

   ```bash
   yarn nova dev
   ```

   * Express server in watch mode (port 3000 by default)
   * Frontend dev server (port depends on chosen framework)
   * Python chatbot microservice (port 5000 by default)

6. **Visit Your Application**

   * **Backend API**: `http://localhost:3000/api/`
   * **Admin Dashboard**: `http://localhost:3000/admin`
   * **Frontend App**: Depending on the template, e.g.:

     * React/Next.js: `http://localhost:3001/`
     * Vue/Vite: `http://localhost:3002/`
   * **Chatbot API**: `http://localhost:5000/api/chat`

Congratulations! You are now running NovaStackJS locally. Follow individual frontend workspace READMEs for framework-specific commands (e.g., `npm run dev` inside `packages/frontend-vue` for the Vue app).

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork this repository** and clone your fork locally.
2. **Create a new branch** for your feature or bugfix:

   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Install dependencies** and ensure tests pass:

   ```bash
   yarn install
   yarn test
   ```
4. **Make your changes**, following the existing code style (TypeScript code is formatted with Prettier + ESLint).
5. **Add tests** for any new functionality or bug fixes.
6. **Run linting and tests**:

   ```bash
   yarn lint
   yarn test
   ```
7. **Commit your changes** with a descriptive message and push your branch:

   ```bash
   git add .
   git commit -m "feat(server): add new authentication middleware"
   git push origin feature/my-new-feature
   ```
8. **Open a Pull Request** against `main` in the original repository. Include a summary of changes and any relevant context (screenshots, design decisions, etc.).

Please see [`CONTRIBUTING.md`](docs/CONTRIBUTING.md) for detailed guidelines, code of conduct, and branch naming conventions.

---

## License

NovaStackJS is released under the **MIT License**. See [LICENSE](LICENSE) for full details.

---

**Acknowledgments & Inspiration**

* Running **PHP in WebAssembly**: community experiments compiled PHP to Wasm and ran it at the edge.
* Monorepo best practices from RedwoodJS, Nx, and Yarn Workspaces.
* Minimal GPT-style chatbot implementations using NumPy (e.g., picoGPT, Jay K’s from-scratch examples).
* Admin dashboard functionality via AdminJS.
* Security best practices in Node.js (Helmet, csurf, express-validator).

---

Thank you for choosing NovaStackJS! We hope this framework accelerates your next full-stack project by combining the flexibility of JavaScript/TypeScript, the legacy and richness of PHP, and the power of a custom AI chatbot—all in one cohesive, monorepo package.
