# lb3-api
NodeJS API Assessment (Loopback 3)

### Database Setup (Optional)
#### If you have an existing MySQL development environment then you may skip this step and go to Project Setup
1. A docker compose yaml file has been included to spin up MySQL and Adminer containers to be used alongside the project. 
This assumes you have installed Docker on your computer, if not please download from here [docker](https://www.docker.com/).

In terminal, at the project root prompt, you can type:
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

3. Once logged into Adminer, you can create a new database. The project default database is called **testdb**, you can name your database the same, if not please change the database name in the project configuration. Read more in Setting Up & Running Project section.

### Setting Up & Running Project
4. In terminal, at the project root prompt, to install node_modules please type:
```
npm install
```

5. After installation, use an editor to open the following file:
- lb3-api (project root folder)
  - server
    - datasources.json

Please configure MySQL settings accordingly. By default (if you are using my docker-compose file) the settings will be:
```json
{
  "mysqlds": {
    "host": "127.0.0.1",
    "port": 3306,
    "url": "",
    "database": "testdb",
    "password": "password",
    "name": "mysqlds",
    "user": "root",
    "connector": "mysql"
  }
}
```

6. To run the project, in terminal at the project root prompt type:
```
node .
```
or
```
nodemon .
```

7. Please note that if MySQL database is connected properly, you should see something similar in terminal:
```
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node .`
Swagger: skipping unknown type "text".
Web server listening at: http://localhost:3000
Browse your REST API at http://localhost:3000/explorer
Model schema updated
```

### Schema Migration
8. There is an auto-migration script that updates the model schema into the the table, this will run everytime on running project but don't worry it updates the schema and you will not lose your data. The migration script can be found in:
- lb3-api (project root folder)
  - server
    - boot
      - autoupdate.js
 
 ### Example Usage
9.  Loopback 3 comes with Swagger UI API explorer built-in. To access it, go to:
 ```
 http://localhost:3000/explorer/
 ```
 #### Adding users
 10. In explorer, head to User -> POST /user endpoint and click on the endpoint name.
Under Parameters next to data enter the following into Value to create a user:
 ```
{
  "userId": "user1@example.com"
}
 ```
 and click "Try it out!" button.
 
11. You may create afew users for testing.

 #### Adding groups
 10. In explorer, head to Group -> POST /group endpoint and click on the endpoint name.
Under Parameters next to data enter the following into Value to create a group:
 ```
{
  "groupName": "Group 1"
}
 ```
 and click "Try it out!" button.
 
11. You may create afew groups for testing.
