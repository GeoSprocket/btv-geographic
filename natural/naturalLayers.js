var map = L.map('map').setView([44.434, -73.062], 10);

//var popup = new L.Popup({ autoPan: false });
var baseLayer = new L.mapbox.tileLayer('landplanner.hl6099hm').addTo(map);

// control that shows state info on hover
var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

// Reusable as long as everything has a "name" field
info.update = function (props) {
  this._div.innerHTML = (props ? '<h1 style="font-size:1.6em">' + props.name + '</h1>' : '' );
};

info.addTo(map);

// What happens on feature highlight
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    fillOpacity: 0.2
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

// WHat happens on mouseout
function resetHighlight(e) {
  currentLayer.resetStyle(e.target) 
  info.update();
}

// Behavior for vector layers
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
}

// SUBWATERSHEDS LAYER
var subwatersheds = L.geoJson(null, {
  style: function(feature) {
    return {
      color: "#225378",
      fillColor: '#acf0f2',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.6,
      clickable: true
    };
  },
  onEachFeature: onEachFeature
});
$.getJSON("../geodata/chittenden_subwatersheds.topojson", function(data) {
  var subwatershedsgeojson = topojson.feature(data, data.objects.chittenden_subwatersheds).features;
  subwatersheds.addData(subwatershedsgeojson);
});

// CITY PARKS LAYER
var parks = L.geoJson(null, {
  style: function(feature) {
    return {
      color: "#26393d",
      fillColor: '#d0a825',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.6,
      clickable: true
    };
  },
  onEachFeature: onEachFeature
});
$.getJSON("../geodata/btv_parks.topojson", function(data) {
  var parksgeojson = topojson.feature(data, data.objects.btv_parks).features;
  parks.addData(parksgeojson);
});

// WETLANDS LAYER
var wetlands = L.geoJson(null, {
  style: function(feature) {
    return {
      color: "#fffae4",
      fillColor: '#40627c',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6,
      clickable: true
    };
  },
  onEachFeature: onEachFeature
});
$.getJSON("../geodata/chittenden_vswi_wetlands.topojson", function(data) {
  var wetlandsgeojson = topojson.feature(data, data.objects.chittenden_vswi_wetlands).features;
  wetlands.addData(wetlandsgeojson);
});

// CURRENT PRECIPITATION LAYER
/*var currentPrecipitation = L.tileLayer.wms("http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs", {
    format: 'image/png',
    transparent: true,
    layers: 'RAS_RIDGE_NEXRAD'
});*/

// CLIMATE LAYER
function getColorPrecip(d) {
  return d > 70 ? '#253494' : 
        d > 63 ? '#2c7fb8' : 
        d > 55 ? '#41b6c4' : 
        d > 48 ? '#7fcdbb' : 
        d > 41 ? '#c7e9b4' : 
        d > 33 ? '#ffffcc' : 
        '#ffffff';
}

var precipitation = L.geoJson(null, {
  style: function(feature) {
    return {
      color: "#333333",
      fillColor: getColorPrecip(feature.properties.inches),
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6,
      clickable: true
    };
  },
  onEachFeature: onEachFeature
});
$.getJSON("../geodata/chittenden_30yr_mean_precip_in.topojson", function(data) {
  var precipgeojson = topojson.feature(data, data.objects.chittenden_precip3).features;
  precipitation.addData(precipgeojson);
});

//COMMUNITY GARDEN LAYER

var gardens = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    layer.setIcon(
      L.mapbox.marker.icon(
        {
          'marker-symbol': 'garden', 
          'marker-color': '59245f'
        }
      )
    );
    layer.bindPopup("<h1>" + feature.properties.name + "</h1><p>" + feature.properties.description + "</p>");
  }
});
$.getJSON("../geodata/btv_community_gardens.topojson", function(data) {
  var gardensgeojson = topojson.feature(data, data.objects.collection).features;
  gardens.addData(gardensgeojson);
});

// ADD LAYER CONTROLLER
var ui = document.getElementById('layerControls');
addLayer(subwatersheds, 'Subwatersheds', 1);
addLayer(wetlands, 'VSWI Wetlands', 2);
addLayer(precipitation, 'Ann. Mean Precip.', 3);
addLayer(parks, 'City Parks', 4);
addLayer(gardens, 'Community Gardens', 5);

// A placeholder for layer name
var currentLayer;

function addLayer(layer, name, zIndex) {
  layer.setZIndex(zIndex);
  // Create a simple layer switcher that toggles layers on
  // and off.
  var link = document.createElement('a');
  link.href = '#';
  link.className = 'btn btn-primary btn-sm';
  link.type = 'button';
  link.innerHTML = name;
  link.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
      this.className = 'btn btn-primary btn-sm';
    } else {
      currentLayer = layer;
      map.addLayer(layer);
      this.className = 'active btn btn-primary btn-sm';
    }
  };
  ui.appendChild(link);
};

// ADD THE REFERENCE OVERLAY
/*var topPane = L.DomUtil.create('div', 'leaflet-top-pane', map.getPanes().mapPane);
var topLayer = new L.mapbox.tileLayer('landplanner.hl60jemk', {
  maxZoom: 18
}).addTo(map);
topPane.appendChild(topLayer.getContainer());
topLayer.setZIndex(7);*/

// SET LOCATION BOOKMARKS
document.getElementById('burlington').onclick = function() {
  map.setView({
    lat: 44.487,
    lon: -73.226
  }, 13);
  return false;
};
document.getElementById('chittenden').onclick = function() {
  map.setView({
    lat: 44.434,
    lon: -73.052
  }, 10);
  return false;
};

//SWITCH BASEMAPS
document.getElementById('streets').onclick = function() {
  map.removeLayer(baseLayer);
  //map.removeLayer(topLayer);
  baseLayer = L.mapbox.tileLayer('landplanner.hl6099hm').addTo(map);
  /*topLayer = L.mapbox.tileLayer('landplanner.hl60jemk', {
    maxZoom: 18
  }).addTo(map);
  topPane.appendChild(topLayer.getContainer());
  topLayer.setZIndex(7);*/
};
document.getElementById('satellite').onclick = function() {
  map.removeLayer(baseLayer);
  //map.removeLayer(topLayer);
  baseLayer = L.mapbox.tileLayer('landplanner.h1dknok1').addTo(map);
  /*topLayer = L.mapbox.tileLayer('landplanner.map-6ycmi90w', {
    maxZoom: 18
  }).addTo(map);
  topPane.appendChild(topLayer.getContainer());
  topLayer.setZIndex(7);*/
};