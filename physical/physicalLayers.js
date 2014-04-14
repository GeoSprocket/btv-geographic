var map = L.map('map').setView([44.434, -73.062], 10);

var baseLayer = new L.mapbox.tileLayer('landplanner.hl6099hm').addTo(map);

// ADD LAYER CONTROLLER
var ui = document.getElementById('layerControls');

addLayer(L.mapbox.tileLayer('vanhoesenj.VTBedrock'), L.mapbox.gridLayer('vanhoesenj.VTBedrock'), 'Bedrock Geology', 1);
addLayer(L.mapbox.tileLayer('vanhoesenj.VtSurfGeo'), L.mapbox.gridLayer('vanhoesenj.VtSurfGeo'), 'Surficial Geology', 2);
addLayer(L.mapbox.tileLayer('landplanner.hli55fb7'), L.mapbox.gridLayer('landplanner.hli55fb7'), 'Soil Types', 3);

function addLayer(layer, gridlayer, name, zIndex) {
  layer.setZIndex(zIndex);
  var gridControl = L.mapbox.gridControl(gridlayer, {position: 'bottomleft'}).addTo(map);
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
      map.removeLayer(gridlayer);
      map.removeLayer(layer);
      this.className = 'btn btn-primary btn-sm';
    } else {
      map.addLayer(layer);
      map.addLayer(gridlayer);
      this.className = 'active btn btn-primary btn-sm';
    }
  };
  ui.appendChild(link);
};

// ADD THE REFERENCE OVERLAY
var topPane = L.DomUtil.create('div', 'leaflet-top-pane', map.getPanes().mapPane);
var topLayer = new L.mapbox.tileLayer('landplanner.hl60jemk', {
  maxZoom: 18
}).addTo(map);
topPane.appendChild(topLayer.getContainer());
topLayer.setZIndex(7);

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
  map.removeLayer(topLayer);
  baseLayer = L.mapbox.tileLayer('landplanner.hl6099hm').addTo(map);
  topLayer = L.mapbox.tileLayer('landplanner.hl60jemk', {
    maxZoom: 18
  }).addTo(map);
  topPane.appendChild(topLayer.getContainer());
  topLayer.setZIndex(7);
};
document.getElementById('satellite').onclick = function() {
  map.removeLayer(baseLayer);
  map.removeLayer(topLayer);
  baseLayer = L.mapbox.tileLayer('landplanner.h1dknok1').addTo(map);
  topLayer = L.mapbox.tileLayer('landplanner.map-6ycmi90w', {
    maxZoom: 18
  }).addTo(map);
  topPane.appendChild(topLayer.getContainer());
  topLayer.setZIndex(7);
};