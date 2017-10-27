

var PlacesArray = [];
var icon = "icon.png";


function Place(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
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

function Distance() {
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
}