express = require 'express'
request = require 'request'

app = express.createServer()

io = require('socket.io').listen(app)
io.enable('browser client minification');

app.configure 'development', ->
    app.use express.static __dirname + '/views'

app.listen 7777

io.sockets.on 'connection', (socket) ->
	socket.on 'get_image', (req) ->
		request {
			uri: req.url,
			encoding: 'binary'
		}, (error, response, body) ->
			image = new Buffer(body, 'binary').toString('base64')
			socket.emit 'image', { id: req.id, url: req, type: response.headers["content-type"], image: image }