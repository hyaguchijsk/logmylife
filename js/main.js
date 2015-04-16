var client = new Dropbox.Client({key: "efvlr1x3fmx1l7v"});

// Try to finish OAuth authorization.
client.authenticate({interactive: false}, function (error) {
    if (error) {
        $('#auth').text('Authentication error: ' + error);
    }
});

// if can not login, try to login
if (client.isAuthenticated()) {
    client.authenticate();
}

// authenticated?
if (client.isAuthenticated()) {
    client.getAccountInfo(
        {},
        function (err, info, obj) {
            $('#auth').text('Hello ' + info.name);
        });
} else {
    $('#auth').text('Authetication failed.');
}
