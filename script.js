let map;
let directionsService;
let directionsRenderer;
let currentLocation;
let locations = []; // Array to store locations

// Initialize the map
function initMap() {
  console.log("Initializing map..."); // Debugging log
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.4140, lng: -119.8489 }, // Default center (UCSB coordinates)
    zoom: 13,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Get the user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("Current location:", currentLocation); // Debugging log
        map.setCenter(currentLocation); // Center the map on the user's location
        new google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Your Current Location",
        });
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Add a location to the list
function addLocation() {
  console.log("addLocation function called"); // Debugging log
  const address = document.getElementById("addressInput").value;
  console.log("Address entered:", address); // Debugging log
  if (!address) {
    console.log("No address entered"); // Debugging log
    return;
  }

  const geocoder = new google.maps.Geocoder();
  console.log("Geocoder initialized"); // Debugging log
  geocoder.geocode({ address: address }, (results, status) => {
    console.log("Geocoding callback executed"); // Debugging log
    if (status === "OK" && results[0]) {
      const location = results[0].geometry.location;
      console.log("Location found:", location); // Debugging log
      locations.push(location);

      new google.maps.Marker({
        position: location,
        map: map,
        title: address,
      });

      document.getElementById("addressInput").value = "";
    } else {
      console.error("Geocode was not successful for the following reason:", status);
    }
  });
}

// Show the route from the current location to all added locations
function showRoute() {
  if (!currentLocation || locations.length === 0) {
    alert("Please add at least one location.");
    return;
  }

  const waypoints = locations.map((location) => ({
    location: location,
    stopover: true,
  }));

  directionsService.route(
    {
      origin: currentLocation,
      destination: locations[locations.length - 1], // Last location is the final destination
      waypoints: waypoints.slice(0, -1), // All locations except the last one
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response); // Display the route on the map
      } else {
        console.error("Directions request failed due to:", status);
      }
    }
  );
}
