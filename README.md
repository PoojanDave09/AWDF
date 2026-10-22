# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Run the full stack with Docker Compose

From the project root, start the React frontend, Express API, and MongoDB:

```sh
docker compose up --build
```

Open <http://localhost:5173>. The API is also mapped to port `5000`, and
MongoDB is mapped to port `27017`. The frontend container proxies `/api`
requests to the `backend` service, and the backend connects to MongoDB using
the `mongodb` service name. MongoDB data persists in the `mongodb-data` named
volume.

To stop the stack, press `Ctrl+C` and run `docker compose down`. To remove the
database volume as well (this permanently deletes the stored lab data), run
`docker compose down --volumes`.

Compose supplies a local-only development JWT key by default so the lab starts
with one command. Before using the stack outside a local exercise, set a
private `JWT_SECRET` in an untracked `.env` file (see [.env.example](.env.example)).
Never submit `.env` or other files containing real secrets.

See [PRACTICAL-11.md](PRACTICAL-11.md) for the lab steps, analysis questions,
and submission checklist.
