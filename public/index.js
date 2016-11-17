// cloud9 error muting fix
/* global $, history, localStorage */

var router = {
  routes: {},
  add: function(path) {
    this.routes[path] = Array.prototype.slice.call(arguments, 1);
  },
  updateURL: function(path) {
    if (window.location.pathname !== path) {
      history.pushState({}, "", path);
    }
  },
  go: function(path, update, o) {
    if (update) {
      history.pushState({}, "", path);
    }
    if (this.routes[path]) {
      var data = o || {},
          stack = this.routes[path];

      pype(data, stack, console.error);
    }
  }
};

function URLparser(data, next) {
  data.url = {
    path: window.location.pathname
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

function pype(data, stack, errorHandler) {
  var i = 0,
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
};

function tradeAccessTokenForSecret(data, next) {
  var token = localStorage.getItem("accessToken");
  if (token) {
    $.ajax({
      type: "POST",
      url: '/secret',
      data: {token: token},
      success: function(res){
        var authObj = JSON.parse(res);
        if (authObj.ok) {
          data.secret = authObj.secret;
          next();
        } else {
          next('Unauthorized');
        }        
      },
      error: function(){
        next('ajax error');
      }
    });
  } else {
    next();
  }
}

function tradeLoginTokenForAccessToken(data, next) {
  var token = data.url.query.loginToken;
  if (token) {
    $.ajax({
      type: "POST",
      url: '/accessToken',
      data: {token: token},
      success: function(res){
        data.accessToken = res;
        next();
      },
      error: function(){
        next('ajax error');
      }
    });
  } else {
    next('loginToken missing');
  }
}

function saveAccessToken(data, next) {
  localStorage.setItem("accessToken", data.accessToken);
  next();
}

function renderView(data, next) {
  var str;
  if (data.secret) {
    str = '<p>' + data.secret + '</p>';
    router.updateURL('/user');

  } else if (data.url) {
    str = "<a href=" + data.url + ">" + data.url + '</a>';

  } else {
    str = '<input type="email" placeholder="e-mail">';
    router.updateURL('/');
  }
  $('.content').empty().html(str);
}

function login(data, next) {
  $.ajax({
    type: "POST",
    url: '/login',
    data: data,
    success: function(url){
      data.url = url;
      next();
    },
    error: function(){
      next('ajax error');
    }
  });
}

function init() {
  router.add('/', tradeAccessTokenForSecret, renderView);
  router.add('/user', tradeAccessTokenForSecret, renderView);
  router.add('/login', login, renderView);

  router.add('/loginToken',
    URLparser,
    tradeLoginTokenForAccessToken,
    saveAccessToken,
    tradeAccessTokenForSecret,
    renderView);

  router.go(window.location.pathname, false);
}

init();

// EVENT - login

$('body').on('keyup', 'input', function(e){
  if (e.which === 13) {
    e.preventDefault();
    var email = $(this).val();
    router.go('/login', false, {user: email});
  }
});
