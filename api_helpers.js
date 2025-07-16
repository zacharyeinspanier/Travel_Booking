export function format_flight_form_request(req) {
// TODO if round trip, return two sets of data
// 1: orgin -> destionation
// 2: destionation -> origin
  var data = {};
  data["currencyCode"] = "USD";

  if (req.body.one_way == "on") {
    data["originDestinations"] = [
      {
        id: "1",
        originLocationCode: req.body.origin,
        destinationLocationCode: req.body.destination,
        departureDateTimeRange: {
          date: req.body.flightDepartureDate,
        },
      },
    ];
  } else {
    data["originDestinations"] = [
      {
        id: "1",
        originLocationCode: req.body.origin,
        destinationLocationCode: req.body.destination,
        departureDateTimeRange: {
          date: req.body.flightDepartureDate,
        },
      },
      {
        id: "2",
        originLocationCode: req.body.destination,
        destinationLocationCode: req.body.origin,
        departureDateTimeRange: {
          date: req.body.flightReturnDate,
        },
      },
    ];
  }
  data["travelers"] = [
    {
      id: "1",
      travelerType: "ADULT",
    },
  ];
  data["sources"] = ["GDS"];
  return data;
}

export function extract_flightOffersSearch_data(data){
    res_data = [];

    // mainly would like to extract only the data I need
    // Also loop over itineraries for the departure time, arrivial time, origin, destination. 

    // used to look up the airline given a code
    // try {
    //     // What's the airline name for the IATA code BA?
    //     const response = await amadeus.referenceData.airlines.get({
    //       airlineCodes: "BA",
    //     });
    //     console.log(response);
    //   } catch (error) {
    //     console.error(error);
    //   }

    // use this to query airports in search bar
    // try {
    // Which cities or airports start with ’r'?
//     const response = await amadeus.referenceData.locations.get({
//         keyword: "r",
//         subType: Amadeus.location.any,
//       });
  
//       console.log(response);
//     } catch (error) {
//       console.error(error);
//     }
//   }

    // 1: oneWay
    // 2: numberOfBookableSeats
    // 3: origin 
    // 4: destination
    // 5: airline
    // 5: itineraries
    // 6: departure time and arrival time
    // 7: price
}
