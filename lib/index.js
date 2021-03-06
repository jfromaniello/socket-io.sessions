var connectUtils = require('connect').utils;
var cookie = require('cookie');
var xtend = require('xtend');

function handler(options, cont) {
  var defaults = {
    key: 'connect.sid',
    secret: null,
    store: null,
    success: null,
    fail: null
  };

  options = xtend({}, defaults, options );

  return function(data, accept){
    // socket.io v1.0 now provides socket handshake data via `socket.request`
    if (data.request) {
      data = data.request;
      data.socketio_version_1 = true;
    }

    if (!data.headers.cookie) {
      if (options.fail) {
        return options.fail(data, 'No cookies present in header', false, accept);
      }
      return accept(null, false);
    }

    var parsedCookie  = cookie.parse(data.headers.cookie);
    var currentCookie = connectUtils.parseSignedCookies(parsedCookie, options.secret);
    var sessionID     = currentCookie[ options.key ];

    data.getSession = function (done) {
      options.store.get(sessionID, function(err, session){
        if (err) return done(err);
        done(null, session);
      });
    };
    data.saveSession = function (session, done) {
      options.store.set(sessionID, session, function(err){
        if (!done) return;
        if (err) return done(err);
        done();
      });
    };


    if(cont) return cont(data, accept);

    accept(null, true);
  
  };
}

module.exports = handler;
