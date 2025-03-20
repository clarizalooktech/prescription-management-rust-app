# Prescription Management App (Rust)
This project is a full-stack prescription management system with a Rust backend and a React frontend, deployed on AWS using CDK (TypeScript).

## 📁 Project Structure

```
prescription-management/
│── backend/             # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   ├── prescription.rs
│   │   ├── patient.rs
│   │   ├── db.rs
│   ├── Cargo.toml
│   ├── Dockerfile       # Containerizing the backend
│   ├── .env
│── frontend/            # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PrescriptionForm.js
│   │   │   ├── PatientForm.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Prescriptions.js
│   │   ├── App.js
│   │   ├── api.js       # API calls to Rust backend
│   ├── package.json
│   ├── .env
│── infra/                 # AWS CDK infrastructure
│   ├── bin/
│   │   ├── infra.ts       # Entry point for CDK app
│   ├── lib/
│   │   ├── backend-stack.ts  # Defines backend infra (ECS, Lambda, API Gateway)
│   │   ├── frontend-stack.ts # Defines frontend infra (S3, CloudFront)
│   ├── cdk.json         # CDK config
│   ├── package.json     # Dependencies for CDK
│   ├── tsconfig.json    # TypeScript config
│── README.md
```

### 🚀 Tech Stack

Backend: Rust (Actix-Web or Axum) + PostgreSQL (or DynamoDB)

- Frontend: React (Vite or CRA)

- Infrastructure: AWS CDK (TypeScript)

- Deployment: ECS Fargate (or AWS Lambda), API Gateway, S3 + CloudFront

### 🛠 Setup Instructions

1️⃣ Backend (Rust)

```
cd backend
cargo build
cargo run
```

Configure .env for database connection

2️⃣ Frontend (React)
```
cd frontend
npm install
npm start
```
Configure api.js to point to the backend API

3️⃣ Deploy to AWS using CDK
```
cd cdk
npm install
cdk deploy
```
📌 Features

- Add/Edit/Delete prescriptions

- Patient management

- Secure API

- Deployed on AWS

