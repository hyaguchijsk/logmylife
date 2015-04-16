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


});

