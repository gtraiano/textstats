# textstats
A mini project to learn REST APIs and consume them via a React frontend.

Live demo at https://textstats.herokuapp.com/app
## backend
Runs on Node.Js and uses Express.

Prvides a REST API the performs simple text statistical analysis.

`npm start` to run, or `npm run dev` to run with nodemon for development.

Server listens on port 3001 by default, value can be changed by setting environment variable `PORT` in `.env`.

### API paths
| Path | Method | Body Parameters | Function |
| :--: | :----: | :-------------: | :-------: |
| `/letterfreqs` | POST | `text` | character count by category (alphabetic, digits, punctuation) |
| `/wordfreqs` | POST | `text` | word count, word frequency, shortest, longest and average word length |
| `/textstats` | POST | `text` | text length (incl. and excl. whitespace), line, words and sentences count |
| `/charngramfreqs` | POST | `text, n, m` | n-grams count (total and unique) and frequency table for given `n, m` |
| `/wordngramfreqs` | POST | `text, n, m` | n-grams count for words |

### Server paths
| Path | Method | Body Parameters | Function |
| :--: | :----: | :-------------: | :------: |
| `/` | GET | | welcome text message |
| `/routes` | GET | | all API endpoints |

### Environment variables
The following variables can be set in `.env`

`PORT` is the server listening port (default value `3001`)

`API_ENDPOINT` is the text statistics api endpoint (default value `/api`)

You can serve a build of the frontend by setting the following

`FRONTEND_ENDPOINT` is the frontend build endpoint

`FRONTEND_BUILD_PATH` is the relative path of the frontend build directory

## frontend
Written in React.

`npm start` to run live development server.

`npm run build` to perform a build.

###Environment variables
The following variables must be set in `.env`

`REACT_APP_BACKEND_URL` is the backend's url address