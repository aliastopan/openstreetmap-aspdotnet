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
  },

  enableContextMenu: function (dotNetRef) {
    if (!window._leafletMap) return;

    // disable default browser context menu on map
    window._leafletMap.getContainer().addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });

    // handle right-click on map
    window._leafletMap.on('contextmenu', function(e) {
    // Remove existing menu if any
    leafletInterop.hideContextMenu();

    // create menu
    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.innerHTML = `
      <div class="context-menu-item" onclick="leafletInterop.onAddMarkerClick(${e.latlng.lat}, ${e.latlng.lng})">
        Add Marker
      </div>
    `;

    // style the menu
    menu.style.position = 'absolute';
    menu.style.left = e.containerPoint.x + 'px';
    menu.style.top = e.containerPoint.y + 'px';
    menu.style.zIndex = '1000';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    menu.style.minWidth = '120px';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.fontSize = '14px';

    // add to map container
    window._leafletMap.getContainer().appendChild(menu);

    // store dotnet reference and coordinates
    window._contextMenuDotNetRef = dotNetRef;
    window._contextMenuCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
  });

  // hide menu when clicking elsewhere on map
  window._leafletMap.on('click', function() {
    leafletInterop.hideContextMenu();
  });
},

  onAddMarkerClick: function(lat, lng) {
    // hide menu first
    leafletInterop.hideContextMenu();

    // call C# method with coordinates
    if (window._contextMenuDotNetRef) {
      window._contextMenuDotNetRef.invokeMethodAsync('OnAddMarkerRequested', lat, lng);
    }
  },

  hideContextMenu: function() {
    const menu = document.getElementById('custom-context-menu');
    if (menu) {
      menu.remove();
    }
  }

};
