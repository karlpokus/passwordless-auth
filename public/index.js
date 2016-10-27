// for later
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

// login/signup
$('input').on('keyup', function(e){
  if (e.which === 13) {
    e.preventDefault();
    var email = $(this).val();

    console.log(email);

    $.ajax({
      type: "POST",
      url: '/user',
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
