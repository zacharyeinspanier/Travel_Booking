// Exteranl resources: https://github.com/bassjobsen/Bootstrap-3-Typeahead

let typingInputFlightOriginInput;
let typingInputFlightDestinationInput;

// Bootstrap TypeAhead is used for search bar auto completes
// An async function is use as the source 
$("#flightOriginInput").typeahead({
  source: async function (query, process) {
    // Wait 500ms before calling search_matching_cities
    clearTimeout(typingInputFlightOriginInput);
    typingInputFlightOriginInput = setTimeout(async function () {
      var cities = await search_matching_cities(query);
      var cities_formatted = format_city_names_typeahead(cities);
       // use process var to async return results
      return process(cities_formatted);
    }, 500);
    return;
  },
});

$("#flightDestinationInput").typeahead({
  source: async function (query, process) {
    // Wait 500ms before calling search_matching_cities
    clearTimeout(typingInputFlightDestinationInput);
    typingInputFlightDestinationInput = setTimeout(async function () {
      var cities = await search_matching_cities(query);
      var cities_formatted = format_city_names_typeahead(cities);
      // use process var to async return results
      return process(cities_formatted);
    }, 500);

    return;
  },
});

$("#oneWayFlight").on("change", function () {
  if ($("#oneWayFlight").is(":checked")) {
    $("#flightReturnDate").prop("disabled", true);
  } else {
    $("#flightReturnDate").prop("disabled", false);
  }
});

async function search_matching_cities(city_name) {
  const params = new URLSearchParams();
  params.append("name", city_name);

  try {
    const matching_city_names = await fetch(`/search/cityairports?${params}`);

    if (!matching_city_names.ok) {
      throw new Error(`Response status: ${matching_city_names.status}`);
    }

    const data = await matching_city_names.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function format_city_names_typeahead(results) {
  if (results) {
    const content = results
      .map((item) => {
        //if item is AIRPORT
        if (item.subType == "AIRPORT") {
          return `${item.address.cityName} (${item.iataCode})`;
        }
      })
      .filter((item) => {
        // map introduces undefined values if nothing is retured
        // filter undefined values
        if (item != undefined) {
          return true;
        }
        return false;
      });
    return content;
  }
  return [];
}