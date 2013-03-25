Access [Express](http://expressjs.com/) session from [socket.io](http://socket.io).


## Installation

```
npm install socket-io.sessions
```

## Usage 


```javascript

  //configure passport and express

  var socketIo = require("socket.io"),
    socketIoSessions = require("socket-io.sessions");

  var sio = socketIo.listen(webServer);


  //same attribute than the session middleware http://www.senchalabs.org/connect/middleware-session.html

  sio.set("authorization", socketIoSessions({
    key:    'express.sid',       //the cookie where express (or connect) stores its session id.
    secret: 'my session secret', //the session secret to parse the cookie
    store:   mySessionStore      //the session store that express uses
  }));

  sio.sockets.on("connection", function(socket){
    
    socket.handshake.getSession(function (err, session) {
      socket.emit('aaa!', session.someSessionProperty);
    });

  });

```

### Change the session

~~~javascript

socket.handshake.getSession(function (err, session) {
  session.something = 123;
  socket.handshake.saveSession(session, function (err) {
    //whatever
  });
});

~~~


### Use with [passport-socket.io](https://github.com/jfromaniello/passport.socketio)

~~~javascript
  var sessionOptions = {
    key:    'express.sid',      
    secret: 'my session secret',
    store:   mySessionStore     
  };
  //chain the two this way:
  sio.set("authorization", socketIoSessions(sessionOptions, passportSocketIo.authorize(sessionOptions)));
~~~

## Develop

  npm install
  npm test


## License

MIT - José F. Romaniello 2012.
