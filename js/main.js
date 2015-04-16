var client = new Dropbox.Client({key: "efvlr1x3fmx1l7v"});

// Try to finish OAuth authorization.
client.authenticate({interactive: false}, function (error) {
    if (error) {
        alert('Authentication error: ' + error);
        $('#auth').text('Authentication error: ' + error);
    }
});

alert(client.isAuthenticated());
if (client.isAuthenticated()) {
    $('#auth').text('auth...');
    alert('auth...');
    client.getAccountInfo(
        {},
        function (err, info, obj) {
            alert('callback');
            $('#auth').text('Hello ' + info.name);
        });
}
