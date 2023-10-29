# SBRP
SPMG7T6 AY2023/24 2

## 1. Prerequisites
### 1.1 Installation
Please ensure that you have the following installed on your machine. You can follow this installation guide (https://docs.google.com/document/d/1hSqhVbgbclf-eOvBx5BQhaTJHxbUSUN4wZTrLNUMyUk/edit).

- Python 3
- Visual Studio Code
- Docker Desktop
- WAMP Server
- MySQL WorkBench
- Google Chrome
 
### 1.2 Launch
Make sure that your WAMP/MAMP Server and Docker is running.

## 2. Database
1. Open MySQL Workbench.

2. Set up new connection using the following details.
    Hostname: myrdsinstance.ctvrxbrt1hnb.ap-southeast-1.rds.amazonaws.com
    Port: 3306
    Username: sbrp_admin
    Password: 30e?lLIy^,248fX9T

3. If SBRP database happens to be empty, head to SQL folder and run SBRP_database.sql.
4. Import table data for Role Listing and Role Applications table respectively.

## 3. Start Up
1. Access the website via http://localhost:1337 and create an admin user for Konga.

2. After sign in, connect konga to kong by creating a new connection with the following details.
    Name: default
    Kong Admin URL: http://kong:8001

3. On the left panel, under applications, click on snapshots.

4. Click on import from file, select "SBRP_1" from snapshot folder.

5. Click details and click restore.

6. Select "services" and "routes" and confirm. If there are any fails after restoring, repeat restore step.

7. Build the docker images.

Open a new terminal in vsc.

```
cd sbrp
docker-compose up -d
```
  
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
