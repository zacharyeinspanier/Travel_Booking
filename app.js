import express from "express";
import path from "path";
import url from "url";
import bodyParser from "body-parser";
import { flight_search_data } from "./src/flight_search.js";
import { search_cities_airports } from "./src/amadeus_api.js";
import * as helpers from "./utils/ejs_helpers.js"

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

let flight_data;

// store flight here
// How will patch work?
// could use a update button

// if the user has submitted a POST request
// they are allowed to update their search critera
// PATCH will be able to do this
// However it will still be necessary to re-run the search

// The other option would be to garbage collect flight data every time the user presses search

app.get("/", (req, res) => {
  res.render("index.ejs");
  // TODO:
  // check if api key and api secrent are set, if not show an error message
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});
app.get("/flights", (req, res) => {
  var data = flight_search_data.get_flight_form_defaults();

  return res.render("flights.ejs", data);
});

app.get('/search/cityairports', async (req, res) => {
  try {
    //Which cities or airports with req.query.name
    const response = await search_cities_airports(req.query.name);
    return res.json(response.data);
  } catch (error) {
    return res.status(error.response.statusCode).send(error);
  }
});

app.get('/fetch/passengers',  (req, res) => {
  if(flight_data){
    const data = {
      passengers: flight_data.get_flight_passengers(),
      passenger_data_retrieved: true,
    };
    res.status(200).json(data);

  }else{
    const data = {
      passengers: [],
      passenger_data_retrieved: false
    };
    res.status(200).json(data);
  }
  
});

app.post("/search_for_flights", async (req, res) => {
  const now = new Date();
  var todayDate = now.toISOString().split("T")[0];
  flight_data = undefined;
  flight_data = new flight_search_data(req.body, todayDate);

  if(flight_data.flight_passengers == undefined){
    var info = "Please one or more add a passengers to this search."
    return res.render("flights.ejs", flight_search_data.get_flight_form_defaults(info));
  }

  // Return an info message to page, the origin or destination could not be found. 
  if(flight_data.destinationAirportName == "" ||flight_data.originAirportName == ""){
    var info = "Could not find airport or city. Please enter valid airport code or city location."
    return res.render("flights.ejs", flight_search_data.get_flight_form_defaults(info));
}

  // validate origin iataCode
  if(!flight_data.valid_origin){
    try{
      const response = await search_cities_airports(flight_data.originAirportName);
      flight_data.validate_origin_term(response.data);
    }catch (error){
      console.log(error);
      return res.render("error.ejs", {
        title: error.code,
        detail: error.description[0].detail,
        statusCode: error.description[0].status,
      });
    }
  }
  // validate destination iataCode
  if(!flight_data.valid_destination){
    try{
      const response = await search_cities_airports(flight_data.destinationAirportName);
      flight_data.validate_destination_term(response.data);
    }catch (error){
      console.log(error);
      return res.render("error.ejs", {
        title: error.code,
        detail: error.description[0].detail,
        statusCode: error.description[0].status,
      });
    }
  }
  // Return an info message to page, the origin or destination could not be found. 
  if(!flight_data.valid_origin ||!flight_data.valid_destination ){
      var info = "Could not find airport or city. Please enter valid airport code or city location."
      return res.render("flights.ejs", flight_search_data.get_flight_form_defaults(info));
  }
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