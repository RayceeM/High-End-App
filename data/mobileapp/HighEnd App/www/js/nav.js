window.fn = {};

window.fn.open = function() {
    var menu = document.getElementById('_menu');
    menu.open();
};

window.fn.load = function(page, data) {
    var content = document.getElementById('_navigator');
    var menu = document.getElementById('_menu');
    content.pushPage(page, data)
        .then(menu.close.bind(menu));
};
var inAppBrowserRef = undefined;
var openHotelList = function() {
    var content = document.getElementById('_navigator');
    var menu = document.getElementById('_menu');
    content.pushPage('popular.html')
        .then(menu.close.bind(menu));
    GetHotels();
}

var openPayment = function() {
    var content = document.getElementById('_navigator');
    var menu = document.getElementById('_menu');
    content.pushPage('payments.html')
        .then(menu.close.bind(menu));
    GetPaymentDetails();
}

var openMaps = function(url) {

    var content = document.getElementById('_navigator');
    var menu = document.getElementById('_menu');
    content.pushPage('maps.html')
        .then(menu.close.bind(menu));
}







var openAboutPage = function() {
    var content = document.getElementById('_navigator');
    var menu = document.getElementById('_menu');
    content.pushPage('about.html')
        .then(menu.close.bind(menu));

}
window.fn.pop = function() {
    var content = document.getElementById('_navigator');
    content.popPage();
};

document.addEventListener('init', function(event) {
    var page = event.target;

    if (page.id === 'login-page') {
        var user_name = page.querySelector('#l_username').value;
        var pa_ss = page.querySelector('#l_pass').value;
        page.querySelector('#passwordRecover').onclick = function() {
            var user_name = page.querySelector('#l_username').value;
            if (user_name == "") {
                ons.notification.toast('Username can not be blank', { animation: 'fade', timeout: 1200 });
            } else {

                var promise = Kinvey.User.resetPassword(user_name);
                promise = promise.then(function onSuccess() {
                    // ...
                    ons.notification.toast('Hey, ' + user_name + ' check your email for password recovery', { animation: 'fade', timeout: 1200 });

                }).catch(function onError(error) {
                    // ...
                    page.querySelector('#errorP').innerHTML = error.message;
                });
            }


        };
        page.querySelector('#login-button').onclick = function() {

            var loginModal = page.querySelector('#log-in-modal');
            loginModal.show();
            setTimeout(function() {
                loginModal.hide();
                page.querySelector('#errorP').innerHTML = "Something went wrong...\nTry again later.";
            }, 3000);
            var user = new Kinvey.User();
            //TO DO Add Is Email Verified
            if (user.user.isEmailVerified()) {
                var promise = Kinvey.User.login({
                    username: user_name,
                    password: pa_ss
                }).then(function onSuccess(user) {
                    //Attempyt to fix a Bug!!!
                    ons.ready(function() {
                        document.querySelector('#_navigator')
                            .pushPage('menu-page.html')
                            .then(function() {
                                console.log("Menu Page Loaded");
                                GetFoodData();
                            });
                    });


                }).catch(function onError(error) {
                    // ...
                    loginModal.hide();
                    ons.notification.toast(error.message, { animation: 'fade', timeout: 1200 });
                    page.querySelector('#errorP').innerHTML = error.message;
                    //console.log(error.message);
                });
            } else {
                ons.notification.toast('You need to verify your email', { timeout: 1500 });
            }

            // document.querySelector('#_navigator').pushPage('#menu-page.html');
        };

    } else if (page.id === 'about.html' || page.id === 'payments' ||
        page.id === 'maps.html' || page.id === 'popular.html') {
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    } else if (page.id === 'orderPage') {
        Kinvey.initialize({
            appKey: 'kid_HyLcxWeGZ',
            appSecret: 'c747fc75e2db4e50b26d8ef5a782c4f6'
        }).then(function(activeUser) {
            // ...
            var listO = $('#orderList');
            var u_ = activeUser.username;

            var dataStore = Kinvey.DataStore.collection('orders');
            var query = new Kinvey.Query();
            query.equalTo('user', u_);
            var stream = dataStore.find(query);
            stream.subscribe(function onNext(entities) {
                // ...


                for (var index = 0; index < entities.length; index++) {
                    var datacontent_ = '<ons-list-item tappable ><div class="center">' +
                        '<span class="list-item__title" >' +
                        '' + entities[index].fooditem + '' +
                        '</span>' +
                        '</div>' +
                        '<div class="right">' +
                        '<span id="_price" class="list-item__subtitle">' +
                        'Ksh.' + entities[index].amount +
                        '</span>' +
                        '</div>' +
                        '</ons-list-item>';
                    //console.log(entities);
                    listO.append(datacontent_);
                }

            }, function onError(error) {
                // ...
                console.log(error);

            }, function onComplete() {
                // ...
                console.log("Done");

            });

        }).catch(function(error) {
            ons.notification.toast("Shoot! We are sorry try again later.", { timeout: 1800, animation: "ease-in" });
            document.querySelector('#_navigator')
                .popPage()
        });
    } else if (page.id === 'about') {
        page.querySelector('#abtSignout').onclick = function() {
            Logout();
        }
    } else if (page.id === 'sign-up-page') {
        page.querySelector('#sign-up-button').onclick = function() {
            /* Define the data we'll we storing in our backend
             */
            var signupModal = page.querySelector('#sign-up-modal');
            signupModal.show();
            console.log('Attempting Login');
            //Create a new _user_ instance
            var user = new Kinvey.User();

            //define custom properties we'll be saving to out DB
            user.data.customProp = 'first_name';
            user.data.customProp = 'last_name';
            user.data.customProp = 'email';
            //user.data.customProp = 'password' this is entered by default and username
            user.data.customProp = 'phone';

            //Declare varibles ...You could use jQuery but Jquery tends to misbehave at times...Stay safe!!!
            var fname = page.querySelector('#_fname');
            var lname = page.querySelector('#_lname');
            var username_ = page.querySelector('#_username');
            var email = page.querySelector('#_email');
            var passU = page.querySelector('#pass_');
            var passC = page.querySelector('#_pass');
            var phone = page.querySelector('#_phone');
            var error_ = page.querySelector('#_error');

            //Pass RegEx --basically have at least 1 lower case letter ,an Uppper case letter,
            //a number,and a symbol and not less than 6 chars
            var regExP = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
            //Test password input field
            var passTest = regExP.test(passU.value); //This is a boolean

            //Email RegEx
            var regExE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var regExETest = regExE.test(email.value); //Another boolean

            //Ensure No field is left null
            if (fname.value == "" || username_.value == "" || lname.value == "" || email.value == "" || passC.value == "" || passU.value == "" || phone.value == "") {
                error_.innerHTML = "Some fields were left blank";

                setTimeout(function() {
                    signupModal.hide();
                }, 2000);
            }
            //Ensure both Password fields are at least 6 Characters in lenght 
            else if (passC.length < 6 && passU.length < 6) {
                setTimeout(function() {
                    signupModal.hide();
                }, 2000);
                error_.innerHTML = "Your password should be at least 6 characters in length";
            }
            //Check if the password fields match
            else if (passC.value != passU.value) {
                setTimeout(function() {
                    signupModal.hide();
                }, 2000);
                error_.innerHTML = "It seems your passwords don't match";
            }
            //Auth Password using Password RegEx
            else if (!passTest) {
                setTimeout(function() {
                    signupModal.hide();
                }, 2000);
                error_.innerHTML = "Password must have at least an upper case letter,1 lower case letter,a number and a special character";
            } else if (!regExETest) {
                if (email.value == "") {
                    error_.innerHTML = "An email address is required";
                } else {

                    error_.innerHTML = email.value + " is an invalid email address";
                }
                setTimeout(function() {
                    signupModal.hide();
                }, 2000);
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
                    signupModal.hide();
                    this.Reset();
                    // console.log(user.username);
                    // ons.notification.toast("Welcome " + user.username, { animation: "fade", timeout: 500 });
                    ons.notification.toast("Hey " + user.username + " , Kindly Verify your Email", { animation: "fade", timeout: 500 });
                    //Clear the form....Move the user to login page or something
                    //Forgot to add main page navigation....Let me do that...

                    // GoToMainPage();


                }).catch(function onError(error) {
                    signupModal.hide();
                    ons.notification.alert("Whoops there was an error: " + error);
                    console.log(error);
                });

            }

        }
    } else if (page.id === 'home-page') {

        // var p = page.querySelector('ons-progress-bar');
        // p.hide();
        page.querySelector('#feedBackFab').onclick = function() {
            document.querySelector('#_navigator')
                .pushPage('feedback.html')
                .then(function() {
                    console.log("Feedback Page Loaded");

                });
        };
        //Pull to refresh

        var returnList = $('#dataList');
        var pullHook = document.getElementById('pull-hook');

        pullHook.addEventListener('changestate', function(event) {
            var message = '';

            switch (event.state) {
                case 'initial':
                    message = 'Pull to refresh';
                    break;
                case 'preaction':
                    message = 'Release';
                    break;
                case 'action':
                    message = 'Loading...';

                    $('.returnData').remove(); //Cleans the entire DOM then...Loads data
                    GetFoodData();
                    // p.hide();
                    break;
            }

            pullHook.innerHTML = message;
        });

        pullHook.onAction = function(done) {
            setTimeout(done, 3000);
            //console.log(returnList.length);
        };
        //End Pull to Refresh

        $('.returnData').remove(); //Cleans the entire DOM then...Loads data
        GetFoodData();
        // GetFoodData();


    } else if (page.id === 'maps-page') {
        //TO DO Resolve App.JS dependency


    } else if (page.id === 'feedbackPage') {
        page.querySelector('#fbBtn').disabled = true;
        var fbModal = page.querySelector('#post-feedback-modal');

        Kinvey.initialize({
            appKey: 'kid_HyLcxWeGZ',
            appSecret: 'c747fc75e2db4e50b26d8ef5a782c4f6'
        }).then(function(activeUser) {
            // ...
            page.querySelector('#fbBtn').disabled = false;
            var u_ = activeUser.username;
            var _u = u_.toLowerCase();
            page.querySelector('#_fusername').innerHTML = u_;
            page.querySelector('#_fUsername_').innerHTML = "@" + _u;


        }).catch(function(error) {
            ons.notification.toast("We're having problems.Try again later.", { timeout: 1800, animation: "ease-in" });
            document.querySelector('#_navigator')
                .popPage();
        });
        page.querySelector('#fbBtn').onclick = function() {
            //   if (topic_ != '' || msg_ != '') {
            fbModal.show();
            Kinvey.initialize({
                appKey: 'kid_HyLcxWeGZ',
                appSecret: 'c747fc75e2db4e50b26d8ef5a782c4f6'
            }).then(function(activeUser) {
                // ...
                var topic_ = page.querySelector('#fbTopic').value;
                var msg_ = page.querySelector('#fbMsg').value;
                if (topic_ != '' || msg_ != '') {
                    var dataStore = Kinvey.DataStore.collection('feedback');
                    var promise = dataStore.save({
                        topic: topic_,
                        message: msg_,
                        user: activeUser.username
                    }).then(function onSuccess(entity) {
                        // ...
                        document.querySelector('#_navigator')
                            .popPage()
                            .then(function() {
                                ons.notification.toast("Your Feedback has been Received", { animation: "fade", timeout: 1800 });
                            });
                        console.log("Rant sent");
                        return this.defaultValue;
                        fbModal.hide();
                    }).catch(function onError(error) {
                        // ...
                        fbModal.hide();
                        ons.notification.toast('We encountered a problem on out end', { animation: 'ease-in', timeout: 800 });
                        console.log("Rant not sent");
                    });
                }
                fbModal.hide();
            }).catch(function(error) {
                // ...
                ons.notification.toast("There was an Error: " + error, { animation: "ease-in", timeout: 1800 });
            })

            //}
        };

    } else if (page.id === 'hotelsPage') {} else if (page.id === 'hotelsview') {

        document.querySelector('#toFbPageBtn').onclick = function() {
            document.querySelector('#_navigator').pushPage('feedback.html').then(function() {
                console.log('Taking you to Feedback Page');
            });
        };

        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        var d = page.data.title;

        var indMenu = $('#indMenu');
        document.querySelector('#_cardname').innerHTML = d;
        var inHotelData = Kinvey.DataStore.collection('foodmenu');
        var query = new Kinvey.Query();
        query.equalTo('Hotel', d);
        var stream = inHotelData.find(query);
        stream.subscribe(function onNext(entities) {
            // ...


            for (var index = 0; index < entities.length; index++) {
                var content_ = '<ons-list-item tappable ><div class="center">' +
                    '<span class="list-item__title" >' +
                    '' + entities[index].FoodItem + '' +
                    '</span>' +
                    '</div>' +
                    '<div class="right">' +
                    '<span id="_price" class="list-item__subtitle">' +
                    '' + entities[index].Price +
                    '</span>' +
                    '</div>' +
                    '</ons-list-item>';
                //console.log(entities);
                indMenu.append(content_);
            }

        }, function onError(error) {
            // ...
            console.log(error);

        }, function onComplete() {
            // ...
            console.log("Done");

        });
    } else if (page.id === 'searchPage') {

    }
});

var GoToMainPage = function() {
    document.querySelector('#_navigator')
        .pushPage('menu-page.html')
        .then(function() {
            console.log("Menu Page Loaded");
            GetFoodData();
        });
}
var ExitFunc = function() {
    document.querySelector('#_navigator').popPage();
}