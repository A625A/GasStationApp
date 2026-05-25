## Shell Auth Backend

### Run locally with Docker
```bash
docker compose up --build
```

The API will be available at `http://localhost:8000`.

Endpoints:
- `POST /api/register` — body `{ "email": "...", "username": "...", "password": "..." }`
- `POST /api/login` — body `{ "email": "...", "password": "..." }`

The service uses SQLite for persistence (stored in the `backend-data` volume). Passwords are hashed with bcrypt via `passlib`.
