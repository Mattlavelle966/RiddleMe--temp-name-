# API Reference

## Base URL

```bash
http://localhost:3000
```

---

## Authentication

### Register

```bash
POST /api/register
```

```bash
curl -X POST http://localhost:3000/api/register \
-H "Content-Type: application/json" \
-d '{"username":"test","password":"test"}'
```

---

### Login

```bash
POST /api/login
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

---

### Get Current User

```bash
GET /api/me
```

Headers:

```bash
Authorization: Bearer JWT_TOKEN
```

---

## Users

### Get All Users

```bash
GET /api/users
```

---

### Check User Status

```bash
GET /api/users/:userId/status
```

Response:

```json
{
  "online": true
}
```

---

## Notes

* JWT required for protected routes
* Token passed in:

  * HTTP headers
  * socket handshake

---

## Auth Flow

```text
register - login - receive token
- use token for API + socket
```