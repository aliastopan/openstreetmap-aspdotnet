window.leafletInterop = {
  initMap: function (mapId, lat, lng, zoom) {
    const map = L.map(mapId).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // // add click listener (marker)
    // map.on("click", function (e) {
    //   const lat = e.latlng.lat;
    //   const lng = e.latlng.lng;
    //   L.marker([lat, lng])
    //     .addTo(map)
    //     .bindPopup(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    // });

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

  // add to your leafletInterop object
  enableContextMenu: function () {
    if (!window._leafletMap) return;

    // disable default browser context menu on map
    window._leafletMap.getContainer().addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });

    // handle right-click on map
    window._leafletMap.on('contextmenu', function(e) {
      // remove existing menu if any
      const existingMenu = document.getElementById('custom-context-menu');
      if (existingMenu) {
        existingMenu.remove();
      }

      // create menu
      const menu = document.createElement('div');
      menu.id = 'custom-context-menu';
      menu.innerHTML = `
        <div class="context-menu-item" onclick="leafletInterop.addMarkerFromContext(${e.latlng.lat}, ${e.latlng.lng})">
          Add Marker
        </div>
        <div class="context-menu-item" onclick="leafletInterop.hideContextMenu()">
          Cancel
        </div>
      `;

      // position menu at cursor
      menu.style.position = 'absolute';
      menu.style.left = e.containerPoint.x + 'px';
      menu.style.top = e.containerPoint.y + 'px';
      menu.style.zIndex = '1000';
      menu.style.backgroundColor = 'white';
      menu.style.border = '1px solid #ccc';
      menu.style.borderRadius = '4px';
      menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

      // add to map container
      window._leafletMap.getContainer().appendChild(menu);

      // store coordinates for later use
      window._contextMenuCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
    });

    // hide menu when clicking elsewhere
    window._leafletMap.on('click', function() {
      leafletInterop.hideContextMenu();
    });
  },

  addMarkerFromContext: function(lat, lng) {
    L.marker([lat, lng])
      .addTo(window._leafletMap)
      .bindPopup(`Context Menu Marker<br>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);

    this.hideContextMenu();
  },

  hideContextMenu: function() {
    const menu = document.getElementById('custom-context-menu');
    if (menu) {
      menu.remove();
    }
  }

};
