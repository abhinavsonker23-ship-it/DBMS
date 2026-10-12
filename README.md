# Social Media DBMS Project (Kinetic Social)

Full-stack social media web application and relational DBMS project featuring normalized relational modeling (3NF), MariaDB triggers, views, stored procedures, a Node.js Express REST API, and a React (Vite) user interface.

---

## Prerequisites
- **Node.js**: v18+ or v20+
- **MariaDB / MySQL**: Installed on the system

---

## How to Run the Project Manually

You have two options to run the application:

### Option A: Using the All-in-One Script (Quickest)
From the project root directory, run:
```bash
./start_all.sh
```
This script automatically starts MariaDB, the Express backend, and the Vite frontend dev server. When you are done, press `Ctrl+C` in that terminal to stop all services.

---

### Option B: Step-by-Step (3 Terminals)

If you prefer to start each service manually in its own terminal window:

#### Terminal 1: MariaDB Server
Start your local MariaDB database daemon pointing to the project data directory:
```bash
mariadbd --datadir=/home/hp/mysql_data --socket=/home/hp/mysql_data/mysql.sock --port=3306
```
*(Leave this terminal running. It will log `mariadbd: ready for connections`)*

#### Terminal 2: Backend API (Express.js)
In a second terminal, navigate to the `backend` folder and start the API:
```bash
cd "DBMS Project/backend"
npm start
```
*(You will see `Server running on port 3000`)*

#### Terminal 3: Frontend Web Application (React + Vite)
In a third terminal, navigate to the `frontend` folder and start the development server:
```bash
cd "DBMS Project/frontend"
npm run dev
```
*(You will see `Local: http://localhost:5173/`)*

Now open your web browser at:
👉 **`http://localhost:5173`**

---

## Database Management & Ingestion

### Re-importing Schema & Procedures
If you ever need to reset or rebuild the tables:
```bash
# 1. Base tables, constraints & 3NF tables
mariadb -u root --socket=/home/hp/mysql_data/mysql.sock social_media_dbms < database/schema.sql

# 2. Audit triggers, views (user_feed), and stored procedures (get_mutual_followers)
mariadb -u root --socket=/home/hp/mysql_data/mysql.sock social_media_dbms < database/triggers_views_procedures.sql
```

### Ingesting Datasets
To re-run the automated ingestion for **`SocialMediaTop100.csv`** and the multilingual posts dataset:
```bash
cd "DBMS Project/backend"
node ../database/import_datasets.js
```

---

## Project Structure
- `database/` - MariaDB DDL scripts (`schema.sql`, `triggers_views_procedures.sql`) and data ingestion scripts
- `backend/` - Node.js Express API (`server.js`, auth, feed, profile, top100 endpoints)
- `frontend/` - React frontend with interactive feed, profile drilldowns, and Top 100 leaderboards
- `SocialMediaTop100.csv` - Top 100 creator dataset across 5 global platforms (500 records)
