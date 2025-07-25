// TODO: this JS file is only for flight searches
import {
  one_way_changed,
  add_new_passenger,
  format_city_names_typeahead,
  add_passengers_from_list,
} from "/scripts/flight_form_handler.js";
import { fetch_city_airports, fetch_passengers } from "/scripts/server_requests.js";

var passenger_number;
var list_continer;
var origin_iataCode;
var destination_iataCode;


async function init() {
  // Cache Document Elements
  passenger_number = 0;
  origin_iataCode = $("#origin_iataCode");
  destination_iataCode = $("#destination_iataCode");

  list_continer = $("#passengerFlightSelectContainer");

  // Set Event Listeners
  $("#oneWayFlight").on("change", one_way_changed);
  $("#addPassengerFlightBtn").on("click", function () {
    passenger_number = add_new_passenger(passenger_number, list_continer);
    console.log(passenger_number);
  });

  // Bootstrap TypeAhead is used for search bar auto completes
  // Link to documentation: https://github.com/bassjobsen/Bootstrap-3-Typeahead
  $("#flightOriginInput").typeahead(typeahead_data(origin_iataCode));
  $("#flightDestinationInput").typeahead(typeahead_data(destination_iataCode));

  // Create passengers
  let passengers_response_data = await fetch_passengers();
  let passengers_response_json = await passengers_response_data.json();
  if(passengers_response_json.passenger_data_retrieved){
    passenger_number = add_passengers_from_list(passengers_response_json.passengers, passenger_number, list_continer)
  }
  
  

  // 3: store flight data as an object in the server
  // 4: use PATCH to update flight data
}

function typeahead_data(iataCode_selector) {
  return {
    source: async function (query, process) {
      iataCode_selector.val(""); // clear previous iataCode
      var search_results = await search_matching_cities(query);
      if (search_results) {
        return process(search_results);
      }
      return;
    },
    displayText: typeahead_display,
    afterSelect: function (item) {
      iataCode_selector.val(item.iataCode);
    },
    autoSelect: true,
    delay: 500, // Wait 500ms before calling search_matching_cities
  };
}

function typeahead_display(item) {
  return `${item.cityName} ${item.airportName} (${item.iataCode})`;
}

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

document.addEventListener("DOMContentLoaded", async function () {
  await init();
});

// create an init
// cache selectors in init
// take all on functions and declare them in another file
// import functions and create the on click event in init
// store the current flight search on the server
// use patch to update the flight search on the server
// use 'this' when in an onclick function
// idea: request passenger data from back end after document is loaded
