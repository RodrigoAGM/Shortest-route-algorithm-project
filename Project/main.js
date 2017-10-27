
function Place(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
}

var PlacesArray = [];

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
            title: 'Spot ' + PlacesArray.length
        });

        PlacesArray.push(new Place(latitude,longitude));
        var pos = PlacesArray.length - 2;

        if (PlacesArray.length >= 2){
            map.drawRoute({
                origin: [PlacesArray[pos].latitude, PlacesArray[pos].longitude],
                destination: [PlacesArray[pos+1].latitude, PlacesArray[pos+1].longitude],
                travelMode: 'driving',
                strokeColor: '#131540',
                strokeOpacity: 0.6,
                strokeWeight: 6
            })
        }
    }
});

