import amadeus from "amadeus";

const amadeus_api = new amadeus({
    clientId: `${process.env.AMADEUS_API_KEY}`,
    clientSecret: `${process.env.AMADEUS_API_SECRET}`,
  });


export async function search_cities_airports(cityName){
    //Which cities or airports with cityName
    const response = await amadeus_api.referenceData.locations.get({
        keyword: cityName,
        subType: amadeus.location.any,
    });
    return response
}


  //var data = format_flight_form_request(req);
  //try {
  //   const response =
  //     await amadeus_api.shopping.flightOffersSearch.post(data);
  //   //console.log(response.data);
  //   // const jsonString = JSON.stringify(response.data, null, 2);
  //   // fs.writeFile("./flightdata.json", jsonString, (err) => {
  //   //   if (err) {
  //   //     console.error('Error writing file:', err);
  //   //   } else {
  //   //     console.log(`Dictionary successfully written to ${filePath} as JSON.`);
  //   //   }
  //   // });
  // } catch (error) {
  //   console.error(error);
  // }