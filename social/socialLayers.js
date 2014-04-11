var map = L.map('map').setView([44.487, -73.226], 13);

//var popup = new L.Popup({ autoPan: false });
var baseLayer = new L.mapbox.tileLayer('landplanner.hl6099hm').addTo(map);

// CENSUS LAYERS

// control that shows state info on hover
var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = (props ? '<h2>' + props.name + '</h2><p>Population Density: <b>' + Math.round(props.popdens) + '</b><br># of Households: <b>' + props.housing + '</b></p>' : '' );
};

info.addTo(map);


// get color depending on population density value
function getColor1(d) {
  return d > 18800 ? '#08306b' : 
        d > 11400 ? '#3e4d82' : 
        d > 7570 ? '#656e9a' : 
        d > 5390 ? '#8b90b3' : 
        d > 3570 ? '#b1b4cc' : 
        d > 860 ? '#d7d9e5' : 
        '#ffffff';
}

function getColor2(d) {
  return d > 300 ? '#4a1486' : 
        d > 164 ? '#6a51a3' : 
        d > 96 ? '#807dba' : 
        d > 61 ? '#9e9ac8' : 
        d > 33 ? '#bcbddc' : 
        d > 11 ? '#dadaeb' : 
        '#ffffff';
}

function getStyle1(feature) {
  return {
    weight: 0,
    opacity: 0,
    fillOpacity: 0.7,
    fillColor: getColor1(feature.properties.popdens)
  };
}

function getStyle2(feature) {
  return {
    weight: 0,
    opacity: 0,
    fillOpacity: 0.7,
    fillColor: getColor2(feature.properties.housing)
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#333',
    opacity: 0.8,
    fillOpacity: 0.3
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var popdensity;
var housing;

function resetHighlight1(e) {
  popdensity.resetStyle(e.target) 
  info.update();
}

function resetHighlight2(e) {
  housing.resetStyle(e.target)
  info.update();
}

function onEachFeature1(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight1,
  });
}

function onEachFeature2(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight2,
  });
}

popdensity = L.geoJson(null, {
  style: getStyle1,
  onEachFeature: onEachFeature1
});

housing = L.geoJson(null, {
  style: getStyle2,
  onEachFeature: onEachFeature2
});

$.getJSON("../geodata/btv_census_blocks_2010.topojson", function(data) {
  var censusgeojson = topojson.feature(data, data.objects.btv_census_blocks_2010).features;
  popdensity.addData(censusgeojson);
  housing.addData(censusgeojson);
});

// END CENSUS LAYERS


// CITY BOUNDARY LAYER
var city = L.geoJson(null, {
  style: function(feature) {
    return {
      color: "#717276",
      fill: false,
      weight: 4,
      opacity: 1,
      clickable: false
    };
  }
});
$.getJSON("../geodata/burlington.topojson", function(data) {
  var citygeojson = topojson.feature(data, data.objects.burlington).features;
  city.addData(citygeojson);
});

// COUNTY BOUNDARY LAYER
var county = L.geoJson(null, {
  style: function(feature) {
    return {
      color: "#94969d",
      fill: false,
      weight: 1,
      opacity: 1,
      clickable: false
    };
  }
});
$.getJSON("../geodata/chittenden_towns.topojson", function(data) {
  var countygeojson = topojson.feature(data, data.objects.chittenden_towns).features;
  county.addData(countygeojson);
});

// ADD LAYER CONTROLLER
var ui = document.getElementById('layerControls');
addLayer(city, 'City Boundary', 1);
addLayer(county, 'Chittenden County Towns', 2);
addLayer(popdensity, 'Population Density, 2010', 3);
addLayer(housing, 'Households, 2010', 4);
addLayer(L.mapbox.tileLayer('landplanner.hm1kg9l2'), 'Building Footprints', 6);
//addLayer(L.tileLayer('https://s3.amazonaws.com/geosprocket/tiles/btv1894-5/{z}/{x}/{y}.png'), 'Selected 1894 Sanborn Maps', 4);

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
      map.addLayer(layer);
      this.className = 'active btn btn-primary btn-sm';
    }
  };
  ui.appendChild(link);
};

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
// ADD THE REFERENCE OVERLAY
var topPane = L.DomUtil.create('div', 'leaflet-top-pane', map.getPanes().mapPane);
var topLayer = new L.mapbox.tileLayer('landplanner.hl60jemk', {
  maxZoom: 18
}).addTo(map);
topPane.appendChild(topLayer.getContainer());
topLayer.setZIndex(7);