export class flight_search_data {
  constructor(flight_form_data, todayDate) {
    var oneWayIsChecked;
    var returnDate;
    var tempOriginFlightTime;
    var tempDepartureFlightTime;
    var originTimeRange;
    var departureTimeRange;
    var departueAllDayTimeRange;
    var originAllDayTimeRange;

    // One Way Flights
    if (
      flight_form_data.one_way == undefined ||
      flight_form_data.one_way == "" ||
      flight_form_data.one_way == "off"
    ) {
      oneWayIsChecked = false;
      returnDate = flight_form_data.departureFlightReturnDate;
    } else {
      oneWayIsChecked = true;
      returnDate = todayDate;
    }

    // set flgiht time and time range
    if (flight_form_data.originFlightTime == "all_day") {
      tempOriginFlightTime = "12:00:00";
      originTimeRange = "12H";
      originAllDayTimeRange = true;
    } else {
      tempOriginFlightTime = flight_form_data.originFlightTime;
      originTimeRange = "2H";
      originAllDayTimeRange = false;
    }
    if (flight_form_data.departureFlightTime == "all_day") {
      tempDepartureFlightTime = "12:00:00";
      departureTimeRange = "12H";
      departueAllDayTimeRange = true;
    } else {
      tempDepartureFlightTime = flight_form_data.departureFlightTime;
      departureTimeRange = "2H";
      departueAllDayTimeRange = false;
    }

    // Extract passengers and set id.
    var passengers = [];
    const passengerKeys = Object.keys(flight_form_data).filter((key) =>
      key.startsWith("passenger_")
    );
    if (passengerKeys.length != 0) {
      passengerKeys.forEach((key, index) => {
        passengers.push({
          id: index,
          travelerType: flight_form_data[key],
        });
      });
    } else {
      passengers = undefined;
    }

    // Form Data
    this.oneWayIsChecked = oneWayIsChecked;
    this.todayDate = todayDate;
    // Origin data
    this.originAirportName = flight_form_data.originAirportName;
    this.originAirportIataCode = flight_form_data.originAirportIataCode;
    this.originFlightDepartureDate = flight_form_data.originFlightDepartureDate;
    this.originFlightTime = tempOriginFlightTime;
    this.originTimeRange = originTimeRange;
    this.originAllDayTimeRange = originAllDayTimeRange;
    this.valid_origin =
      flight_form_data.originAirportIataCode == "" ? false : true;
    // Destination data
    this.destinationAirportName = flight_form_data.destinationAirportName;
    this.destinationAirportIataCode =
      flight_form_data.destinationAirportIataCode;
    this.departureFlightReturnDate = returnDate;
    this.departureFlightTime = tempDepartureFlightTime;
    this.departureTimeRange = departureTimeRange;
    this.departueAllDayTimeRange = departueAllDayTimeRange;
    this.valid_destination =
      flight_form_data.destinationAirportIataCode == "" ? false : true;

    this.flight_passengers = passengers;
  }

  get_flight_form_data() {
    return {
      // Form Data
      oneWayIsChecked: this.oneWayIsChecked,
      todayDate: this.todayDate,
      // Origin data
      originAirportName: this.originAirportName,
      originAirportIataCode: this.originAirportIataCode,
      originFlightDepartureDate: this.originFlightDepartureDate,
      originFlightTime: this.originFlightTime,
      originTimeRange: this.originTimeRange,
      originAllDayTimeRange: this.originAllDayTimeRange,
      // Destination data
      destinationAirportName: this.destinationAirportName,
      destinationAirportIataCode: this.destinationAirportIataCode,
      departureFlightReturnDate: this.departureFlightReturnDate,
      departureFlightTime: this.departureFlightTime,
      departureTimeRange: this.departureTimeRange,
      departueAllDayTimeRange: this.departueAllDayTimeRange,

    };
  }

  static get_flight_form_defaults(info) {
    const now = new Date();
    var todaysDate = now.toISOString().split("T")[0];
    return {
      oneWayIsChecked: "",
      todayDate: todaysDate,
      originAirportName: "",
      originAirportIataCode: "",
      originFlightDepartureDate: todaysDate,
      originAllDayTimeRange: true,
      destinationAirportName: "",
      destinationAirportIataCode: "",
      departureFlightReturnDate: todaysDate,
      departueAllDayTimeRange: true,
      info_message: info,
    };
  }

  get_flight_passengers(){
    return this.flight_passengers;
  }

  static get_default_passengers() {
    return [
      {
        id: "1",
        travelerType: "YOUNG",
      },
      {
        id: "2",
        travelerType: "ADULT",
      },
      {
        id: "3",
        travelerType: "SNEIOR",
      },
    ];
  }

  get_flight_data_amadeus() {
    // This function will format data for a amadeus api flight search

    var flight_search_req_data = {};
    flight_search_req_data["currencyCode"] = "USD";
    flight_search_req_data["sources"] = ["GDS"];
    flight_search_req_data["originDestinations"] = [];
    flight_search_req_data["travelers"] = [];

    if (this.oneWayIsChecked) {
      var flight_data = {
        id: "1",
        originLocationCode: this.originAirportIataCode,
        destinationLocationCode: this.destinationAirportIataCode,
        departureDateTimeRange: {
          date: this.originFlightDepartureDate,
          time: this.originFlightTime,
          timeWindow: this.originTimeRange,
        },
      };
      flight_search_req_data["originDestinations"].push(flight_data);
    } else {
      var flight_data_origin = {
        id: "1",
        originLocationCode: this.originAirportIataCode,
        destinationLocationCode: this.destinationAirportIataCode,
        departureDateTimeRange: {
          date: this.originFlightDepartureDate,
          time: this.originFlightTime,
          timeWindow: this.originTimeRange,
        },
      };

      var flight_data_destination = {
        id: "2",
        originLocationCode: this.destinationAirportIataCode,
        destinationLocationCode: this.originAirportIataCode,
        departureDateTimeRange: {
          date: this.departureFlightReturnDate,
          time: this.departureFlightTime,
          timeWindow: this.departureTimeRange,
        },
      };
      flight_search_req_data["originDestinations"].push(flight_data_origin);
      flight_search_req_data["originDestinations"].push(
        flight_data_destination
      );
    }

    for (var i = 0; i < this.flight_passengers.length; ++i) {
      var passenger = {
        id: this.flight_passengers[i].id.toString(),
        travelerType: this.flight_passengers[i].travelerType,
        fareOptions: ["STANDARD"],
      };
      flight_search_req_data["travelers"].push(passenger);
    }

    return flight_search_req_data;
  }

  validate_origin_term(response) {
    if (response.length <= 0) {
      this.valid_origin = false;
    } else {
      for (var i = 0; i < response.length; ++i) {
        if (response[i].subType == "AIRPORT") {
          this.valid_origin = true;
          this.originAirportIataCode = response[i].iataCode;
        }
      }
    }
  }
  validate_destination_term(response) {
    if (response.length <= 0) {
      this.valid_destination = false;
    } else {
      for (var i = 0; i < response.length; ++i) {
        if (response[i].subType == "AIRPORT") {
          this.valid_destination = true;
          this.destinationAirportIataCode = response[i].iataCode;
        }
      }
    }
  }
}
