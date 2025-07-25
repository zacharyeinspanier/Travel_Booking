
export function one_way_changed(){
    console.log("one way");
    if($(this).is(":checked")){
        $("#flightReturnDate").prop("disabled", true);
        $("#departureTime").prop("disabled", true);
    }else{
        $("#flightReturnDate").prop("disabled", false);
        $("#departureTime").prop("disabled", false);
    }
}

export function add_new_passenger(passenger_number){
    var list_continer = $("#passengerFlightSelectContainer");
    var new_passenger = create_passenger_elements("NONE", passenger_number);
    list_continer.append(new_passenger);
    ++passenger_number;
    return passenger_number;
}
function create_passenger_elements(selected_option, passenger_number){
    // Elements
    var passenger_list_item = $(`<li></li>`);
    var passenger_label = $(`<label>Passenger</label>`);
    var passengerSelectElement = $("<select></select>");
    var option_1 = $("<option></option>").val("SEATED_INFANT").text("Seated Infant");
    var option_2 = $("<option></option>").val("CHILD").text("Child");
    var option_3 = $("<option></option>").val("YOUNG").text("Young");
    var option_4 = $("<option></option>").val("STUDENT").text("Student");
    var option_5 = $("<option></option>").val("ADULT").text("Adult");
    var option_6 = $("<option></option>").val("SENIOR").text("Senior");
    var option_7 = $("<option></option>").val("NONE").text("Select a Passenger");
    var passenger_remove_btn = $(`<button></button>`).text("Remove Passenger");
    // Classes
    passenger_list_item.addClass('list-group-item');
    passengerSelectElement.addClass('form-control', 'form-select');
    passenger_remove_btn.addClass('form-control', 'btn-outline-secondary');
    // Attributes
    passengerSelectElement.attr('name', `passenger_${passenger_number}`);
    passenger_remove_btn.attr('type', 'button');
    //Properties
    option_1.prop('selected', (selected_option == "SEATED_INFANT") ? true : false);
    option_2.prop('selected', (selected_option == "CHILD") ? true : false);
    option_3.prop('selected', (selected_option == "YOUNG") ? true : false);
    option_4.prop('selected', (selected_option == "STUDENT") ? true : false);
    option_5.prop('selected', (selected_option == "ADULT") ? true : false);
    option_6.prop('selected', (selected_option == "SENIOR") ? true : false);
    option_7.prop('selected', (selected_option == "NONE") ? true : false)
    option_7.prop('hidden', true);
    //Events
    passenger_remove_btn.on("click", function(){
        $(this).parent().remove();
    });
    // Add Elements to parent
    passengerSelectElement.append(option_1, option_2, option_3, option_4, option_5, option_6, option_7);
    passenger_list_item.append(passenger_label);
    passenger_list_item.append(passengerSelectElement);
    passenger_list_item.append(passenger_remove_btn);
    return passenger_list_item;
}

export function format_city_names_typeahead(results) {
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
