import express from "express";
import path from "path";
import url from "url";
import bodyParser from "body-parser";

import { search_cities_airports } from "./src/amadeus_api.js";


const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// The following is an example of how to search for flights:
// https://github.com/amadeus4dev/amadeus-code-examples
// amadeus_api.shopping.flightOffersSearch
// .get({
//   originLocationCode: "SYD",
//   destinationLocationCode: "BKK",
//   departureDate: "2025-11-01",
//   adults: "2",
// })
// .then(function (response) {
//   console.log(response.data);
// })
// .catch(function (responseError) {
//   console.log("Error");
//   console.log(responseError);
// });

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
  // TODO:
  // check if api key and api secrent are set, if not show an error message
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});
app.get("/flights", (req, res) => {
  const now = new Date();
  const start = res.render("flights.ejs", {
    todayDate: now.toISOString().split("T")[0],
    originFlightDepartureDate: now.toISOString().split("T")[0],
    departureFlightReturnDate: now.toISOString().split("T")[0],
  });
});

app.get('/search/cityairports', async (req, res) => {

  try {
    //Which cities or airports with req.query.name
    const response = await search_cities_airports(req.query.name);
    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
});

app.post("/search_for_flights", async (req, res) => {
  const now = new Date();
  var todayDate = now.toISOString().split("T")[0];
  var oneWayIsChecked;
  var returnDate;
  if(req.body.one_way == undefined){
    oneWayIsChecked = false;
    returnDate = req.body.departureFlightReturnDate;

  }else{
    oneWayIsChecked = true;
    returnDate = todayDate;
  }

  var flight_data = {
    oneWayIsChecked: oneWayIsChecked,
    originAirportName: req.body.originAirportName,
    originAirportIataCode: req.body.originAirportIataCode,
    originFlightDepartureDate: req.body.originFlightDepartureDate,
    destinationAirportName: req.body.destinationAirportName,
    destinationAirportIataCode: req.body.destinationAirportIataCode,
    departureFlightReturnDate: returnDate,
    todayDate: todayDate,
  }

  // validate airports if the iataCode was not provided
  var valid_origin = false;
  var valid_destination = false;
  if(flight_data.originAirportIataCode == ""){
    var origin_iataCode = await validate_airport_search(flight_data.originAirportName);
    if(origin_iataCode != undefined){
      flight_data.originAirportIataCode = origin_iataCode;
      valid_origin = true;
    }
  }else{
    valid_origin = await validate_iataCode(flight_data.originAirportIataCode);
  }

  if(flight_data.destinationAirportIataCode == ""){
    var destination_iataCode = await validate_airport_search(flight_data.destinationAirportName);
    if(destination_iataCode != undefined){
      flight_data.destinationAirportIataCode = destination_iataCode;
      valid_destination = true;
    }
  }else{
    valid_destination = await validate_iataCode(flight_data.destinationAirportIataCode);
  }

  if(!valid_origin ||!valid_destination ){
      var info = "Could not find airport or city. Please enter valid airport location or code."
      return res.render("flights.ejs", {
        todayDate: now.toISOString().split("T")[0],
        originFlightDepartureDate: now.toISOString().split("T")[0],
        departureFlightReturnDate: now.toISOString().split("T")[0],
        info_message: info,
      });
  }

  // 

  // 1: format data into object
  // 2: send request to api
  // 3: include response in render

  // For two way flights it may be best to send them as separate requests
  // 1: Resuls for origin -> destination
  // 2: User selects flight
  // 3: results for  destination -> origin

  res.render("flight_search_results.ejs", flight_data);
});

app.get("/hotels", (req, res) => {
  const now = new Date();
  res.render("hotels.ejs", {
    todayDate: now.toISOString().split("T")[0],
    hotelCheckInDate: now.toISOString().split("T")[0],
    hotelCheckOutDate: now.toISOString().split("T")[0],
  });
});

app.post("/search_for_hotels", async (req, res) => {
  const now = new Date();
  res.render("hotels.ejs", {
    todayDate: req.body.todayDate,
    hotelCheckInDate: req.body.hotelCheckInDate,
    hotelCheckOutDate: req.body.hotelCheckOutDate,
  });
});


app.listen(port, () => {
  console.log(`app started on port ${port}`);
});

async function validate_airport_search(user_search){
  // return the first matching code
  // this would return an iataCode

  try{
    // TODO: we could also check for the text value they entered. 
    // city_name: los angles 
    let response = await search_cities_airports(user_search);
    if(response.data.length <= 0){
      return undefined;
    }else{

      for(var i  = 0; i < response.data.length; ++i){
        if(response.data[i].subType == "AIRPORT"){
          return response.data[i].iataCode;
        }
      }
      return undefined;
    }
  }catch (error){
    return error;
  }
}


async function validate_iataCode(iataCode){

  try{
    // TODO: we could also check for the text value they entered. 
    // city_name: los angles 
    let response = await search_cities_airports(iataCode);
    if(response.data.length <= 0){
      return false
    }else{

      for(var i  = 0; i < response.data.length; ++i){
        if(response.data[i].iataCode == iataCode){
          return true;
        }
      }
      return false
    }
  }catch (error){
    return error;
  }
}
