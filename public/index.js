var router = {
  URLparser: function(str) {
    var out = {};

    if (/\?/.test(str)) {
      var majorParts = str.split('?');
      out.path = majorParts[0];
      out.query = majorParts[1]
        .split('&')
        .reduce(function(base, str){
          var minorParts = str.split('='),
            k = minorParts[0],
            v = minorParts[1];
          base[k] = v;
          return base;
      }, {});

    } else {
      out.path = str;
    }
    return out;
  },
  routes: {},
  add: function(path, fn) {
    this.routes[path] = fn;
  },
  go: function(path, update) {
    if (update) {
      history.pushState({}, "", path);
    }
    var url = this.URLparser(path);

    if (this.routes[url.path]) {
      if (url.query) {
        this.routes[url.path](url.query);
      } else {
        this.routes[url.path]();
      }
    }
  }
};

function tokenFound() {
  var tokenInStorage = localStorage.getItem("token"),
      currentURL = window.location.href,
      parsedURL = router.URLparser(currentURL);
  
  if (tokenInStorage) {
    return tokenInStorage;
  } else if (parsedURL.query && parsedURL.query.token) {
    return parsedURL.query.token;
  } else {
    return null;
  }
}

function validateToken(token, cb) {
  $.ajax({
    type: "POST",
    url: '/token',
    data: {token: token},
    success: function(data){
      cb(null, data);
    },
    error: function(){
      cb('something blew up!');
    }
  });
}

function init() {
  var token = tokenFound();
  
  if (token) {
    validateToken(token, function(err, data){
      if (err) return console.error(err);
      
      if (data.ok) {
        // showSecret with data
      } else {
        // showLogin
      }
    });
  } else {
    // showLogin
  }
}

// login/signup
$('input').on('keyup', function(e){
  if (e.which === 13) {
    e.preventDefault();
    var email = $(this).val();

    $.ajax({
      type: "POST",
      url: '/logup',
      data: {email: email},
      success: function(){
        console.log('success');
      },
      error: function(){
        console.error('error');
      }
    });


  }
});

//init();
