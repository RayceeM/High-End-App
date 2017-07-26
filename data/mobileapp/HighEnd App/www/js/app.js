var Back = function() {
    document.querySelector('#_navigator')
        .pushPage('menu-page.html')
        .then(function() {
            console.log("Sucess")
        });

}


var Reset = function() {
    var elements = document.getElementsByTagName("ons-input");
    for (var ii = 0; ii < elements.length; ii++) {
        if (elements[ii].type == "text" || elements[ii].type == "tel" || elements[ii].type == "password" || elements[ii].type == "email") {
            elements[ii].value = "";
            document.getElementById('_error').value = "";
        }
    }
}

var Logout = function() {
    //Logout all Active Users
    var promise = Kinvey.User.logout();
    promsie = promise.then(function onSuccess() {
        //Reset();
        console.log("All Users Logged Out");
    }).catch(function onError(error) {
        ons.notification.alert("Yikes", {
            modifier: "material"
        });
    });

    ons.notification.toast("Logging you out!", { modifier: "material", timeout: 2000 });
    ons.ready(function() {
        console.log("Logged Out and Initialized");
    });
    document.querySelector('#_navigator')
        .pushPage('login-page.html')
        .then(function() {
            console.log("Logged out!")
        });
}