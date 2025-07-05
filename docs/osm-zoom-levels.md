## Zoom Level

``` js
window._leafletMap.setView([lat, lng], 1);  // see whole world
window._leafletMap.setView([lat, lng], 10); // see whole city
window._leafletMap.setView([lat, lng], 13); // see neighborhood
window._leafletMap.setView([lat, lng], 18); // see individual buildings
```
### Common Zoom Levels
- World map: 1-3
- Country/region: 4-6
- City overview: 7-10
- Neighborhood: 11-14
- Street detail: 15-18
- Building detail: 19+
