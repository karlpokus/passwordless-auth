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
  parseURL: function(data, next) {
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
      data.url.query = {};
    }
    return next();
  },
  go: function(path, update, o) {
    if (update) {
      history.pushState({}, "", path);
    }
    if (this.routes[path]) {
      var data = o || {},
          //stack = this.routes[path],
          stack = [this.parseURL].concat(this.routes[path]),
          errorHandler = function(err) {
            console.error(err);
            router.go('/', true);
          };

      pype(data, stack, errorHandler);
    }
  }
};

/*
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
    data.url.query = {};
  }
  return next();
}
*/

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
        data.secret = res;
        next();
      },
      error: function() {
        localStorage.removeItem("accessToken");
        next();
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
      error: function(err){
        next(err.responseText || err.statusText);
      }
    });
  } else {
    next('loginToken missing from url');
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

  } else if (data.feedback) {
    str = "<p>" + data.feedback + "</p>";

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
    data: {user: data.user},
    success: function(str){
      data.feedback = str;
      next();
    },
    error: function(err){
      next(err.responseText || err.statusText);
    }
  });
}

function init() {
  router.add('/', tradeAccessTokenForSecret, renderView);
  router.add('/user', tradeAccessTokenForSecret, renderView);
  router.add('/login', login, renderView);

  router.add('/loginToken',
    //URLparser,
    tradeLoginTokenForAccessToken,
    saveAccessToken,
    tradeAccessTokenForSecret, // router.go('/user', true) here?
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
