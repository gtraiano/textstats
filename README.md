# textstats
A mini project to learn REST APIs and consume them via a React frontend.

Live demo at https://textstats.herokuapp.com/app
## backend
Runs on Node.Js and Express.

Performs simple statistical text analysis.

`npm start` to run, or `npm run dev` to run with nodemon for development.

Server listens on port 3001 by default, value can be changed by setting environment variable `PORT` in `.env`.

###Environment variables
The following variables must be set in `.env`

`PORT` is the server listening port

`API_ENDPOINT` is the text statistics api endpoint

`FRONTEND_ENDPOINT` is the frontend build endpoint

`FRONTEND_BUILD_PATH` is the relative path of the frontend build

## frontend
Written in React.

`npm start` to run live development server.

`npm build` to perform a build.

###Environment variables
The following variables must be set in `.env`

`REACT_APP_BACKEND_URL` is the backend's url address