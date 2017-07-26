/*
We'll perform validations,some regex and page animations(if we we can)
*/

//Move all JS Logic back here

//Handle Login Button Click

// Page init event
document.addEventListener('init', function(event) {
    var page = event.target;

    if (page.matches('#login-page')) {

        page.querySelector('#login-button').onclick = function() {
            Login();
            GetHotelData();
        };

    } else if (page.matches('#home.html' || '#payments.html' || '#maps.html' || '#popular.html' || '#about.html')) {
        page.querySelector('ons-back-button').onClick = function() {

            document.querySelector('#navigator').popPage();
        }
    }
});

var Back = function() {
    document.querySelector('#navigator')
        .pushPage('menu-page.html')
        .then(function() {
            console.log("Sucess")
        });

}

var Login = function() {

    var username = document.getElementById('l_username').value;
    var pass = document.getElementById('l_pass').value;

    if (username == " " || pass == " ") {
        return;
    }

    var promise = Kinvey.User.login({
        username: username,
        password: pass
    }).then(function onSuccess(user) {

        document.querySelector('#navigator').pushPage('menu-page.html');
        console.log("Logged in");
    }).catch(function onError(error) {
        ons.notification.toast("Wooops...We could not log you in", { modifier: "material", timeout: 2000 });
        console.log(error);
        //Reset();
    });
}

//Get Hotel Data

var GetHotelData = function() {
        var hotelList = Kinvey.DataStore.collection('foodmenu');
         var query = new Kinvey.Query();
         query.fields = ['Price'];
         var stream = hotelList.find(query);
        //var stream = hotelList.find();
        stream.subscribe(function onNext(entities) {
            console.log(entities);
            console.log(entities.length);
            var len = entities.length += 1;
            console.log("Len :" + len);
            console.log(entities[0].Hotel);
            var list_ = document.querySelector('#hotelList');
           /* for (var i = 0; i <= len; i++) {
                var a =
                    '<ons-list-item modifier="material short-divider">' +
                    '<ons-ripple color="rgba(0, 0, 0, 0.1)"></ons-ripple>' +
                    '<div class="left">' +
                    '<ons-icon icon="md-phone" class="list__item__icon"></ons-icon>' +
                    '</div>' +
                    '<div class="center">' +
                    '<span class="list__item__title">' +
                    entities[i].artist + ' ' +
                    '</span>' +
                    '<span class="right">' +
                    entities[i].title + ' ' +
                    '</span>' +
                    '</div>' +
                    '</ons-list-item>';
                list_.innerHTML += a;
                console.log(i + ' ' + entities[i].artist);

            }
            */

        }, function onError(error) {
            // ...
            console.log(error);
        }, function onComplete() {
            // ...
            console.log("Done!");
        });
    }

    //Handle Registration Logic

var Register = function() {
    /* Define the data we'll we storing in our backend
     */
    //Create a new _user_ instance
    var user = new Kinvey.User();

    //define custom properties we'll be saving to out DB
    user.data.customProp = 'first_name';
    user.data.customProp = 'last_name';
    user.data.customProp = 'email';
    //user.data.customProp = 'password' this is entered by default and username
    user.data.customProp = 'phone';

    //Declare varibles ...You could use jQuery but Jquery tends to misbehave at times...Stay safe!!!
    var fname = document.getElementById('_fname');
    var lname = document.getElementById('_lname');
    var username_ = document.getElementById('_username');
    var email = document.getElementById('_email');
    var passU = document.getElementById('pass_');
    var passC = document.getElementById('_pass');
    var phone = document.getElementById('_phone');
    var error_ = document.getElementById('_error');

    //Pass RegEx --basically have at least 1 lower case letter ,an Uppper case letter,
    //a number,and a symbol and not less than 6 chars
    var regExP = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
    //Test password input field
    var passTest = regExP.test(passU.value); //This is a boolean

    //Email RegEx
    var regExE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regExETest = regExE.test(email.value); //Another boolean

    //Ensure No field is left null
    if (fname.value == " " && username.value == " " && lname.value == " " && email.value == " " && passC.value == " " && passU.value == " " && phone.value == " ") {
        error_.innerHTML = "Some fields were left blank";
    }
    //Ensure both Password fields are at least 6 Characters in lenght 
    else if (passC.length < 6 && passU.length < 6) {
        error_.innerHTML = "Your password should be at least 6 characters in length";
    }
    //Check if the password fields match
    else if (passC.value != passU.value) {
        error_.innerHTML = "It seems your passwords don't match";
    }
    //Auth Password using Password RegEx
    else if (!passTest) {
        error_.innerHTML = "Password must have at least an upper case letter,1 lower case letter,a number and a special character";
    } else if (!regExETest) {
        if (email.value == "") {
            error_.innerHTML = "An email address is required";
        } else {

            error_.innerHTML = email.value + " is an invalid email address";
        }
    } else {

        //Create a promise which we'll resolve when during the registration process
        var promise = user.signup({
            username: username_.value,
            password: passU.value,
            first_name: fname.value,
            last_name: lname.value,
            phone: phone.value,
            email: email.value

        }).then(function onSuccess(user) {

            console.log(user);
            ons.notification.alert("Welcome " + username.value);
            //Clear the form....Move the user to login page or something
            //Forgot to add main page navigation....Let me do that...
            this.Reset();
            document.querySelector('#navigator')
                .pushPage('menu-page.html')
                .then(function() {
                    console.log("Menu Page Loaded");
                });
        }).catch(function onError(error) {
            ons.notification.alert("Whoops there was an error: " + error);
        });

    }


}

//Navigate across the user page


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
        Reset();
        console.log("All Users Logged Out");
    }).catch(function onError(error) {
        ons.notification.alert("Yikes", {
            modifier: "material"
        });
    });

    ons.notification.toast("All Users Logged out!", { modifier: "material", timeout: 2000 });
    ons.ready(function() {
        console.log("Logged Out and Initialized");
    })
    document.querySelector('#navigator')
        .pushPage('login-page.html')
        .then(function() {
            console.log("Logged out!")
        });
}