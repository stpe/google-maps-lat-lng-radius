function initMap() {
  var startLoc = { "lat": 59.32932349999999, "lng": 18.068580800000063 };
  var defaultRadius = 15 * 1000;

  var map = new google.maps.Map(document.getElementById('map'), {
    center: startLoc,
    zoom: 10
  });
  var input = document.getElementById('pac-input');
  var output = document.getElementById('output-container');

  var circle = new google.maps.Circle({
      strokeColor: '#3DC371',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#3DC371',
      fillOpacity: 0.35,
      map: map,
      center: startLoc,
      radius: defaultRadius,
      editable: true,
    });
  updateOutput();

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(output);

  var autocomplete = new google.maps.places.Autocomplete(input, { types: ["(cities)"] });
  autocomplete.bindTo('bounds', map);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(10);
    }

    circle.setCenter(place.geometry.location);
    circle.setRadius(defaultRadius);
    updateOutput();
  });

  function updateOutput() {
    var center = circle.getCenter();

    var geo = {
      lat: center.lat(),
      lng: center.lng(),
      radius_km: Math.round(circle.getRadius() / 1000)
    };

    document.getElementById('pos-output').innerHTML = '"geo": ' + JSON.stringify(geo, 0, 2);
  }

  google.maps.event.addListener(circle, 'radius_changed', updateOutput);
  google.maps.event.addListener(circle, 'center_changed', updateOutput);

  new Clipboard('.copybtn');
}
