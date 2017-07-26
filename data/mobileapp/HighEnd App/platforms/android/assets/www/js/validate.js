var GetPaymentDetails = function() {
    console.log("Paying..");


}
var Logout = function() {
    var promise = Kinvey.User.logout();
    promsie = promise.then(function onSuccess() {
        Reset();
        // console.log("All Users Logged Out");

        ons.notification.toast("All Users Logged out!", { modifier: "material", timeout: 2000 });
        document.querySelector('#_navigator').pushPage('login-page.html');
    }).catch(function onError(error) {
        ons.notification.alert("Yikes,We could not Log you out", {
            modifier: "material"
        });
    });

    // ons.notification.toast("All Users Logged out!", { modifier: "material", timeout: 2000 });
    ons.ready(function() {
        console.log("Logged Out and Initialized");
    });
}
var ReceiveOrder = function() {

    ons.openActionSheet({
        title: 'Receive Order',
        cancelable: true,
        buttons: [

            {
                label: ' Confirm'

            },
            {
                label: 'Cancel',
                icon: 'md-close',
                modifier: 'destructive'
            }
        ]
    }).then(function(index) {
        switch (index) {
            case 0:
                var waitFab = document.querySelector('#waitFab');
                var foodFab = document.querySelector('#foodFab');

                console.log('Order Confirmed');
                waitFab.disabled = true;
                foodFab.innerHTML = "+";
                foodFab.disabled = false;
                ons.notification.toast('Enjoy your meal', { timeout: 1200 });
                document.getElementsByTagName('ons-checkbox').checked = false;
                break;
            case 1:
                console.log('Canceled');
                waitFab.disabled = true;
                break;
            default:
                break;
        }
        console.log('index: ', index)
    })
}

var ShowStuff = function() {
    //ons.notification.toast("Nice", { timeout: 2500 });
    ons.openActionSheet({
        title: 'New Order',
        cancelable: true,
        buttons: [

            {
                label: ' Submit'

            },
            {
                label: 'Cancel',
                icon: 'md-close',
                modifier: 'destructive'
            }
        ]
    }).then(function(index) {
        switch (index) {
            case 0:
                console.log('Submit');

                var waitFab = document.querySelector('#waitFab');
                var foodFab = document.querySelector('#foodFab');
                ons.notification.prompt({
                    message: 'Enter the MPESA Code',
                    id: 'data',
                    title: "MPESA Code",

                    placeholder: 'ABC1D23EG4',
                    callback: function(code_) {
                        var dataStore = Kinvey.DataStore.collection('mpesa');
                        //console.log(code_);
                        var query = new Kinvey.Query();
                        query.equalTo('mpesacode', code_);
                        var stream = dataStore.find(query);
                        stream.subscribe(function onNext(entities) {
                            // ...
                            //console.log('success');
                            console.log(entities);
                            if (entities.length == 0 || entities.length == null) {
                                // return false;
                                waitFab.disabled = true;
                                foodFab.disabled = false;
                                ons.notification.toast("We could not verify your transaction", { timeout: 800 });
                            } else {
                                waitFab.disabled = false;
                                foodFab.disabled = true;
                                ons.notification.toast('Submitting your Order', { timeout: 1200 });
                            }
                        }, function onError(error) {
                            // ...
                            console.log('error');
                        }, function onComplete() {
                            // ...
                            console.log('Done');
                        });

                    }
                });
                // waitFab.disabled = false;
                // foodFab.disabled = true;
                // var payModal_ = document.getElementById('payModal');
                // payModal_.show();
                // ons.notification.toast('Submitting your Order', { timeout: 1200 });
                break;
            case 1:
                console.log('Cancel');
                var waitFab = document.querySelector('#waitFab');
                waitFab.disabled = true;
                break;

            default:
                break;
        }
        console.log('index: ', index)
    })
}
var GetHotelMaps = function() {

    console.log("Mapping....");

}


//Promises
//TO DO
//Get Hotel Data

var GetHotels = function() {
    var deferred = $.Deferred();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://baas.kinvey.com/appdata/kid_HyLcxWeGZ/hotels",
        "method": "GET",
        "headers": {
            "authorization": "Basic a2lkX0h5TGN4V2VHWjo2ODkyMjMyZDQwOWE0NDBmODVmODhjMjFhMGExMWU1ZA==",
            "content-type": "application/json",
        }
    }

    $.ajax(settings).done(function(response) {
        //console.log(response);
        //We're Parsing JSON Objects
        var hotels = $('#hotelDataList'); //var hotel = document.getElementById('hotelDataList');

        for (var index = 0; index < response.length; index++) {
            var element = response[index];
            // var ele = response[index].HotelName;
            // console.log(ele);
            var hotelData = '<ons-list-item  tappable >' + '<div class="center">' +
                '<span onclick="showDetails(this)" id="_title" class="list-item__title">' +
                '' + response[index].name +
                '</span>' +
                '<span class="list-item__subtitle">' +
                '' + 'Capacity ' +
                '</span>' +
                '</div>' +
                '<div class="right">' +
                '<span class="list-item__title">' +
                '' + response[index].capacity +
                '</span>' +
                '</div>' +
                '</ons-list-item>';
            hotels.append(hotelData);
            // document.querySelector('#foodFab').innerHTML = '<ons-icon icon="md-plus"></ons-icon>';
        }
        return deferred.promise(); //Return a promise with this call
    });
}

function showDetails(hotels) {
    //var hotelName = hotels.getAttribute('data-val');
    var hotelName = hotels.innerHTML; //Get span Value for Inner HTML
    //console.log(hotelName);
    document.querySelector('#_navigator').pushPage('hotelsview.html', { data: { title: hotelName } });


}
var totalThis = function(price) {
        var deferred = $.Deferred();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://baas.kinvey.com/appdata/kid_HyLcxWeGZ/foodmenu",
            "method": "GET",
            "headers": {
                "authorization": "Basic a2lkX0h5TGN4V2VHWjo2ODkyMjMyZDQwOWE0NDBmODVmODhjMjFhMGExMWU1ZA==",
                "content-type": "application/json"
            }
        }
        $.ajax(settings).done(function(response) {
            var sum = 0;
            var itPrice = parseInt(price.getAttribute('value'));
            //itPrice = '';


            if (price.checked == true) {

                //console.log('itPrice : ' + (sum += itPrice));
                sum += itPrice;

                console.log('Sum: ' + sum);
            }


            // console.log(response.length);
            document.querySelector('#foodFab').innerHTML = sum;

        });


    }
    //Get Food Items list
var GetFoodData = function() {
        var deferred = $.Deferred();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://baas.kinvey.com/appdata/kid_HyLcxWeGZ/foodmenu",
            "method": "GET",
            "headers": {
                "authorization": "Basic a2lkX0h5TGN4V2VHWjo2ODkyMjMyZDQwOWE0NDBmODVmODhjMjFhMGExMWU1ZA==",
                "content-type": "application/json"
            }
        }

        $.ajax(settings).done(function(response) {
            // console.log(response);

            var dataList = $('#dataList');
            for (var index = 0; index < response.length; index++) {
                var element = response[index];
                // console.log(element.Price);

                var rawData = '<ons-list-item tappable ><div class="center">' +
                    '<span class="list-item__title">' +
                    '' + response[index].Hotel +
                    '</span>' +
                    '<span class="list-item__subtitle" ><ons-checkbox value =' + response[index].Price + ' onchange="totalThis(this)">' +
                    '' + response[index].FoodItem + '' +
                    '</span></ons-checkbox>' +
                    '</div>' +
                    '<div class="right">' +
                    '<span id="_price" class="list-item__title">' +
                    '' + response[index].Price +
                    '</span>' +
                    '</div>' +
                    '</ons-list-item>';
                dataList.append(rawData);

            }
            return deferred.promise(); //Return a promise with this call

        });

    }
    //Handle Registration Logic

var goToMainPage = function() {
    ons.notification.toast('Hold on...', { animation: 'default', timeout: 1800 });
    document.querySelector('#_navigator').popPage();
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

//Payment Modal

var showPayMentModal = function() {

}

//When Headers are tapped: