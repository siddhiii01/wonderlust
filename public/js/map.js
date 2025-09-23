// Make sure mapApi and listing are defined in your EJS above
maptilersdk.config.apiKey = mapApi;

// Initialize the map with a fallback location
const map = new maptilersdk.Map({
  container: 'map',
  style: maptilersdk.MapStyle.STREETS,
  center: [77.209, 28.6139], // fallback coordinates if geometry missing
  zoom: 14
});

// Debug: check the coordinates coming from backend
console.log("Listing coordinates (lat/lng):", listing.lat, listing.lng);

// Only proceed if listing has valid coordinates
if (listing.lat && listing.lng) {
  const coords = [listing.lng, listing.lat]; // MapTiler SDK expects [lng, lat]

  // Fly to the listing location
  map.flyTo({ center: coords, zoom: 16 });

  // Add a marker at the listing location
  const marker = new maptilersdk.Marker()
    .setLngLat(coords)
    .addTo(map);

  // Add a popup bound to the marker
  const popup = new maptilersdk.Popup({ closeOnClick: true })
    .setHTML(`<strong>${listing.title}</strong><br>${listing.location}`)
    .setLngLat(coords)
    .addTo(map);

  marker.setPopup(popup);
}
