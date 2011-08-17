(function() {
  $(function() {
    var dataUriImage, loadImage, socket, store;
    socket = io.connect('http://localhost:7777/');
    store = (function() {
      return {
        set: function(k, v) {
          return localStorage.setItem(k, v);
        },
        get: function(k) {
          return localStorage.getItem(k);
        },
        remove: function(k) {
          return localStorage.removeItem(k);
        },
        clear: function() {
          return localStorage.clear();
        }
      };
    })();
    dataUriImage = function(type, data) {
      return "data:" + type + ";base64," + data;
    };
    loadImage = function(id, url) {
      var localImage;
      localImage = JSON.parse(store.get(id));
      if (localImage != null) {
        $("#" + id).attr('src', dataUriImage(localImage.type, localImage.image));
        return $('#msg').text('loaded from local storage');
      } else {
        return socket.emit('get_image', {
          id: id,
          url: url
        });
      }
    };
    socket.on('image', function(response) {
      $("#" + response.id).attr('src', dataUriImage(response.type, response.image));
      store.set(response.id, JSON.stringify({
        type: response.type,
        image: response.image
      }));
      return $('#msg').text('loaded from web socket');
    });
    $('#clear').click(function() {
      store.clear();
      return window.location.reload();
    });
    loadImage('google-logo', 'http://www.google.com/intl/en_com/images/srpr/logo1w.png');
    return loadImage('svg-icon', 'http://localhost:7777/icon_tiny.svg');
  });
}).call(this);
