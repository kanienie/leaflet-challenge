// Define the URL for the USGS GeoJSON feed
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Create a Leaflet map
var map = L.map('map').setView([37.8, -96], 3);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a Leaflet GeoJSON layer
var earthquakes = new L.GeoJSON.AJAX([url], {
  // Define a function to style each feature
  pointToLayer: function (feature, latlng) {
    var depth = feature.geometry.coordinates[2];
    var radius = feature.properties.mag * 50000;
    var color = getColor(depth);

    // Create a circle marker with the appropriate style
    return L.circleMarker(latlng, {
      radius: radius,
      fillColor: color,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  },
  // Define a function to create popups for each feature
  onEachFeature: function (feature, layer) {
    var depth = feature.geometry.coordinates[2];
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p><b>Time:</b> " + new Date(feature.properties.time) +
      "</p><p><b>Magnitude:</b> " + feature.properties.mag +
      "</p><p><b>Depth:</b> " + depth + "km</p>");
  }
});

// Add the earthquakes layer to the map
earthquakes.addTo(map);

// Define a function to get the color based on depth
function getColor(depth) {
  switch (true) {
    case depth > 500:
      return "#E31A1C";
    case depth > 400:
      return "#FC4E2A";
    case depth > 300:
      return "#FD8D3C";
    case depth > 200:
      return "#FEB24C";
    case depth > 100:
      return "#FED976";
    default:
      return "#FFEDA0";
  }
}

// Add a legend to the map
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = "<h4>Depth</h4>" +
    "<div><i style='background: #FFEDA0;'></i> 0 - 100km</div>" +
    "<div><i style='background: #FED976;'></i> 100 - 200km</div>" +
    "<div><i style='background: #FEB24C;'></i> 200 - 300km</div>" +
    "<div><i style='background: #FD8D3C;'></i> 300 - 400km</div>" +
    "<div><i style='background: #FC4E2A;'></i> 400 - 500km</div>" +
    "<div><i style='background: #E31A1C;'></i> 500+ km</div>";
  return div;
};
legend.addTo(map);