# textstats
A mini project to learn REST APIs and consume them via a React frontend.
## backend
Runs on Node.Js and Express.

Performs simple statistical text analysis.

`npm start` to run, or `npm run dev` to run with nodemon for development.

Server listens on port 3001 by default, value can be changed by editing `.env`.

## frontend
Written in React.

`npm start` to run live development server.

`npm build` to perform a build.

Environment variable `REACT_APP_BACKEND_URL` must be set to backend url in `.env`.
