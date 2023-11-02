# SBRP
SPMG7T6 AY2023/24 2

## 1. Prerequisites
### 1.1 Installation
Please ensure that you have the following installed on your machine.

- Python 3
- Visual Studio Code
- Docker Desktop
- WAMP Server
- MySQL WorkBench
- Google Chrome
 
### 1.2 Launch
Make sure that your Docker is running.

## 2. Database
1. Open MySQL Workbench.

2. Set up new connection using the following details.
   - Hostname: {insert your database endpoint}
   - Port: 3306
   - Username: {insert your username}
   - Password: {insert your password}

3. If SBRP database happens to be empty, head to SQL folder and run SBRP_database.sql.
4. Import table data for Role Listing and Role Applications table respectively.

## 3. Start Up
1. Build the docker images.

Open a new terminal in vsc.

```
cd sbrp
docker-compose up -d
```
2. Access the Konga website via http://localhost:1337 and create an admin user for Konga.

3. After sign in, connect konga to kong by creating a new connection with the following details.
   - Name: default
   - Kong Admin URL: http://kong:8001

4. On the left panel, under applications, click on snapshots.

5. Click on "import from file", select "SBRP_V3.json" from "API_Gateway_snapshot" folder.

6. Click "details" and click "restore".

7. Select "services" and "routes" and "import objects". If there are any fails after restoring, repeat restore step.
  
8. Please check that all the images and containers are running using `docker images` and `docker ps` in your command prompt.

  **Using `docker images`, you should see the following images.**
  - spmg7t6/is212_skill
  - spmg7t6/is212_profile
  - spmg7t6/is212_web
  - spmg7t6/is212_role
  - spmg7t6/is212_login

  **Using `docker ps`, you should see the following images.**
  - spmg7t6/is212_login:rc-latest
  - spmg7t6/is212_profile:rc-latest
  - spmg7t6/is212_web:rc-latest
  - spmg7t6/is212_skill:rc-latest
  - spmg7t6/is212_role:rc-latest

9. Next, start up the SBRP web application.

Open a new terminal in vsc.

```
cd skillbasedroleportal
npm install --legacy-peer-deps 
npm run dev
```
