$(function() {
  // set Date to selector
  var date_now = new Date();
  var year_now = date_now.getFullYear();
  var month_now = date_now.getMonth();
  var day_now = date_now.getDate();
  var hour_now = date_now.getHours();
  var minute_now = date_now.getMinutes();

  function updateTimeSelector(year, month, day, hour, minute) {
    // year
    $('#select_year').text('');
    for (var i = 0; i >= -1; i--) {
      vyear = year_now + i;
      if (vyear == year) {
        $('#select_year').append(
          '<option value="' + vyear + '" selected>' + vyear + '</option>');
      } else {
        $('#select_year').append(
          '<option value="' + vyear + '">' + vyear + '</option>');
      }
    }

    // month
    $('#select_month').text('');
    for (var i = 0; i < 12; i++) {
      if (i == month) {
        $('#select_month').append(
          '<option value="' + (i + 1) + '" selected>' + (i + 1) + '</option>');
      } else {
        $('#select_month').append(
          '<option value="' + (i + 1) + '">' + (i + 1) + '</option>');
      }
    }

    // day should be checked
    var day_range_month = new Date(year, (month + 1), 0).getDate();
    $('#select_day').text('');
    for (var i = 1; i <= day_range_month; i++) {
      if (i == day) {
        $('#select_day').append(
          '<option value="' + i + '" selected>' + i + '</option>');
      } else {
        $('#select_day').append(
          '<option value="' + i + '">' + i + '</option>');
      }
    }

    // hour
    $('#select_hour').text('');
    for (var i = 0; i < 24; i++) {
      if (i == hour) {
        $('#select_hour').append(
          '<option value="' + i + '" selected>' + i + '</option>');
      } else {
        $('#select_hour').append(
          '<option value="' + i + '">' + i + '</option>');
      }
    }

    // minute
    $('#select_minute').text('');
    for (var i = 0; i < 60; i++) {
      if (i == minute) {
        $('#select_minute').append(
          '<option value="' + i + '" selected>' + i + '</option>');
      } else {
        $('#select_minute').append(
          '<option value="' + i + '">' + i + '</option>');
      }
    }
  }

  // create Date from selector
  function createDate() {
    var year = Number($('#select_year option:selected').val());
    var month = Number($('#select_month option:selected').val()) - 1;
    var day = Number($('#select_day option:selected').val());
    var hour = Number($('#select_hour option:selected').val());
    var minute = Number($('#select_minute option:selected').val());

    var day_range_month = new Date(year, (month + 1), 0).getDate();
    var vday = day;
    if (day > day_range_month) {
      vday = day_range_month;
    }
    return new Date(year, month, vday, hour, minute, 0);
  }

  function dateChangeCallback() {
    var date = createDate();
    updateTimeSelector(date.getFullYear(),
                       date.getMonth(),
                       date.getDate(),
                       date.getHours(),
                       date.getMinutes());
  }
  $('#select_year').change(dateChangeCallback);
  $('#select_month').change(dateChangeCallback);
  $('#select_day').change(dateChangeCallback);

  // time selector update first
  updateTimeSelector(year_now, month_now, day_now, hour_now, minute_now);

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
      datastore.recordsChanged.addListener(readFoodDB);
      readFoodDB();

      function writeFoodDB(name,
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
      }  // writeFoodDB

      $('#food_add_submit').click(function(e) {
        e.preventDefault();
        if (($('#food_name').val() != "") &&
            ($('#food_vendor').val() != "") &&
            ($('#food_energy').val() != "")) {
          writeFoodDB($('#food_name').val(),
                      $('#food_vendor').val(),
                      $('#food_energy').val(),
                      $('#food_protein').val(),
                      $('#food_lipid').val(),
                      $('#food_carbohydrate').val(),
                      $('#food_sodium').val());
        }
      });  // #food_add_submit

      function readEatDB() {
        $('#food_history').text('');
        records = table_eat_db.query();
        var total_energy = 0;
        $.each(records,
               function(i, v) {
                 $('#food_history').append('<tr>');
                 var date = v.get('date');
                 $('#food_history').append(
                   '<td>' + date + '</td>');
                 try {
                   var food_item = table_food_db.get(v.get('food_id'));
                   $('#food_history').append(
                     '<td>' + food_item.get('vendor') + '</td>');
                   $('#food_history').append(
                     '<td>' + food_item.get('name') + '</td>');
                   $('#food_history').append(
                     '<td>' + food_item.get('energy') + '</td>');
                   $('#food_history').append(
                     '<td><input type="checkbox" value="' +
                       v.getId() +
                       '" name="check_delete"></td>');
                   total_energy += Number(food_item.get('energy'));
                   console.log(total_energy);
                 } catch (e) {
                   $('#food_history').append('<td>not found</td>');
                 }
                 $('#food_history').append('</tr>');
               });
        console.log(total_energy);
        $('#total_energy').text(String(total_energy));
      }  // readEatDB
      datastore.recordsChanged.addListener(readEatDB);
      readEatDB();

      function writeEatDB(date, food_id) {
        if (table_eat_db != null) {
          table_eat_db.insert({
            date: date,
            food_id: food_id
          });
        } else {
          alert('writeTable: Could not open table');
        }
      }  // writeEatDB

      $('#food_eat_submit').click(function(e) {
        e.preventDefault();
        var date;
        if ($('#radio_now').is(':checked')) {
          date = new Date();
        } else {
          date = createDate();
        }
        writeEatDB(date, $('#select_food option:selected').val());
      });  // food_eat_submit

      $('#food_delete_item').click(function(e) {
        e.preventDefault();
        $.each(
          $('input:checkbox[name="check_delete"]:checked'),
          function(i, v) {
            table_eat_db.get($(v).val()).deleteRecord();
          }
        );
      });

    });  // openDefaultDatastore
  }  // authCallback
});
