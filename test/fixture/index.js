var express = require('express'),
    connect   = require('connect'),
    http = require('http'),
    xtend = require('xtend');

var socketIo = require('socket.io'),
    socketIoSessions = require('../../');

var sessionStore    = new connect.session.MemoryStore(),
    sessionSecret  = 'asdasdsdas1312312',
    sessionKey    = 'test-session-key',
    sessionOptions = {
      store:  sessionStore,
      key:    sessionKey,
      secret: sessionSecret
    };

var server;

exports.start = function (options, callback) {

  if(typeof options == 'function'){
    callback = options;
    options = {};
  }

  var app = express();
  app.configure(function(){
    app.use(express.cookieParser());

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.session(sessionOptions));
  });

  app.get('/', function(req, res){
    req.session.foobar = 123;
    res.send('hello');
  });

  server = http.createServer(app);

  var sio = socketIo.listen(server);

  sio.configure(function(){
    this.set('authorization', socketIoSessions(xtend(sessionOptions, options)));
    this.set('log level', 0);
  });

  sio.sockets.on('connection', function (socket) {
    function sendFoobar(eventName) {
      socket.handshake.getSession(function (err, session) {
        socket.emit(eventName, session.foobar);
      });
    }

    sendFoobar('hey');

    socket.on('store this', function (data) {
      socket.handshake.getSession(function (err, session) {
        session.foobar = data;
        socket.handshake.saveSession(session, function () {
          sendFoobar('stored');
        });
      });
    });
  });

  server.listen(9000, callback);
};

exports.stop = function (callback) {
  server.close();
  callback();
};