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

      function updateFoodDB(id,
                            name,
                            vendor,
                            energy,
                            protein,
                            lipid,
                            carbohydrate,
                            sodium) {
        if (table_food_db != null) {
          try {
            table_food_db.get(id).update({
              name: name,
              vendor: vendor,
              energy: energy,
              protein: protein,
              lipid: lipid,
              carbohydrate: carbohydrate,
              sodium: sodium
            });
          } catch (e) {
            alert('writeTable: Could not update');
          }
        } else {
          alert('writeTable: Could not open table');
        }
      }  // updateFoodDB

      function deleteFoodDB(id) {
        table_food_db.get(id).deleteRecord();
      }  // deleteFoodDB

      function addTd(v, elem, size) {
        return '<td><input type="text" name="' + v.getId() + ':' + elem +
          '" value="' + v.get(elem) + '" size=' + size + '/></td>';
      }  // addTd

      function getTextByName(id, elem) {
        return $('input:text[name="' + id + ':' + elem + '"]').val();
      }  // getTextByName

      function readFoodDB() {
        if (table_food_db !== null) {
          records = table_food_db.query();
          $('#food_enum').text('');
          $.each(records,
                 function(i, v) {
                   $('#food_enum').append('<tr>');
                   $('#food_enum').append(addTd(v, 'vendor', 15));
                   $('#food_enum').append(addTd(v, 'name', 20));
                   $('#food_enum').append(addTd(v, 'energy', 10));
                   $('#food_enum').append(addTd(v, 'protein', 10));
                   $('#food_enum').append(addTd(v, 'lipid', 10));
                   $('#food_enum').append(addTd(v, 'carbohydrate', 10));
                   $('#food_enum').append(addTd(v, 'sodium', 10));
                   $('#food_enum').append(
                     '<td><input type="checkbox" value="' +
                       v.getId() +
                       '" name="check_delete" /></td>');
                   $('#food_enum').append(
                     '<td><button class="btn btn-warning update-btn" value="' +
                       v.getId() +
                       '">Update</button></td>');
                   $('#food_enum').append('</tr>');
                 });
        } else {
          alert('readTable: Could not open table');
        }

        $('.update-btn').click(function(e) {
          e.preventDefault();
          var target_id = e.target.value
          var deletep = $('input:checkbox[name="check_delete"][value='
                          + e.target.value + ']').is(':checked');
          var vendor = getTextByName(target_id, 'vendor');
          var name = getTextByName(target_id, 'name');
          var energy = getTextByName(target_id, 'energy');
          var protein = getTextByName(target_id, 'protein');
          var lipid = getTextByName(target_id, 'lipid');
          var carbohydrate = getTextByName(target_id, 'carbohydrate');
          var sodium = getTextByName(target_id, 'sodium');

          if (deletep) {
            if (window.confirm(
              vendor + " " + name +
                " :本当に削除しますか？ Really delete this?")){
              deleteFoodDB(target_id);
              alert("削除しました． Deleted.");
            } else {
              alert("キャンセルしました． Canceled.");
            }
          } else {
            console.log(vendor);
            console.log(name);
            console.log(energy);
            console.log(protein);
            console.log(lipid);
            console.log(carbohydrate);
            console.log(sodium);

            if (window.confirm(
              vendor + " " + name +
                " :本当に更新しますか？ Really update this?")){

              updateFoodDB(target_id,
                           name,
                           vendor,
                           energy,
                           protein,
                           lipid,
                           carbohydrate,
                           sodium);
              alert("更新しました． Updated.");
            } else {
              alert("キャンセルしました． Canceled.");
            }
          }
        });  // click
      }
      datastore.recordsChanged.addListener(readFoodDB);
      readFoodDB();

    });  // openDefaultDatastore
  }  // authCallback
});
