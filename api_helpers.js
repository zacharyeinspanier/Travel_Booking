

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
