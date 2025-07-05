window.leafletInterop = {
  _markers: {},
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

  addMarkerToMap: function (id, lat, lng, title) {
    if (!window._leafletMap) return;

    const marker = L.marker([lat, lng])
      .addTo(window._leafletMap)
      .bindPopup(title);

    // attach marker menu
    marker.on('contextmenu', function(e) {
      leafletInterop.hideContextMenu();

      const menu = document.createElement('div');
      menu.id = 'custom-marker-menu';
      menu.innerHTML = `
        <div class="context-menu-item" onclick="leafletInterop.onDeleteMarkerClick('${id}')">
          Delete Marker
        </div>
      `;

      leafletInterop.applyMenuStyles(menu);
      const point = window._leafletMap.latLngToContainerPoint(e.latlng);
      menu.style.left = point.x + 'px';
      menu.style.top = point.y + 'px';;

      window._leafletMap.getContainer().appendChild(menu);
    });

    this._markers[id] = marker;
  },

  enableContextMenu: function (dotNetRef) {
    if (!window._leafletMap) return;

    // disable default browser context menu on map
    window._leafletMap.getContainer().addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });

    // handle right-click on map
    window._leafletMap.on('contextmenu', function(e) {

    // remove existing menu if any
    leafletInterop.hideContextMenu();

    // attach context menu
    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.innerHTML = `
      <div class="context-menu-item" onclick="leafletInterop.onAddMarkerClick(${e.latlng.lat}, ${e.latlng.lng})">
        Add Marker
      </div>
    `;

    leafletInterop.applyMenuStyles(menu);
    menu.style.left = e.containerPoint.x + 'px';
    menu.style.top = e.containerPoint.y + 'px';

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

  onDeleteMarkerClick: function (id) {
    leafletInterop.hideContextMenu();
    console.log("deleting marker with ID:", id);
    // future implementation: delete from map and storage
  },

  hideContextMenu: function () {
    const contextMenu = document.getElementById('custom-context-menu');
    if (contextMenu) contextMenu.remove();

    const markerMenu = document.getElementById('custom-marker-menu');
    if (markerMenu) markerMenu.remove();
  },

  applyMenuStyles: function (menu) {
    menu.style.position = 'absolute';
    menu.style.zIndex = '1000';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    menu.style.minWidth = '120px';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.fontSize = '14px';
  },

};

