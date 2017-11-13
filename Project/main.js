
$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('#modalPresent').modal();
});


$('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            console.log(modal, trigger , "open");
        },
        complete: function() { console.log("close") } // Callback for Modal close
    }
);

/*================== LOGIC OF THE PROGRAM ==========================*/

var PlacesArray = [];
var icon = "icon.png";
var LatLngArray = [];
var ArrayofArrays = [];
var nElements;
var DistancesMatrix;
var service = new google.maps.DistanceMatrixService();
var blocked = false;
/*var btnStep = document.getElementById('btnStep');
var btnDistance = document.getElementById('btnDistances');
var btnOpt = document.getElementById('btnOptimize');
btnStep.disabled = true;
btnOpt.disabled = true;*/

function Place(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
}

function BuildArrayofArrays() {

    ArrayofArrays = [];

    nElements = PlacesArray.length/10;
    var nEntero = parseInt(nElements.toFixed());
    //console.log(nEntero);

    if (nElements - nEntero > 0){
        nElements = nEntero+1;
    }
    else{
        nElements = nEntero;
    }

    //console.log('cant='+ nElements);

    var n = PlacesArray.length;
    var limit = 0;

    for(var i = 0; i < nElements; ++i){

        if(n-10 > 0){
            limit = 10;
            n-=10;
        }
        else{
            limit = n;
        }
        //console.log('lim='+limite);
        for(var j = 0; j < limit; ++j){
            LatLngArray.push(new google.maps.LatLng(PlacesArray[j+(10*i)].latitude,PlacesArray[j+(10*i)].longitude));
        }
        ArrayofArrays.push(LatLngArray);
        LatLngArray = [];
    }
    //console.log(ArrayofArrays);
}

var map = new GMaps({
    el: '#map',
    lat: -12.043333,
    lng: -77.028333,
    zoom: 12,

    click: function(e) {

        if(blocked === false) {

            var latitude = e.latLng.lat();
            var longitude = e.latLng.lng();
            map.addMarker({
                lat: latitude,
                lng: longitude,
                title: 'Spot ' + PlacesArray.length,
                icon: icon,
                infoWindow: {
                    content: 'Point ' + PlacesArray.length
                }
            });
            PlacesArray.push(new Place(latitude, longitude));
            var pos = PlacesArray.length - 2;

            if (PlacesArray.length >= 2) {
                map.drawRoute({
                    origin: [PlacesArray[pos].latitude, PlacesArray[pos].longitude],
                    destination: [PlacesArray[pos + 1].latitude, PlacesArray[pos + 1].longitude],
                    travelMode: 'driving',
                    strokeColor: '#131540',
                    strokeOpacity: 0.6,
                    strokeWeight: 6
                });
            }

            var TextRoute = document.getElementById('OriginalRoute');
            if (TextRoute.innerHTML !== "Route: ") {
                TextRoute.innerHTML += " - ";
            }
            TextRoute.innerHTML += PlacesArray.length - 1;
        }
    }
});

/**function Distance() {  //Calculates the shortest distance
    if (PlacesArray.length >= 2) {

        var DistanceMatrix = new Array(PlacesArray.length);

        for(var i = 0; i<PlacesArray.length; ++i){

            DistanceMatrix[i] = new Array(PlacesArray.length)
        }

       for(i = 0; i<PlacesArray.length; ++i){
            for(var j = 0; j<PlacesArray.length; ++j){

                Origin = new google.maps.LatLng(PlacesArray[i].latitude, PlacesArray[i].longitude);
                Destination = new google.maps.LatLng(PlacesArray[j].latitude, PlacesArray[j].longitude);
                var DistanceCal = google.maps.geometry.spherical.computeDistanceBetween(Origin, Destination);

                DistanceMatrix[i][j] = DistanceCal/1000;
            }
        }
        console.log(DistanceMatrix);
    }
}**/

function Restart(){
    blocked = false;
    $("#button-matrix").removeClass("disabled");
    $("#button-optimize").addClass("disabled");
    $("#button-restart").addClass("disabled");
    map.removeMarkers();
    map.removePolylines();
    DistancesMatrix = null;
    PlacesArray = [];
    LatLngArray = [];
    ArrayofArrays = [];
    nElements = 0;
    var TextRoute = document.getElementById('OriginalRoute');
    TextRoute.innerHTML = "Route: ";
    var NewRoute = document.getElementById('NewRoute');
    NewRoute.innerHTML = "New route: ";
    Materialize.toast('Everything restarted!', 4000);
}

function Distance() {

    if (PlacesArray.length >= 2) {

        DistancesMatrix = new Array(PlacesArray.length);
        for(var i = 0; i<PlacesArray.length; ++i){
            DistancesMatrix[i] = new Array(PlacesArray.length);
        }
        Materialize.toast('Matrix generated', 3000);
        BuildArrayofArrays();
        $("#button-matrix").addClass("disabled");
        $("#button-distance").removeClass("disabled");
        blocked = true;
        //btnDistance.disabled = true;
        //btnStep.disabled = false;
    }
    //console.log(DistancesMatrix);
}

var w=0;
var r=0;

function Step(){

    console.log(w+'  '+r);
    CalDistances(w,r);

    if(r === nElements-1) {
        if (w !== nElements-1) {
            w++;
            r = 0;
        }
        else{
            $("#button-distance").addClass("disabled");
            $("#button-optimize").removeClass("disabled");
            Materialize.toast('Distances Calculated!', 4000);
            //console.log("distance calculkadas");
            //btnStep.disabled =true;
            //btnStep.innerHTML = "Distances calculated!";
            //btnOpt.disabled = false;
            console.log(DistancesMatrix);
            return;
        }
    }
    else{r++;}

    //console.log("Calculating...");
    Materialize.toast('Calculating ... ', 4000);
    //btnStep.disabled =true;
    $("#button-distance").addClass("disabled");
    setTimeout(function(){
        $("#button-distance").removeClass("disabled");
        //btnStep.disabled = false;
        console.log("Calculate distances");
        },4000);
}

function CalDistances(k,l){

    service.getDistanceMatrix(
        {
            origins: ArrayofArrays[k],
            destinations: ArrayofArrays[l],
            travelMode: 'DRIVING'
        }, function callback(response, status) {
            if (status === 'OK') {
                var origins = response.originAddresses;

                for (var i = 0; i < origins.length; i++) {

                    var results = response.rows[i].elements;

                    for (var j = 0; j < results.length; j++) {

                        var element = results[j];
                        var dist = element.distance.value;
                       DistancesMatrix[i+(10*k)][j+(10*l)]=dist;
                        //console.log((i+(10*k)) + '_' +(j+(10*l)));
                    }
                }
            }
        });
}

function GetMayor(array){

    var num =0;

    for (var i = 0; i < array.length; ++i){
        if(array[i] > num){
            num = array[i];
        }
    }

    return num;
}

function OptimizeRoute(){

    var pos = 0;
    var aux = 0;
    var Route = new Array();
    Route.push(0);
    var minnum;
    var NewRoute = document.getElementById('NewRoute');
    NewRoute.innerHTML += 0;

    map.cleanRoute();

    for(var i = 0; i<PlacesArray.length-1; i++){

        minnum = GetMayor(DistancesMatrix[pos]) + 10;

        for (var j = 0; j < PlacesArray.length; ++j) {
            if (DistancesMatrix[pos][j] < minnum && DistancesMatrix[pos][j] != 0 && Route.indexOf(j) === -1) {
                minnum = DistancesMatrix[pos][j];
                aux = j;
                console.log(Route.indexOf(j));
            }

        }
        console.log(Route.length);
        pos = aux;
        Route.push(aux);

        map.drawRoute({
            origin: [PlacesArray[Route[Route.length - 2]].latitude, PlacesArray[Route[Route.length - 2]].longitude],
            destination: [PlacesArray[Route[Route.length - 1]].latitude, PlacesArray[Route[Route.length - 1]].longitude],
            travelMode: 'driving',
            strokeColor: '#FF0000',
            strokeOpacity: 0.6,
            strokeWeight: 6
        });

        if (NewRoute.innerHTML !== "New route: ") {
            NewRoute.innerHTML += " - ";
        }
        NewRoute.innerHTML += aux;

    }
    Materialize.toast('Routes optimized!!', 4000);
    $("#button-optimize").addClass("disabled");
    $("#button-restart").removeClass("disabled");
}
