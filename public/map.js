let map, setCurrentLocation, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: zoom,
    center: loc,
    mapTypeId: "terrain",
  });

  infoWindow = new google.maps.InfoWindow();

  const script = document.getElementById("earthquake_GeoJSONP");

  script.src = "";

  script.src = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp";

  if (dropdownValue == "circle") {
    map.data.setStyle((feature) => {
      const magnitude = feature.getProperty("mag");
      return {
        icon: getCircle(magnitude),
      };
    });  
  }

  map.addListener("dragend", () => {
    localStorage.setItem("location", JSON.stringify({lat: map.getCenter().lat(), lng: map.getCenter().lng()}))
  })

  map.addListener("zoom_changed", () => {
    localStorage.setItem("zoom", map.getZoom());
  })

  setCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Şimdiki konumunuz");
          infoWindow.open(map);
          map.setCenter(pos);
          console.log(map.getCenter().lat());
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Hata: Konum servisi başarısız oldu."
      : "Hata: Tarayıcınız konum servisini desteklemiyor."
  );
  infoWindow.open(map);
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