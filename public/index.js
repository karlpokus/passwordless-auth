var router = {
  routes: {},
  add: function(path) {
    this.routes[path] = Array.prototype.slice.call(arguments, 1);
  },
  go: function(path, update) {
    if (update) {
      history.pushState({}, "", path);
    }
    if (this.routes[path]) {
      var data = {},
          stack = this.routes[path];
      
      // add errorhandler here instead of binding
      
      pype(data, stack);
    }
  }
};

function URLparser(data, next) {
  data.url = {
    path = window.location.pathname
  };

  if (window.location.search) {      
    data.url.query = window.location.search.substr(1)
      .split('&')
      .reduce(function(base, str){
        var minorParts = str.split('='),
          k = minorParts[0],
          v = minorParts[1];
        base[k] = v;
        return base;
    }, {});
  } else {
    data.url.query = null;
  }
  return next();
}

function pype(errorHandler, data) {
  var i = 0,
      stack = Array.prototype.slice.call(arguments, 2),
      run = function() {
        stack[i++](data, next);
      },
      next = function(err) {
        if (err && errorHandler) {
          return errorHandler(err);
        } else {
          if (i < stack.length) {
            return run();
          }
        }
      }
  run();
}

pype = pype.bind(null, function(err){
  console.error(err);
});

function validateTokenInStorage(data, next) {
  var token = localStorage.getItem("access_token");
  if (token) {
    $.ajax({
      type: "POST",
      url: '/accessToken',
      data: {token: token},
      success: function(data){
        data.data = data;
        next();
      },
      error: function(){
        next();
      }
    });
  } else {
    next();
  }
}

function renderView(data, next) {
  if (data.data) {
    console.log('render secret view w data');
  } else {
    console.log('render login/signup');
  }
}

function validateTokenInURL(data, next) {
  if (data.url.query && data.url.query.token) {
    $.ajax({
      type: "POST",
      url: '/loginToken',
      data: {token: data.url.query.token},
      success: function(data){
        data.data = data;
        next();
      },
      error: function(){
        next();
      }
    });
  } else {
    next();
  }
}

function init() {
  router.add('/', validateTokenInStorage, renderView);
  router.add('/user', validateTokenInStorage, renderView);
  router.add('/token', URLparser, validateTokenInURL); // savetoken, removeTokenFromURL, renderView
  router.go(window.location.pathname, true);
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
