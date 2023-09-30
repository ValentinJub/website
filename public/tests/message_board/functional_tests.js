const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../../../server');

chai.use(chaiHttp);

describe('Functional Tests', function() {
  this.timeout(5000);
  it('Creating a new thread: POST request to /api/threads/{board}', (done) => {
    chai
      .request(server)
      .post('/projects/is/message-board/api/threads/chaitest')
      .send({
        text: 'test thread',
        delete_password: 'test'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.redirects[0].split('/').pop(), 'chaitest');
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  let thread_id = null;
  it('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', (done) => {
    chai
      .request(server)
      .get('/projects/is/message-board/api/threads/chaitest')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body[0].text, 'test thread');
        assert.isBelow(res.body[0].replies.length, 4);
        assert.isBelow(res.body.length, 11);
        thread_id = res.body[0]._id;
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  it('Creating a new reply: POST request to /api/replies/{board}', (done) => {
    chai
      .request(server)
      .post('/projects/is/message-board/api/replies/chaitest')
      .send({
        thread_id: thread_id,
        text: 'test reply',
        delete_password: 'test'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        url = res.redirects[0].split('/')[res.redirects[0].split('/').length - 2];
        assert.equal(url, 'chaitest');
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  let reply_id = null;
  it('Viewing a single thread with all replies: GET request to /api/replies/{board}', (done) => {
    chai
      .request(server)
      .get('/projects/is/message-board/api/replies/chaitest')
      .query({
        thread_id: thread_id
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, 'test thread');
        assert.isArray(res.body.replies);
        assert.equal(res.body.replies[0].text, 'test reply');
        reply_id = res.body.replies[0]._id;
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  it('Reporting a thread: PUT request to /api/threads/{board}', (done) => {
    chai
      .request(server)
      .put('/projects/is/message-board/api/threads/chaitest')
      .send({
        thread_id: thread_id
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'reported');
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  it('Reporting a reply: PUT request to /api/replies/{board}', (done) => {
    chai
      .request(server)
      .put('/projects/is/message-board/api/replies/chaitest')
      .send({
        thread_id: thread_id,
        reply_id: reply_id
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'reported');
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  it('Deleting a reply with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', (done) => {
    chai
      .request(server)
      .delete('/projects/is/message-board/api/replies/chaitest')
      .send({
        thread_id: thread_id,
        reply_id: reply_id,
        delete_password: 'wrong'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  it('Deleting a reply with the correct password: DELETE request to /api/threads/{board} with an invalid delete_password', (done) => {
    chai
      .request(server)
      .delete('/projects/is/message-board/api/replies/chaitest')
      .send({
        thread_id: thread_id,
        reply_id: reply_id,
        delete_password: 'test'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  it('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', (done) => {
    chai
      .request(server)
      .delete('/projects/is/message-board/api/threads/chaitest')
      .send({
        thread_id: thread_id,
        delete_password: 'wrong'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        if(err) {
          console.log(err);
        }
        done();
      });
  });
  it('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with an invalid delete_password', (done) => {
    chai
      .request(server)
      .delete('/projects/is/message-board/api/threads/chaitest')
      .send({
        thread_id: thread_id,
        delete_password: 'test'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        if(err) {
          console.log(err);
        }
        done();
      });
  });
});
