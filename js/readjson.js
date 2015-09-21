$(function() {
  var client = new Dropbox.Client({key: 'efvlr1x3fmx1l7v'});

  // auth
  client.authenticate(authCallback);

  // login action
  $("#btn_login").click(function (event) {
    event.preventDefault();
    if (!client.isAuthenticated()) {
      client.authenticate(authCallback);
    } else {
      client.signOut({}, function (error) {
        if (error) {
          $('#auth').text('Authentication error: ' + error);
        }
      });
    }
  });

  function authCallback(error, client) {
    if (error) {
      $('#auth').text('Authentication error: ' + error);
      return;
    }

    if (client.isAuthenticated()) {
      client.getAccountInfo(
        {},
        function (err, info, obj) {
          $('#auth').text('Hello ' + info.name);
          $('#btn_login').text('Logout');
          $('#btn_login').removeClass('btn-primary');
          $('#btn_login').addClass('btn-success');
        });
    } else {
      $('#auth').text('Authetication failed.');
      $('#btn_login').text('Login');
      $('#btn_login').removeClass('btn-success');
      $('#btn_login').addClass('btn-primary');
      return;
    }

    // read json file
    var food_db = null;
    client.readFile('food_db.json', function(error, data) {
      if (error) {
        console.log(error);
      }

      console.log(data);

      food_db = $.parseJSON(data);
      $.each(food_db,
             function(i, v) {
               $('#food_db').append('<p>' + v.name + '</p>');
             });
    });

  }  // authCallback
});
