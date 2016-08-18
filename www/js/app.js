function initMap(latitude, longtitude) {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: latitude, lng: longtitude},
        zoom: 10,
    });
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longtitude},
        map: map,
        title: 'me'
    });
    return map
};

function setMarkers(map, data){
    for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var marker = new google.maps.Marker({
            position: {lat:obj['lat'], lng:obj['lng']},
            icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            map: map,
            title: obj['user']
          });
    };
};


function onSuccess(position) {
    var user = 'galecore';
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    
    var xhr = new XMLHttpRequest();
    
    var body = 'user=' + encodeURIComponent(user) + '&lat=' + encodeURIComponent(lat) + '&lng=' + encodeURIComponent(lng);
    xhr.open("POST", 'http://192.168.1.39/', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.responseType = 'json';
    xhr.send(body);
    xhr.onload = function() {
        var status = xhr.status;
            if (status == 200) {
                map = initMap(lat, lng);
                setMarkers(map, xhr.response)
            } else {
                alert('An error occured during sending of coordinates, error code ' + status);
            }

        };

};

function onError(error) {
    alert("the code is " + error.code + ". \n" + "message: " + error.message);
};


function onAppReady() {
    if (navigator.splashscreen && navigator.splashscreen.hide) {   
        navigator.splashscreen.hide();
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    };

function onPause() {
    var user = 'galecore';    
    var xhr = new XMLHttpRequest();
    var body = 'user=' + encodeURIComponent(user);
    xhr.open("POST", 'http://192.168.1.39/nulify', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(body);
    navigator.app.exitApp();
};  

document.addEventListener("app.Ready", onAppReady, false);
document.addEventListener("pause", onPause, false);
