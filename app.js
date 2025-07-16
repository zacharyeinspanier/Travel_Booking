import express from "express";
import path from "path";
import url from "url";
import bodyParser from "body-parser";
import amadeus from "amadeus";
import { format_flight_form_request } from "./api_helpers.js";
import fs from "fs";

const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_KEY = process.env.AMADEUS_API_KEY;
const AIP_SECRET = process.env.AMADEUS_API_SECRET;

const amadeus_api = new amadeus({
  clientId: `${API_KEY}`,
  clientSecret: `${AIP_SECRET}`,
});

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
    flightDepartureDate: now.toISOString().split("T")[0],
    flightReturnDate: now.toISOString().split("T")[0],
  });
});

app.get('/search/cityairports', async (req, res) => {

  try {
    //Which cities or airports with req.query.name
    const response = await amadeus_api.referenceData.locations.get({
      keyword: req.query.name,
      subType: amadeus.location.any,
    });
      return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
});

app.post("/search_for_flights", async (req, res) => {
  // 1: format data into object
  // 2: send request to api
  // 3: include response in render

  // For two way flights it may be best to send them as separate requests
  // 1: Resuls for origin -> destination
  // 2: User selects flight
  // 3: results for  destination -> origin

  
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
  const now = new Date();
  res.render("flights.ejs", {
    todayDate: req.body.todayDate,
    flightDepartureDate: req.body.flightDepartureDate,
    flightReturnDate: req.body.flightReturnDate,
  });
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
