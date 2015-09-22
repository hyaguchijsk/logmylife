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

  // callback for date selector changing
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

  // for history selector
  function updateHistoryTimeSelector(year, month, day) {
    // year
    $('#history_year').text('');
    for (var i = 0; i >= -1; i--) {
      vyear = year_now + i;
      if (vyear == year) {
        $('#history_year').append(
          '<option value="' + vyear + '" selected>' + vyear + '</option>');
      } else {
        $('#history_year').append(
          '<option value="' + vyear + '">' + vyear + '</option>');
      }
    }

    // month
    $('#history_month').text('');
    for (var i = 0; i < 12; i++) {
      if (i == month) {
        $('#history_month').append(
          '<option value="' + (i + 1) + '" selected>' + (i + 1) + '</option>');
      } else {
        $('#history_month').append(
          '<option value="' + (i + 1) + '">' + (i + 1) + '</option>');
      }
    }

    // day should be checked
    var day_range_month = new Date(year, (month + 1), 0).getDate();
    $('#history_day').text('');
    for (var i = 1; i <= day_range_month; i++) {
      if (i == day) {
        $('#history_day').append(
          '<option value="' + i + '" selected>' + i + '</option>');
      } else {
        $('#history_day').append(
          '<option value="' + i + '">' + i + '</option>');
      }
    }
  }
  function createHistoryDate() {
    var year = Number($('#history_year option:selected').val());
    var month = Number($('#history_month option:selected').val()) - 1;
    var day = Number($('#history_day option:selected').val());

    var day_range_month = new Date(year, (month + 1), 0).getDate();
    var vday = day;
    if (day > day_range_month) {
      vday = day_range_month;
    }
    return new Date(year, month, vday, 0, 0, 0);
  }
  updateHistoryTimeSelector(year_now, month_now, day_now);


  // write to json file
  function writeToJSON(client, filename, obj) {
    client.writeFile(
      filename, JSON.stringify(obj, null, 2),
      function(error, stat) {
        if (error) {
          alert('Error writing ' + filename + ': ' + error);
        }
      });
  }

  // Try to finish OAuth authorization.
  var client = new Dropbox.Client({key: 'efvlr1x3fmx1l7v'});
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

    // open files
    client.readFile('food_db.json', function (error, data) {
      if (error) {
        alert('Error opening food_db.json: ' + error);
      }
      var food_db = $.parseJSON(data);
      var vendor_food_hash = new Object();  // hash table for vendor : [food]

      function readFoodDB() {
        if (food_db !== null) {
          vendor_food_hash = new Object();

          $('#select_food').text('');
          $('#select_vendor').text('');
          $.each(food_db,
                 function(i, v) {
                   if (vendor_food_hash[v.vendor]) {
                     vendor_food_hash[v.vendor].push(v);
                   } else {
                     vendor_food_hash[v.vendor] = [v];
                   }
                 });
          for (key in vendor_food_hash) {
            $('#select_vendor').append(
              '<option value=' + key + '>' + key + '</option>'
            );
          }
          if (Object.keys(vendor_food_hash).length >= 0) {
            setFoodByVendor(Object.keys(vendor_food_hash)[0]);
          }
        } else {
          alert('readTable: Could not open table');
        }
      }
      function setFoodByVendor(key) {
        $('#select_food').text('');
        $.each(vendor_food_hash[key],
               function(i, v) {
                 $('#select_food').append(
                   '<option value=' + v.id + '>' + v.name + '</option>'
                 );
               });
      }
      // if vendor selection changed, update food selector
      function vendorChangeCallback() {
        setFoodByVendor(
          $('#select_vendor option:selected').text());
      }
      $('#select_vendor').change(vendorChangeCallback);
      // datastore.recordsChanged.addListener(readFoodDB);
      readFoodDB();

      function writeFoodDB(name,
                           vendor,
                           energy,
                           protein,
                           lipid,
                           carbohydrate,
                           sodium) {
        if (food_db != null) {
          food_db.push({
            'id' : String(new Date().getTime()),
            'name' : name,
            'vendor' : vendor,
            'energy' : energy,
            'protein' : protein,
            'lipid' : lipid,
            'carbohydrate' : carbohydrate,
            'sodium': sodium
          });
          writeToJSON(client, 'food_db.json', food_db);
          readFoodDB();
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


      // eat_db
      function createEatDBFileName(date) {
        return('what_did_you_eat_' + date.getFullYear() + '_'
               + ('00' + (date.getMonth() + 1)).substr(-2) + '.json');
      }

      function updateEatDB(db_date) {
        var eat_db_file = createEatDBFileName(db_date);
        client.readFile(eat_db_file, function (error, data) {
          var eat_db = [];
          if (error) {
            if (error.status != Dropbox.ApiError.NOT_FOUND) {
              alert('Error opening ' + eat_db_file + ': ' + error);
            }
          } else {
            eat_db = $.parseJSON(data);
          }

          function readEatDB() {
            $('#food_history').text('');
            var total_energy = 0;
            var total_salt = 0;
            var history_date = createHistoryDate();
            var hyear = history_date.getFullYear();
            var hmonth = history_date.getMonth();
            var hday = history_date.getDate();
            $.each(eat_db,
                   function(i, v) {
                     var date = new Date(v.date);
                     if ((hyear == date.getFullYear()) &&
                         (hmonth == date.getMonth()) &&
                         (hday == date.getDate())) {
                       $('#food_history').append('<tr>');
                       $('#food_history').append(
                         '<td>' + date + '</td>');
                       var food_item = null;
                       $.each(food_db, function(j, foodi) {
                         if (foodi.id == v.food_id) {
                           food_item = foodi;
                           return false;
                         }
                       });
                       if (food_item) {
                         $('#food_history').append(
                           '<td>' + food_item.vendor + '</td>');
                         $('#food_history').append(
                           '<td>' + food_item.name + '</td>');
                         $('#food_history').append(
                           '<td>' + food_item.energy + '</td>');
                         var sod = new Number(food_item.sodium);
                         if (!isNaN(sod)) {
                           var salt = sod * 2.54 / 1000.0;
                           $('#food_history').append(
                             '<td>' + String(salt).substr(0, 5) + '</td>');
                           total_salt += salt;
                         }
                         $('#food_history').append(
                           '<td><input type="checkbox" value="' +
                             v.id + '" name="check_delete"></td>');
                         total_energy += Number(food_item.energy);
                       } else {
                         $('#food_history').append('<td>not found</td>');
                       }
                       $('#food_history').append('</tr>');
                     }
                   });
            $('#total_energy').text(String(total_energy));
            $('#total_salt').text('');
            var salt_str = String(total_salt).substr(0, 5);
            var salt_colored_str;
            if (total_salt >= 7.0) {
              salt_colored_str = '<span class="text-danger">' +
                salt_str + '</span>';
            } else if (total_salt >= 5.0) {
              salt_colored_str = '<span class="text-warning">' +
                salt_str + '</span>';
            } else {
              salt_colored_str = salt_str;
            }
            $('#total_salt').append(salt_colored_str);
          }  // readEatDB
          // datastore.recordsChanged.addListener(readEatDB);
          readEatDB();

          function historyDateChangeCallback() {
            var date = createHistoryDate();
            if (db_date.getFullYear() == date.getFullYear() &&
                db_date.getMonth() == date.getMonth()) {
              updateHistoryTimeSelector(date.getFullYear(),
                                        date.getMonth(),
                                        date.getDate());
              readEatDB();
            }
          }
          $('#history_day').change(historyDateChangeCallback);

          function writeEatDB(date, food_id) {
            if (db_date.getFullYear() == date.getFullYear() &&
                db_date.getMonth() == date.getMonth()) {
              if (eat_db != null) {
                eat_db.push({
                  'id' : String(new Date().getTime()),
                  'date' : date.toString(),
                  'food_id' : food_id
                });
                writeToJSON(client, eat_db_file, eat_db);
                readEatDB();
              } else {
                alert('writeTable: Could not open table');
              }
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
            var hdate = createHistoryDate();
            if (db_date.getFullYear() == hdate.getFullYear() &&
                db_date.getMonth() == hdate.getMonth()) {
              $.each(
                $('input:checkbox[name="check_delete"]:checked'),
                function(i, v) {
                  var did = $(v).val();
                  $.each(
                    eat_db,
                    function(j, ei) {
                      if (ei.id == did) {
                        eat_db.splice(j, 1);
                        return false;
                      }
                    });
                });
              writeToJSON(client, eat_db_file, eat_db);
              readEatDB();
            }
          });
        });  // readFile(eatdb)
      }  // updateEatDB
      updateEatDB(new Date());

      function historyYearMonthChangeCallback() {
        var date = createHistoryDate();
        updateHistoryTimeSelector(date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate());
        updateEatDB(date);
      }
      $('#history_year').change(historyYearMonthChangeCallback);
      $('#history_month').change(historyYearMonthChangeCallback);

    });  // readfile('food_db.json')

  }  // authCallback
});
