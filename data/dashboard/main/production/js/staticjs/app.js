$("#foodItemForm").submit(function(e) {
    e.preventDefault();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://baas.kinvey.com/appdata/kid_HyLcxWeGZ/foodmenu",
        "method": "POST",
        "headers": {
            "authorization": "Basic a2lkX0h5TGN4V2VHWjo2ODkyMjMyZDQwOWE0NDBmODVmODhjMjFhMGExMWU1ZA==",
            "content-type": "application/json"
        },
        "processData": false,
        "data": $(this).serialize()
    }

    $.ajax(settings).done(function(response) {
        console.log(response);
    });

    // // avoid to execute the actual submit of the form.
    console.log('I have been clicked');
});