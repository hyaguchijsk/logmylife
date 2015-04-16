var client = new Dropbox.Client({key: "efvlr1x3fmx1l7v"});

// Try to finish OAuth authorization.
client.authenticate({interactive: false}, function (error) {
    if (error) {
        $('#auth').text('Authentication error: ' + error);
    }
});

if (client.isAuthenticated()) {
    client.getAccountInfo(
        {},
        function (api, info, err) {
            $('#auth').text('Hello ' + info.name);
        });
}
