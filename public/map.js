/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: { lat: 39, lng: 36 },
    mapTypeId: "terrain",
  });

  const script = document.getElementById("earthquake_GeoJSONP");

  script.src = "";

  script.src = "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";

  if (dropdownValue == "circle") {
    map.data.setStyle((feature) => {
      const magnitude = feature.getProperty("mag");
      return {
        icon: getCircle(magnitude),
      };
    });  
  }
}

function getCircle(magnitude) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "red",
    fillOpacity: 0.2,
    scale: Math.pow(2, magnitude) / 2,
    strokeColor: "white",
    strokeWeight: 0.5,
  };
}

function eqfeed_callback(results) {
  if (dropdownValue == "circle") map.data.addGeoJson(results);
  if (dropdownValue == "heat") {
    const heatmapData = [];

    for (let i = 0; i < results.features.length; i++) {
      const coords = results.features[i].geometry.coordinates;
      const latLng = new google.maps.LatLng(coords[1], coords[0]);
  
      heatmapData.push(latLng);
    }
  
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      dissipating: false,
      map: map,
    });
  }
  if (dropdownValue == 'pointer') {
    for (let i = 0; i < results.features.length; i++) {
      const coords = results.features[i].geometry.coordinates;
      const latLng = new google.maps.LatLng(coords[1], coords[0]);
  
      new google.maps.Marker({
        position: latLng,
        map: map,
      });
    }
  }
}

window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;