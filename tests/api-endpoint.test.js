/*
 * Please note that there is no easy way to prioritise the running of test in Jest,
 * therefore the tests are placed into a single file to run in sequence.
 * If the first test fails then all tests in sequence will fail as api testing requires specific responses
 * from the rest api.
 */

var app = require('../server/server');
var request = require('supertest');

/* Test to check MySQL configuration in datasource and migrate schema*/

describe('Connect MySQL', function() {
    test('Can connect and migrate schema to database', function(done) {
        app.dataSources.mysqlds.automigrate(['User','Group','UserGroup'], err => {
            if(err) done(err);
            done();
        });
    });
});

/* Test to check if api can create two users */

describe('POST /api/user', function() {
  test('create user1 (user1@test.com) and receive json response', function(done) {
    request(app)
      .post('/api/user')
      .send({userId: 'user1@test.com'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200,{
        "userId": "user1@test.com",
        "isSuspended": false
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  test('create user2 (user2@test.com) and receive json response', function(done) {
      request(app)
        .post('/api/user')
        .send({userId: 'user2@test.com'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          "userId": "user2@test.com",
          "isSuspended": false
        })
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
});

/* Test to check if can retrieve inserted users */

describe('GET /api/user', function() {
  test('get user1 & user2 in json response', function(done) {
    request(app)
      .get('/api/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          "userId": "user1@test.com",
          "photoBase64": null,
          "isSuspended": false
        },
        {
          "userId": "user2@test.com",
          "photoBase64": null,
          "isSuspended": false
        }
      ])
      .end(function(err, res) {
          if (err) return done(err);
          done();
      });
    });
  });

/* Test to check if can create two groups */

describe('POST /api/group', function() {
  test('create group1 and receive json response', function(done) {
    request(app)
      .post('/api/group')
      .send({groupName: 'Test Group 1'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        "groupId": 1,
        "groupName": "Test Group 1"
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  test('create group2 and receive json response', function(done) {
    request(app)
      .post('/api/group')
      .send({groupName: 'Test Group 2'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        "groupId": 2,
        "groupName": "Test Group 2"
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

/* Test to check if can retrieve inserted groups */

describe('GET /api/group', function() {
  test('get groups in json response', function(done) {
    request(app)
      .get('/api/group')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          "groupId": 1,
          "groupName": "Test Group 1"
        },
        {
          "groupId": 2,
          "groupName": "Test Group 2"
        }
      ])
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

/* Test to check if can assign users to group1 in many-to-many relation */

describe('PUT /api/user/{id}/groups/rel/1', function() {
  test('many-to-many assign user 1 into group1', function(done) {
    request(app)
      .put('/api/user/user1%40test.com/groups/rel/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
          "userId": "user1@test.com",
          "groupId": 1,
          "id": 1
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  test('many-to-many assign user 2 into group1', function(done) {
    request(app)
      .put('/api/user/user2%40test.com/groups/rel/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
          "userId": "user2@test.com",
          "groupId": 1,
          "id": 2
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

/* Test to check if can assign users to group2 in many-to-many relation */

describe('PUT /api/user/{id}/groups/rel/2', function() {
  test('many-to-many assign user 1 into group2', function(done) {
    request(app)
      .put('/api/user/user1%40test.com/groups/rel/2')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
          "userId": "user1@test.com",
          "groupId": 2,
          "id": 3
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  test('many-to-many assign user 2 into group2', function(done) {
    request(app)
      .put('/api/user/user2%40test.com/groups/rel/2')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
          "userId": "user2@test.com",
          "groupId": 2,
          "id": 4
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});


