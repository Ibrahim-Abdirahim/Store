# E-Commerce Store — Backend

Spring Boot + Postgres backend for the e-commerce product store project.

## Prerequisites
- Java 17+
- Maven 3.9+ (or use the included `mvnw` wrapper if you add one)
- Postgres running locally

## Setup

1. **Create the database** (in `psql` or any Postgres client):
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

2. **Update credentials** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_ACTUAL_PASSWORD
   ```

3. **Run the app**:
   ```bash
   mvn spring-boot:run
   ```

   The API will start on **http://localhost:8080**.

   On first run, Hibernate will auto-create the `products` and `users` tables in `ecommerce_db` (via `ddl-auto=update`).

## Verify it's working

Register a user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

You should get back a JSON response with a `token` field. That confirms: DB connection works, password hashing works, and JWT issuance works.

Log in with the same user:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Current endpoints

| Method | Path | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new user account |
| POST | `/api/auth/login` | No | Log in, get a JWT |

More endpoints (products, cart, orders, admin) coming as we build them out.

## Project structure

```
src/main/java/com/ecommerce/store/
├── config/        # Spring Security config
├── controller/     # REST endpoints
├── dto/            # Request/response objects
├── entity/         # JPA entities (DB tables)
├── enums/          # Role, OrderStatus, etc.
├── exception/      # Custom exceptions + global handler
├── repository/     # Spring Data JPA repositories
├── security/       # JWT filter/service, UserDetailsService
└── service/        # Business logic
```
