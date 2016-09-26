"use strict";

// tests/test2.js
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let should = chai.should();
// chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

let appModules = require('../src/index');
let request = require('supertest');

describe('Base Server Test', function() {
  let server;
  let app;
  let port;
  let baseRoute;

  beforeEach(function () {      // Start up a clean server on the configured port
    server = appModules.server;
    app = appModules.app;
    port = app.config.OMA_DM.port;
    baseRoute = app.config.OMA_DM.baseRoute;
  });
  afterEach(function () {       // close down the server
    server.close();
  });
  it('Simple GET - returns default version and option count', function(done) {
        request(server)
            .get(baseRoute)
            .expect(200)
            .expect('"{version: 16, optionCount: 2}"', done);
  });

  it('GET of bad address - returns 404 and a message for bad route', function(done) {
        request(server)
            .get('')
            .expect(404)
            .expect('Cannot GET /\n', done);
  });

  it('Simple POST - no data, returns default version and option count', function(done) {
        request(server)
            .post(baseRoute)
            .expect(200)
            .expect('"{version: 16, optionCount: 2}"', done);
  });

  it('Simple Post to bad address - returns 404 and a message for bad route', function(done) {
        request(server)
            .post('')
            .expect(404)
            .expect('Cannot POST /\n', done);
  });

  it('Simple Post of binary Data for Version=3; OptionCount = 15', function(done) {
        var Version = 3;   // Version = 4 bits from 0 - 15, 10 = 1010
        var OC = 15;         // OC = 5 bits from 0 - 31 so take OC #, shift 1 bit right then + (Version << 4) and then MSB of next byte
        var LSB = OC & 1;
        var Byte1 = (Version << 4) | (OC >>> 1);
        var Byte2 = LSB << 7;
        var theData = new Buffer([Byte1, Byte2]);

        request(server)
            .post(baseRoute)
            .set('Content-Type', 'application/octet-stream')
            .send(theData)
            .end(function(err, res){
                if (err) {
                    console.log(err);
                }
                done();
             })
            .expect(200)
            .expect('"{version: 3, optionCount: 15}"');
  });
});
