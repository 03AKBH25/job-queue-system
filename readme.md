# Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/03AKBH25/job-queue-system.git
cd job-queue-system
```

### 2. Install Dependencies
Navigate to the backend directory and install all required NPM packages:
```bash
cd backend
npm install
```

### 3. Set Environment Variables
You will need to create two `.env` files to configure your database and server.

**File 1: Backend API Configuration**
Create a `.env` file inside the `backend` directory (e.g. `backend/.env`):
```env
DATABASE_URL="postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:<POSTGRES_PORT>/<POSTGRES_DB>?schema=public"
PORT=3000
```

**File 2: Docker Environment**
Create a `.env` file inside the `backend/docker` directory:
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=password123
POSTGRES_DB=job_queue_db
POSTGRES_PORT=5432

REDIS_PORT=6379
```

### 4. Start Infrastructure (Docker)
Make sure your Docker app is running on your machine. Then, start the PostgreSQL and Redis containers:
```bash
cd docker
docker-compose up -d
cd ..
```

### 5. Initialize the Database (Prisma)
With your PostgreSQL database running, you need to apply the schema to create the necessary tables and generate the Prisma client:
```bash
# Push schema to the database
npx prisma db push

# Generate Prisma client for your backend code
npx prisma generate
```

### 6. Run the Application
Finally, start both your API Server and the Background Worker. Open two separate terminals inside your `backend` folder:

**Terminal 1:** Start the API Server
```bash
npm run dev
```

**Terminal 2:** Start the Background Worker
```bash
npm run worker
```


Job Queue System (Production-Style Backend)

A production-ready distributed job queue system built with BullMQ, Redis, Prisma, and TypeScript featuring worker concurrency, retry logic, dead-letter queue, priority scheduling, and failure recovery.

Designed to simulate real-world backend infrastructure used in scalable systems.


 Features: 

 
1. ---Job Processing

Asynchronous background job execution
Multiple job type processors
Idempotent job execution

**************************************************

2. ---Worker Concurrency

Parallel job processing
Configurable worker concurrency
Race-condition safe execution

***************************************************

3. ---Retry Mechanism

Automatic retry on failure
Configurable retry limits
Exponential backoff strategy
Non-retriable error handling

***************************************************
4. ---Dead Letter Queue (DLQ)

Failed jobs routed to DLQ
Replay failed jobs
Failure analysis support


****************************************************
5. ---Priority Queue

Priority-based job scheduling
High priority jobs processed first

****************************************************
6. ---Job Control

Cancel jobs
Replay jobs
Delete jobs
Get job by ID

****************************************************
7. --- Monitoring APIs

Job statistics
Failed jobs listing
Pagination & filtering
Sorting support



&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

System Architecture:

Client / API
     │
     ▼
Producer (API Server)
     │
     ▼
Redis Queue (BullMQ)
     │
     ▼
Worker (Concurrency)
     │
     ▼
Processor (Job Type Based)
     │
     ▼
Database (Prisma / PostgreSQL)


&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

Job Lifecycle:

WAITING → ACTIVE → COMPLETED

WAITING → ACTIVE → FAILED → RETRY

WAITING → ACTIVE → FAILED → DLQ


&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

API Endpoints: 


1. ---Create Job
POST /jobs

Request:
{
  "type": "email",
  "payload": {},
  "priority": 1
},

****************************************************

2. ---Get Job By ID

GET /jobs/:id

*****************************************************

3. ---Get All Jobs
GET /jobs

Supports:

Pagination
Filtering
Sorting

*****************************************************


4. ---Replay Job
POST /jobs/replay/:jobId

*****************************************************

5. ---Cancel Job
POST /jobs/cancel/:jobId

*****************************************************

6. ---Delete Job
DELETE /jobs/:jobId

******************************************************

7. ---Job Statistics
GET /jobs/stats

Returns:

Total jobs
Completed jobs
Failed jobs
Active jobs