# Practical 11: Containerization with Docker and Docker Compose

## Objective

Build and run the Task Management full-stack application as three Docker
services: a React frontend, a Node/Express backend, and MongoDB.

## Services and networking

| Service | Image/build | Host port | Purpose |
| --- | --- | --- | --- |
| `frontend` | Multi-stage Node build and Nginx runtime | `5173` | Serves the React app and proxies `/api` to the backend |
| `backend` | `Dockerfile.backend` | `5000` | Express API; connects to MongoDB at `mongodb:27017` |
| `mongodb` | Official `mongo:8` image | `27017` | Stores users and tasks in the `mongodb-data` named volume |

All services share the `app-network` bridge network. The backend waits for
MongoDB's health check, and the frontend waits for the backend health check.
The frontend is available at <http://localhost:5173>.

## Run and verify

1. Install and start Docker Desktop (or Docker Engine), then verify the tools:

   ```sh
   docker --version
   docker compose version
   ```

2. From the project root, build and start all services:

   ```sh
   docker compose up --build
   ```

3. In another terminal, confirm that all three services are running and
   healthy:

   ```sh
   docker compose ps
   ```

4. Open <http://localhost:5173>, register an account, sign in, and verify that
   the task manager can create and display a task.
5. Optionally check the API readiness endpoint at
   <http://localhost:5000/api/health>. A healthy response means the backend is
   connected to MongoDB.
6. Stop the services with `Ctrl+C`. Restart with `docker compose up`; database
   records persist in the named volume.

To stop and remove containers and the network, run `docker compose down`. To
also delete the persisted database, run `docker compose down --volumes`.

For a local lab, Compose has a development-only JWT secret fallback so the
application starts without preparatory steps. For any non-lab deployment, set
a strong private `JWT_SECRET` in `.env`. Use `.env.example` as a reference, and
never upload `.env` or a real secret.

## Analysis questions

### Why does the backend use `mongodb` instead of `localhost`?

Each Compose service has its own network namespace. Inside the backend
container, `localhost` refers to the backend container itself, not the MongoDB
container. Compose provides DNS for service names on the shared network, so
`mongodb://mongodb:27017/taskmanager` resolves to the MongoDB service.

### What is the difference between `EXPOSE` and Compose `ports`?

`EXPOSE` documents the port an image's process listens on; it does not publish
that port to the host. Compose `ports` publishes a container port on the host
(for example, `5173:5173`) so a browser or local tool can connect to it.
Services on the Compose network can communicate using their service names and
container ports without publishing those ports to the host.

### Why should `node_modules` not be copied into an image?

Host-installed modules may be for a different operating system, CPU
architecture, or Node version, and they add unnecessary size and build-context
noise. The Dockerfiles install dependencies inside Linux images from the
package manifests and lockfile, making builds reproducible and isolating
container dependencies from the host.

## Submission checklist

- [ ] `Dockerfile.frontend` and `Dockerfile.backend`
- [ ] `docker-compose.yml`, `.dockerignore`, and `nginx.conf`
- [ ] This practical report, with your own run observations
- [ ] Screenshot of `docker compose ps` showing frontend, backend, and MongoDB
      healthy
- [ ] Screenshot of the app running at `http://localhost:5173` and, if asked,
      a successful task operation

Take screenshots from your own running environment; do not claim the stack was
run if Docker was unavailable. Do not submit `.env`, passwords, JWT secrets,
or other credentials.
