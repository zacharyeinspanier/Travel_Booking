import express from "express";
import path from "path";
import url from "url";
import bodyParser from "body-parser";
import amadeus from "amadeus";

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

app.post("/search_for_flights", async (req, res) => {
  // 1: format data into object
  // 2: send request to api
  // 3: include response in render

  // For two way flights it may be best to send them as separate requests
  // 1: Resuls for origin -> destination
  // 2: User selects flight
  // 3: results for  destination -> origin
  
  var data = {};
  data["currencyCode"] = "USD";
  if (req.body.one - way == "ON") {
    data["originDestinations"] = [
      {
        id: "1",
        originLocationCode: req.body.origin,
        destinationLocationCode: req.body.destination,
        departureDateTime: {
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
        departureDateTime: {
          date: req.body.flightDepartureDate,
        },
      },
      {
        id: "2",
        originLocationCode: req.body.destination,
        destinationLocationCode: req.body.origin,
        departureDateTime: {
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

  try {
    const response =
      await amadeus_api.shopping.availability.flightAvailabilities.post(data);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
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
