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
    var table_eat_db = null;
    var vendor_food_hash = new Object();  // hash table for vendor : [food]
    dsmanager.openDefaultDatastore(function(error, ds) {
      if (error) {
        alert('Error opening default datastore: ' + error);
      }
      datastore = ds;
      try {
        table_food_db = datastore.getTable('food_db');
        table_eat_db = datastore.getTable('what_did_you_eat');
      } catch (e) {
        alert(e);
      }

      function readFoodDB() {
        if (table_food_db !== null) {
          records = table_food_db.query();
          $('#food_db').text('');
          $('#food_db').append('[\n');
          var isfirst = true;
          $.each(records,
                 function(i, v) {
                   if (isfirst) {
                     isfirst = false;
                   } else {
                     $('#food_db').append(',\n');
                   }
                   $('#food_db').append('{\n');
                   $('#food_db').append('"id" : "' + v.getId() + '",\n');
                   $('#food_db').append('"vendor" : "' + v.get('vendor') + '",\n');
                   $('#food_db').append('"name" : "' + v.get('name') + '",\n');
                   $('#food_db').append('"energy" : "' + v.get('energy') + '",\n');
                   $('#food_db').append('"protein" : "' + v.get('protein') + '",\n');
                   $('#food_db').append('"lipid" : "' + v.get('lipid') + '",\n');
                   $('#food_db').append('"carbohydrate" : "' + v.get('carbohydrate') + '",\n');
                   $('#food_db').append('"sodium" : "' + v.get('sodium') + '"\n');
                   $('#food_db').append('}\n');
                 });
          $('#food_db').append(']\n');
        } else {
          alert('readTable: Could not open table');
        }
      }
      // datastore.recordsChanged.addListener(readFoodDB);
      // readFoodDB();

      function readEatDB() {
        $('#what_did_you_eat').text('');
        $('#what_did_you_eat').append('[\n');
        records = table_eat_db.query();
        var hyear = 2015;
        var hmonth = 9 - 1;

        var isfirst = true;

        $.each(records,
               function(i, v) {
                 var date = v.get('date');
                 if ((hyear == date.getFullYear()) &&
                     (hmonth == date.getMonth())) {
                   if (isfirst) {
                     isfirst = false;
                   } else {
                     $('#what_did_you_eat').append(',\n');
                   }
                   $('#what_did_you_eat').append('{\n');
                   $('#what_did_you_eat').append('"id" : "' + v.getId() + '",\n');
                   $('#what_did_you_eat').append('"date" : "' + date + '",\n');
                   $('#what_did_you_eat').append('"food_id" : "' + v.get('food_id') + '"\n');
                   $('#what_did_you_eat').append('}\n');
                 }
               });
        $('#what_did_you_eat').append(']\n');
      }  // readEatDB
      datastore.recordsChanged.addListener(readEatDB);
      readEatDB();

    });  // openDefaultDatastore
  }  // authCallback
});
