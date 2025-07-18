// TODO: this JS file is only for flight searches
var passengerNumber = 0;

// Bootstrap TypeAhead is used for search bar auto completes
// An async function is use as the source
// Link to documentation: https://github.com/bassjobsen/Bootstrap-3-Typeahead
$("#flightOriginInput").typeahead({
  source: async function (query, process) {
    $("#origin_iataCode").val(""); // clear previous iataCode 
    var cities = await search_matching_cities(query);
    if (cities) {
      var cities_formatted = format_city_names_typeahead(cities);
      // use process var to async return results
      return process(cities_formatted);
    }
    return;
  },
  displayText: function (item) {
    return `${item.cityName} ${item.airportName} (${item.iataCode})`;
  },
  afterSelect: function(item){
    $("#origin_iataCode").val(item.iataCode);
  },
  autoSelect: true,
  delay: 500, // Wait 500ms before calling search_matching_cities
});

$("#flightDestinationInput").typeahead({
  source: async function (query, process) {
    $("#destination_iataCode").val(""); // clear previous iataCode 
    var cities = await search_matching_cities(query);
    if (cities) {
      var cities_formatted = format_city_names_typeahead(cities);
      // use process var to async return results
      return process(cities_formatted);
    }
    return;
  },
  displayText: function (item) {
    return `${item.cityName} ${item.airportName} (${item.iataCode})`;
  },
  afterSelect: function(item){
    $("#destination_iataCode").val(item.iataCode);
  },
  autoSelect: true,
  delay: 500, // Wait 500ms before calling search_matching_cities
});

$("#oneWayFlight").on("change", function () {
  if ($("#oneWayFlight").is(":checked")) {
    $("#flightReturnDate").prop("disabled", true);
    $("#departureTime").prop("disabled", true);
  } else {
    $("#flightReturnDate").prop("disabled", false);
    $("#departureTime").prop("disabled", false);
  }
});

$("#addPassengerFlightBtn").on('click', function(){
    var list_continer = $("#passengerFlightSelectContainer");
    var passenger_list_item = $(`<li class="list-group-item" ></li>`);
    var passenger_label = $(`<label>Passenger</label>`);

    var passengerSelectElement = $(`<select class="form-control form-select" name="passenger_${passengerNumber}"></select>`);
    var option2 = $("<option></option>").val("SEATED_INFANT").text("Seated Infant");
    var option3 = $("<option></option>").val("CHILD").text("Child");
    var option4 = $("<option></option>").val("YOUNG").text("Young");
    var option5 = $("<option></option>").val("STUDENT").text("Student");
    var option6 = $("<option></option>").val("ADULT").text("Adult");
    var option7 = $("<option></option>").val("SENIOR").text("Senior");
    var option7 = $("<option selected hidden></option>").val("NONE").text("Select a Passenger");
    passengerSelectElement.append(option2, option3, option4, option5, option6, option7);

    var passenger_remove_btn = $(`<button type="button" class="form-control btn-outline-secondary"></button>`).text("Remove Passenger");
    passenger_remove_btn.on("click", function(){
        $(this).parent().remove();
    });

    passenger_list_item.append(passenger_label);
    passenger_list_item.append(passengerSelectElement);
    passenger_list_item.append(passenger_remove_btn);
    list_continer.append(passenger_list_item);
    passengerNumber++;
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
          return {
            cityName: item.address.cityName,
            iataCode: item.iataCode,
            airportName: item.name,
          };
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
