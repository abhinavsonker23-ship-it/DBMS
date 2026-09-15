# Social Media DBMS Project

This project contains the database schema and a Node.js REST API backend for a simple social media platform.

## Setup Instructions

### 1. Database Setup
You will need a MySQL instance running. If you have Docker installed, you can easily start one:
```bash
docker run --name social-db -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=social_media_dbms -p 3306:3306 -d mysql:8.0
```

Load the schema, triggers/views, and indexes into the database:
```bash
mysql -h 127.0.0.1 -u root -ppassword social_media_dbms < database/schema.sql
mysql -h 127.0.0.1 -u root -ppassword social_media_dbms < database/triggers_views_procedures.sql
mysql -h 127.0.0.1 -u root -ppassword social_media_dbms < database/indexes.sql
```

### 2. Backend Setup
Navigate to the `backend` directory and install the Node.js dependencies:
```bash
cd backend
npm install
```

Copy the `.env.example` to `.env`:
```bash
cp .env.example .env
```

Start the API server:
```bash
npm start
```

### 3. Testing the API
You can run the `test_api.sh` script to verify the API functionality:
```bash
cd backend
chmod +x test_api.sh
./test_api.sh
```
