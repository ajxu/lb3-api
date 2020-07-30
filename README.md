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
Web server listening at: http://localhost:3000
Browse your REST API at http://localhost:3000/explorer
Model schema updated
```
If you see this log in terminal, it means that your database details are configured correctly and the app has launched.

### Unit Test - API Endpoint testing
8. Unit test is done with Jest and Supertest. The test file (api-endpoint.test.js) can be found in the tests directory of the project root.

9. To run the test, in the terminal at project root prompt, type:
```
npm test
```
You should then see some thing similar to the image below if all the tests had passed. The test data inserted into the database was purposefully not removed after tests for the convenience of testing in the Assignment Proper section.

![alt text](https://github.com/ajxu/lb3-api/blob/master/tests/test-example.png)

### Schema Migration
10. There is an auto-migration script that updates the model schema into the the table, this will run everytime on running project but don't worry it updates the schema and you will not lose your data. The migration script can be found in:
- lb3-api (project root folder)
  - server
    - boot
      - autoupdate.js
 
 ### Example Usage using Explorer (http://localhost:3000/explorer)
11.  Loopback 3 comes with Swagger UI API explorer built-in. To access it, go to:
 ```
 http://localhost:3000/explorer/
 ```
 #### Adding users
12. In explorer, head to User -> POST /user endpoint and click on the endpoint name.
Under Parameters next to data enter the following into Value to create a user:
 ```
{
  "userId": "user1@example.com"
}
 ```
 and click "Try it out!" button.

 #### Adding groups
 10. In explorer, head to Group -> POST /group endpoint and click on the endpoint name.
Under Parameters next to data enter the following into Value to create a group:
 ```
{
  "groupName": "Group 1"
}
 ```
 and click "Try it out!" button.
 
### Assignment Proper
#### Please use Postman for testing the assignment requirements

11. Here is my Postman collection for your convenience

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e1b03027bc564c911377)

12. Please note, for your convenience unit test will insert sample data into the database during testing to be used with my Postman collection. If you choose not to use my collection, you may add users and groups through Explorer as shown in the Example Usage section for the testing.

### Summary
I had initially chose to use Loopback 3 (LB3) due to good past experience with Loopback 2 (LB2), here are my considerations:
- LB3 can quickly generate CRUD api endpoints for faster development and scaling
- LB3 comes with it's own ORM which removes mistakes in SQL queries in development.
- LB3 can generate models to be customised and schema is almost database agnostic, it can map complex relationships (e.g. many-to-many) with just javascipt or json.
- LB3 has connectors for SQL and NOSQL databases and can use multiple databases (datasources) in one app.

At hindsight, I would however not use LB for current projects due to the following:
- LB3 is in LTS and maintenance will end in December 2020. Currently, dependency deprecation is growing.
- LB4 is in development and uses Typescript, as of date the master branch does not support many-to-many modeling
- LB3 does not have an easy way to unit test custom endpoints (called remote methods)
