$ ->
	# open a new websockets connection
	socket = io.connect 'http://localhost:7777/'

	store = (->
		set: (k,v) -> localStorage.setItem(k, v)
		get: (k) -> localStorage.getItem(k)
		remove: (k) -> localStorage.removeItem(k)
		clear: -> localStorage.clear()
	)()

	dataUriImage = (type, data) ->
		return "data:#{type};base64,#{data}"

	loadImage = (id, url) ->
		localImage = JSON.parse(store.get(id))
		
		if localImage?
			$("##{id}").attr 'src', dataUriImage(localImage.type, localImage.image)
			$('#msg').text 'loaded from local storage'
		else
			socket.emit 'get_image', { id: id, url: url }
			
	socket.on 'image', (response) ->
		$("##{response.id}").attr 'src', dataUriImage(response.type, response.image)
		store.set response.id, JSON.stringify({ type: response.type, image: response.image })
		$('#msg').text 'loaded from web socket'
	
	$('#clear').click ->
		store.clear()
		window.location.reload()
			
	loadImage 'google-logo', 'http://www.google.com/intl/en_com/images/srpr/logo1w.png'