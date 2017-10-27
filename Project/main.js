
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
            lng: longitude
        });

        PlacesArray.push(new Place(latitude,longitude));
    }
});