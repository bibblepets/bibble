# Saturday Boilerplate

[![Depfu](https://badges.depfu.com/badges/1b70410a7764005553d576dd171dce8d/status.svg)](https://depfu.com)
[![Depfu](https://badges.depfu.com/badges/1b70410a7764005553d576dd171dce8d/count.svg)](https://depfu.com/github/apicgg/vite-mern-template?project_id=38988)

> Simple opinionated boilerplate for MERN stack with Vite and Redux Toolkit.
> This includes React+TypeScript with familiar configuration for vite.config.ts
> for front-end and Express+TypeScript for back-end.

This has been created with the official [Vite](https://vitejs.dev/) template
(`npm create vite@latest`) and some extended setup. There are two separate
folders called `server` and `client`. The entry point for the backend is
`server/src/index.ts`.

> Thanks to [awesome-vite](https://github.com/vitejs/awesome-vite) for
> publishing this project.

## Tools

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Axios](https://axios-http.com/)
- [React Router DOM](https://reactrouter.com/)
- [Express](https://expressjs.com/)
- [mongoose](https://mongoosejs.com/)
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [express-async-handler](https://www.npmjs.com/package/express-async-handler)
- [Docker](https://www.docker.com/)
- [NGINX](https://www.nginx.com/)
- [Prettier](https://prettier.io/)

## Installation

```bash
git clone git@github.com:tituswe/saturday-boilerplate.git
```

## Install dependencies

```bash
cd my-app
cd client
npm install
cd ..
npm install
```

## Start the development server

```bash
make dev
```

- Remove the .git folder and initialize your own git repository.

## TODO

- Rename all instances of "saturday" with your own project name.
- Include testing frameworks, eslint and prettier.
- Create a npm CLI library for scaffolding projects.
