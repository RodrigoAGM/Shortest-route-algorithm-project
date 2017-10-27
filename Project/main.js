
function Place(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
}

var PlacesArray = [];
var icon = "icon.png";

var map = new GMaps({
    el: '#map',
    lat: -12.043333,
    lng: -77.028333,

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
            Distance();
        }
    }
});

function Distance(){
    srcLocation = new google.maps.LatLng(PlacesArray[0].latitude, PlacesArray[0].longitude);
    dstLocation = new google.maps.LatLng(PlacesArray[1].latitude, PlacesArray[1].longitude);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(srcLocation, dstLocation)
    console.log('distance = ' + distance/1000); // Distance in Kms.
}