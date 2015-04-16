$(function() {
  var client = new Dropbox.Client({key: 'efvlr1x3fmx1l7v'});
  // Try to finish OAuth authorization.
  client.authenticate({interactive: false}, function (error) {
    if (error) {
      $('#auth').text('Authentication error: ' + error);
    }
  });

  function checkAuth() {
    // authenticated?
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
    }
  }
  checkAuth();
  

  // login action
  $("#btn_login").click(function (event) {
    if (!client.isAuthenticated()) {
      client.authenticate();
      checkAuth();
    } else {
      client.signOut({}, function (error) {
        if (error) {
          $('#auth').text('Authentication error: ' + error);
        }
      });
    }
  });


  // data operation
  function readTable() {
    if (client.isAuthenticated()) {
      client.getDatastoreManager().openDefaultDatastore(
        function (error, datastore) {
          if (error) {
            alert('Error opening default datastore: ' + error);
          }
          try {
            table = datastore.getTable('food_db');

            // delete no named items
            // records = table.query({name: ""});
            // $.each(records,
            //        function(i, v) {
            //          v.deleteRecord();
            //        });

            $('#div_food').html('')
            $('#div_food').append('<ul>')
            records = table.query();
            $.each(records,
                   function(i, v) {
                     $('#div_food ul').append('<li>' + v.get('vendor') + '</li>');
                   });
            $('#div_food').append('</ul>')
          } catch (e) {
            alert(e);
          }
        }
      );
    }
  }

  function writeTable(name,
                      vendor,
                      energy,
                      protein,
                      lipid,
                      carbohydrate,
                      sodium) {
    if (client.isAuthenticated()) {
      client.getDatastoreManager().openDefaultDatastore(
        function (error, datastore) {
          if (error) {
            alert('Error opening default datastore: ' + error);
          }
          try {
            table = datastore.getTable('food_db');
            table.insert({
              name: name,
              vendor: vendor,
              energy: energy,
              protein: protein,
              lipid: lipid,
              carbohydrate: carbohydrate,
              sodium: sodium
            });
          } catch (e) {
            alert(e);
          }
        }
      );
    }
  }

  $('#food_submit').click(function(e) {
    if (($('#food_name').val() != "") &&
        ($('#food_vendor').val() != "") &&
        ($('#food_energy').val() != "")) {
      writeTable($('#food_name').val(),
                 $('#food_vendor').val(),
                 $('#food_energy').val(),
                 $('#food_protein').val(),
                 $('#food_lipid').val(),
                 $('#food_carbohydrate').val(),
                 $('#food_sodium').val());
    }
    return e.preventDefault();
  });

  readTable();
});
