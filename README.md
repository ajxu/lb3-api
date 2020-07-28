# lb3-api
NodeJS API Assessment (Loopback 3)

## Database Setup (Optional)
#### If you have an existing MySQL development environment then you may skip this step and go to Project Setup
1. A docker compose yaml file has been included to spin up MySQL and Adminer containers to be used alongside the project. 
This assumes you have installed Docker on your computer, if not please download from here [docker](https://www.docker.com/).

In terminal at project root prompt you can type:
```
docker-compose up -d
```
2. Once the containers are up, you may use Adminer to connect to MySQL. 

In your browser, go to:
```
localhost:8080
```
Login details are in the docker-compose.yml file itself.
- **Server**: mysql_db_container
- **Username**: root
- **Password**: password

3. Once logged into Adminer, you can create a new database. The project default database is called **testdb**, you can name your database the same, if not please change the database name in the project configuration. Read more in Project Setup.
