window.leafletInterop = {
  initMap: function (mapId, lat, lng, zoom) {
    const map = L.map(mapId).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    window._leafletMap = map;
  },

  addMarker: function (lat, lng, popupText) {
    if (!window._leafletMap) return;

    const marker = L.marker([lat, lng]).addTo(window._leafletMap);
    if (popupText) {
      marker.bindPopup(popupText);
    }
  }
};
