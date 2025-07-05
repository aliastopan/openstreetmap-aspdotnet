window.leafletInterop = {
  initMap: function (mapId, lat, lng, zoom) {
    const map = L.map(mapId).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // add click listener (marker)
    map.on("click", function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    });

    window._leafletMap = map;
  },

  locateAndCenter: function () {
    // prevents errors if the map isn't initialized yet.
    if (!window._leafletMap) return;

    // html5 geolocation api
    navigator.geolocation.getCurrentPosition(

      // parameters
      // success callback
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        window._leafletMap.setView([lat, lng], 13);

        L.marker([lat, lng])
          .addTo(window._leafletMap)
          .bindPopup("You are here")
          .openPopup();
      },

      // error callback
      function (err) {
        console.warn("Geolocation error:", err.message);
      }
    );
  },

  addMarker: function (lat, lng, popupText) {
    if (!window._leafletMap) return;

    const marker = L.marker([lat, lng]).addTo(window._leafletMap);
    if (popupText) {
      marker.bindPopup(popupText);
    }
  }
};
