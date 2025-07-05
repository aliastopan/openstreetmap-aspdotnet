window.leafletInterop = {
  initMap: function (mapId, lat, lng, zoom) {
    const map = L.map(mapId).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    window._leafletMap = map;
  },

  locateAndCenter: function (dotNetRef) {
    if (!window._leafletMap) return;

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        window._leafletMap.setView([lat, lng], 13);
        dotNetRef.invokeMethodAsync('OnGeolocationFound', lat, lng);
      },
      function (err) {
        console.warn("Geolocation error:", err.message);
        dotNetRef.invokeMethodAsync('OnGeolocationError', err.message);
      }
    );
  },

  addMarkerToMap: function (lat, lng, title) {
    if (!window._leafletMap) return;

    L.marker([lat, lng])
      .addTo(window._leafletMap)
      .bindPopup(title);
}
};
