$(function() {
  var client = new Dropbox.Client({key: 'efvlr1x3fmx1l7v'});
  // Try to finish OAuth authorization.
  client.authenticate({interactive: false}, authCallback);
  
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

    // open datastores
    var dsmanager = client.getDatastoreManager();
    var datastore = null;
    var table_food_db = null;
    dsmanager.openDefaultDatastore(function(error, ds) {
      if (error) {
        alert('Error opening default datastore: ' + error);
      }
      datastore = ds;
      try {
        table_food_db = datastore.getTable('food_db');
      } catch (e) {
        alert(e);
      }

      function readTable() {
        if (table_food_db !== null) {
          // delete no named items
          // records = table_food_db.query({name: ""});
          // $.each(records,
          //        function(i, v) {
          //          v.deleteRecord();
          //        });
          
          records = table_food_db.query();
          $('#select_food').text('');
          $.each(records,
                 function(i, v) {
                   $('#select_food').append(
                     '<option value=' + v.getId() + '>' +
                       v.get('vendor') + ' ' + v.get('name') +
                       '</option>'
                   );
                 });
        } else {
          alert('readTable: Could not open table');
        }
      }
      datastore.recordsChanged.addListener(readTable);
      readTable();

      function writeTable(name,
                          vendor,
                          energy,
                          protein,
                          lipid,
                          carbohydrate,
                          sodium) {
        if (table_food_db != null) {
          table_food_db.insert({
            name: name,
            vendor: vendor,
            energy: energy,
            protein: protein,
            lipid: lipid,
            carbohydrate: carbohydrate,
            sodium: sodium
          });
        } else {
          alert('writeTable: Could not open table');
        }
      }
      
      $('#food_add_submit').click(function(e) {
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
    });
  }
});
