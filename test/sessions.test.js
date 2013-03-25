var fixture = require('./fixture'),
  request = require('request'),
  setSocketIOHandshakeCookies = require('./fixture/setSocketIOHandshakeCookies');

var io = require('socket.io-client');

describe('sessions', function () {

  //start and stop the server 
  before(fixture.start);
  after(fixture.stop);

  //create a new session for every test
  beforeEach(function (done) {
    this.cookies = request.jar();
    setSocketIOHandshakeCookies(this.cookies);
    //set foo in the session
    request.get({
      jar: this.cookies,
      url: 'http://localhost:9000/'
    }, done);
  });

  it('should receive session information', function (done){
    var socket = io.connect('http://localhost:9000', {'force new connection': true});
    socket.on('hey', function(data){
      data.should.eql(123);
      done();
    });
  });

  it('should be able to store new data in session', function (done) {
    var socket = io.connect('http://localhost:9000', {'force new connection': true});
    socket.on('stored', function (data) {
      data.should.eql(456);
      done();
    });
    socket.emit('store this', 456);
  });

});