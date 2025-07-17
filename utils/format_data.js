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