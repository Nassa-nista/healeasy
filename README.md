# HealEasy

HealEasy is a **Node.js API** for managing users and medications, containerized with **Docker**, tested with **Jest**, and monitored with **Prometheus metrics**.

---

## Features

- **User Authentication**
  - Register (`/auth/register`)
  - Login (`/auth/login`)
- **Medication CRUD**
  - Create, Read, Update, Delete at (`/medications`)
- **Health Check**
  - `/healthz` endpoint
- **Monitoring**
  - `/metrics` endpoint (Prometheus format)
- **Docker & Docker Compose Support**
- **SQLite Database**

---

## Tech Stack

- Node.js (v20+)
- Express.js
- SQLite (via better-sqlite3)
- Jest (testing framework)
- Docker + Docker Compose
- Prometheus (metrics integration)

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- Node.js (v20+) if you want to run locally without Docker

---

## ▶️ Run with Docker

```bash
docker compose -f docker-compose.staging.yml up -d
---

---

## API Demo

After starting the container, the API will be available at [http://localhost:3000](http://localhost:3000).

### Register, Login & Use Medications

You can test the API quickly with **PowerShell** commands:

```powershell
# 1. Generate a random email (so each run is unique)
$random = Get-Random -Maximum 9999
$email = "user$random@test.com"

Write-Host "Registering with email:" $email

# 2. Register
curl -Method POST http://localhost:3000/auth/register `
  -ContentType "application/json" `
  -Body (@{ name="Demo User"; email=$email; password="pass123" } | ConvertTo-Json)

# 3. Login
$resp = curl -Method POST http://localhost:3000/auth/login `
  -ContentType "application/json" `
  -Body (@{ email=$email; password="pass123" } | ConvertTo-Json)

$token = ($resp.Content | ConvertFrom-Json).token
Write-Host "Token:" $token

# 4. Add a medication
curl -Method POST http://localhost:3000/medications `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body (@{ name="Vitamin D"; dose="5000 IU"; schedule="daily" } | ConvertTo-Json)

# 5. List medications
curl -Method GET http://localhost:3000/medications `
  -Headers @{ Authorization = "Bearer $token" }
