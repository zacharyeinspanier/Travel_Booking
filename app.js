import express from "express";
import path from "path";
import url from "url";
import bodyParser from "body-parser";
import { flight_search_data } from "./src/flight_search.js";
import { search_cities_airports } from "./src/amadeus_api.js";


const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// The following is an example of how to search for flights:
// timeWindow: 2H
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

  const flight_data = new flight_search_data(req.body, todayDate);

  if(flight_data.flight_passengers == undefined){
    var info = "Please one or more add a passengers to this search."
    return res.render("flights.ejs", {
      todayDate: now.toISOString().split("T")[0],
      originFlightDepartureDate: now.toISOString().split("T")[0],
      departureFlightReturnDate: now.toISOString().split("T")[0],
      info_message: info,
    });
  }

  // Return an info message to page, the origin or destination could not be found. 
  if(flight_data.destinationAirportName == "" ||flight_data.originAirportName == ""){
    var info = "Could not find airport or city. Please enter valid airport code or city location."
    return res.render("flights.ejs", {
      todayDate: now.toISOString().split("T")[0],
      originFlightDepartureDate: now.toISOString().split("T")[0],
      departureFlightReturnDate: now.toISOString().split("T")[0],
      info_message: info,
    });
}

  // validate origin iataCode
  if(!flight_data.valid_origin){
    try{
      const response = await search_cities_airports(flight_data.originAirportName);
      flight_data.validate_origin_term(response.data);
    }catch (error){
      console.log(error);
      return res.status(500).send(error.message);
    }
  }
  // validate destination iataCode
  if(!flight_data.valid_destination){
    try{
      const response = await search_cities_airports(flight_data.destinationAirportName);
      flight_data.validate_destination_term(response.data);
    }catch (error){
      console.log(error);
      return res.status(500).send(error.message);
    }
  }
  // Return an info message to page, the origin or destination could not be found. 
  if(!flight_data.valid_origin ||!flight_data.valid_destination ){
      var info = "Could not find airport or city. Please enter valid airport code or city location."
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

  res.render("flight_search_results.ejs", flight_data.get_flight_form_data());
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