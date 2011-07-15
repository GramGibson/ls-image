(function() {
  var app, express, io, request;
  express = require('express');
  request = require('request');
  app = express.createServer();
  io = require('socket.io').listen(app);
  io.enable('browser client minification');
  app.configure('development', function() {
    return app.use(express.static(__dirname + '/views'));
  });
  app.listen(7777);
  io.sockets.on('connection', function(socket) {
    return socket.on('get_image', function(req) {
      return request({
        uri: req.url,
        encoding: 'binary'
      }, function(error, response, body) {
        var image;
        image = new Buffer(body, 'binary').toString('base64');
        return socket.emit('image', {
          id: req.id,
          url: req,
          type: response.headers["content-type"],
          image: image
        });
      });
    });
  });
}).call(this);
