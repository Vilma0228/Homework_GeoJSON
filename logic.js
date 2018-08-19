var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//console.log (API_quakes)
var API_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
//console.log (API_plates)

function markerSize(magnitude) {
    return magnitude * 3;
};

var earthquakes = new L.LayerGroup();

d3.json(API_quakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color
                (geoJsonFeature.properties.mag),
                fillOpacity: 0.5,
                weight: 0.1,
                //color: 'yellow'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

var plateBoundary = new L.LayerGroup();

d3.json(API_plates, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 4,
                color: 'gold'
            }
        },
    }).addTo(plateBoundary);
})


function Color(magnitude) {
    if (magnitude > 5) {
        return 'darkred'
    } else if (magnitude > 4) {
        return 'red'
    } else if (magnitude > 3) {
        return 'darkorange'
    } else if (magnitude > 2) {
        return 'orange'
    } else if (magnitude > 1) {
        return 'yellow'
    } else {
        return 'lightyellow'
    }
};

function createMap() {

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.high-contrast',
      accessToken: 'pk.eyJ1IjoidmlsbWEwMjI4IiwiYSI6ImNqa2l4b21zcjA1MnAzcG5sNjNjenZkbGsifQ.ybEiQBYMPDDFTksfcKVYyA'
    });



    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoidmlsbWEwMjI4IiwiYSI6ImNqa2l4b21zcjA1MnAzcG5sNjNjenZkbGsifQ.ybEiQBYMPDDFTksfcKVYyA'
  });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.dark',
      accessToken: 'pk.eyJ1IjoidmlsbWEwMjI4IiwiYSI6ImNqa2l4b21zcjA1MnAzcG5sNjNjenZkbGsifQ.ybEiQBYMPDDFTksfcKVYyA'
  });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.satellite',
      accessToken: 'pk.eyJ1IjoidmlsbWEwMjI4IiwiYSI6ImNqa2l4b21zcjA1MnAzcG5sNjNjenZkbGsifQ.ybEiQBYMPDDFTksfcKVYyA'
  });

    var baseLayers = {
        "High Contrast": highContrastMap,
        "Street": streetMap,
        "Dark": darkMap,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakes,
        "Plate Boundaries": plateBoundary,
    };

    var myMap = L.map('myMap', {
        center: [40, -99],
        zoom: 4.3,
        layers: [streetMap, earthquakes, plateBoundary]
    });

    L.control.layers(baseLayers, overlays).addTo(myMap);

    var legend = L.control({ position: 'topright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:2px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
}

//createMap()