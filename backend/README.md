# myFlix Backend (minimal)

This is a minimal Express API used for development and to allow the frontend to fetch `/movies`.

Quick start

Install dependencies:

```bash
cd backend
npm install
```

Run locally:

```bash
npm start
# or
npm run dev
```

The server will listen on port `8080` by default. GET `/movies` returns sample JSON.

Deploy to Heroku:

```bash
# ensure main is up-to-date and merged
git push heroku main
```

Note: This small README change is to create a pull request for the `allow-movies-public` branch.
