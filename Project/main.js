var PlacesArray = [];
var icon = "icon.png";
var LatLngArray = [];
var ArrayofArrays = [];
var nElementos;
var DistancesMatrix;
var service = new google.maps.DistanceMatrixService();

function Place(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
}

function BuildArrayofArrays() {

    ArrayofArrays = [];

    nElementos = PlacesArray.length/10;
    var nEntero = parseInt(nElementos.toFixed());
    //console.log(nEntero);

    if (nElementos - nEntero > 0){
        nElementos = nEntero+1;
    }
    else{
        nElementos = nEntero;
    }

    //console.log('cant='+ nElementos);

    var n = PlacesArray.length;
    var limite = 0;

    for(var i = 0; i < nElementos; ++i){

        if(n-10 > 0){
            limite = 10;
            n-=10;
        }
        else{
            limite = n;
        }
        //console.log('lim='+limite);
        for(var j = 0; j < limite; ++j){
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
        var latitude = e.latLng.lat();
        var longitude = e.latLng.lng();
        map.addMarker({
            lat: latitude,
            lng: longitude,
            title: 'Spot ' + PlacesArray.length,
            icon: icon
        });
        PlacesArray.push(new Place(latitude,longitude));
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
    }
});

/**function Distance() {
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

function Distance() {

    if (PlacesArray.length >= 2) {

        DistancesMatrix = new Array(PlacesArray.length);
        for(var i = 0; i<PlacesArray.length; ++i){
            DistancesMatrix[i] = new Array(PlacesArray.length);
        }

        BuildArrayofArrays();
        //console.log(ArrayofArrays[0].length + "  "+ nElementos);
        console.log(nElementos);
        for(var k = 0; k < nElementos; ++k){
            for(var l = 0; l < nElementos; ++l){

            }//Fin for
        }//Fin for
    }//Fin if
    console.log(DistancesMatrix);
}

var w=0;
var r=0;

function Step(){
    console.log(w+'  '+r);
    CalDistances(w,r);
    if(r == nElementos-1) {
        if (w != nElementos-1) {
            w++;
            r = 0;
        }
        else{
            var btnStep = document.getElementById('btnStep');
            btnStep.disabled =true;
            console.log(DistancesMatrix);
        }
    }
    else{r++;}

}


function CalDistances(k,l){

    service.getDistanceMatrix(
        {
            origins: ArrayofArrays[k],
            destinations: ArrayofArrays[l],
            travelMode: 'DRIVING'
        }, function callback(response, status) {
            if (status == 'OK') {
                var origins = response.originAddresses;
                var destinations = response.destinationAddresses;

                for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var element = results[j];
                        var distance = element.distance.value;
                       DistancesMatrix[i+(10*k)][j+(10*l)]=distance;
                        //console.log((i+(10*k)) + '_' +(j+(10*l)));
                    }
                }
            }
        });

}
