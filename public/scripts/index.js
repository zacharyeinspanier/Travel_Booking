// TODO: this JS file is only for flight searches
import {
  one_way_changed,
  add_new_passenger,
  format_city_names_typeahead,
} from "/scripts/flight_form_handler.js";
import { fetch_city_airports } from "/scripts/server_requests.js";

var passenger_number = 0;

$("#oneWayFlight").on("change", one_way_changed);
$("#addPassengerFlightBtn").on("click", function () {
  passenger_number = add_new_passenger(passenger_number);
  console.log(passenger_number);
});

// Bootstrap TypeAhead is used for search bar auto completes
// An async function is use as the source
// Link to documentation: https://github.com/bassjobsen/Bootstrap-3-Typeahead
$("#flightOriginInput").typeahead({
  source: async function (query, process) {
    $("#origin_iataCode").val(""); // clear previous iataCode
    var search_results = await search_matching_cities(query);
    if (search_results) {
      return process(search_results);
    }
    return;
  },
  displayText: function (item) {
    return `${item.cityName} ${item.airportName} (${item.iataCode})`;
  },
  afterSelect: function (item) {
    $("#origin_iataCode").val(item.iataCode);
  },
  autoSelect: true,
  delay: 500, // Wait 500ms before calling search_matching_cities
});

$("#flightDestinationInput").typeahead({
  source: async function (query, process) {
    $("#destination_iataCode").val(""); // clear previous iataCode
    var search_results = await search_matching_cities(query);
    if (search_results) {
      return process(search_results);
    }
    return;
  },
  displayText: function (item) {
    return `${item.cityName} ${item.airportName} (${item.iataCode})`;
  },
  afterSelect: function (item) {
    $("#destination_iataCode").val(item.iataCode);
  },
  autoSelect: true,
  delay: 500, // Wait 500ms before calling search_matching_cities
});

async function search_matching_cities(query) {
  const matching_city_airports = await fetch_city_airports(query);
  // Inform user of error
  if (!matching_city_airports.ok) {
    $("#errorMessageContainer").empty();
    var error_message = $(`<p style="color:red;"></p>`).text(
      `Could not complete search: ${matching_city_airports.status} ${matching_city_airports.statusText}`
    );
    $("#errorMessageContainer").append(error_message);
    return;
  }
  const data = await matching_city_airports.json();
  return format_city_names_typeahead(data);
}

document.addEventListener('DOMContentLoaded', function() {
    //init(); // Call your initialization function here
});



// create an init
// cache selectors in init
// take all on functions and declare them in another file
// import functions and create the on click event in init
// store the current flight search on the server
// use patch to update the flight search on the server
// use 'this' when in an onclick function
// idea: request passenger data from back end after document is loaded
