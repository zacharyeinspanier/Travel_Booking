import express from "express";
import path from "path";
import url from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
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

app.post("/search_for_flights", (req, res) => {
    const now = new Date();
    res.render("flights.ejs", {
      todayDate: now.toISOString().split("T")[0],
      flightDepartureDate: req.body.flightDepartureDate,
      flightReturnDate: req.body.flightReturnDate,
    });
  });

app.get("/hotels", (req, res) => {
  const now = new Date();
  res.render("hotels.ejs", {
    todayDate: now.toISOString().split("T")[0],
    hotelCheckInDate:  now.toISOString().split("T")[0],
    hotelCheckOutDate:  now.toISOString().split("T")[0],
  });
});

app.post("/search_for_hotels", (req, res) => {
  const now = new Date();
  res.render("hotels.ejs", {
    todayDate: now.toISOString().split("T")[0],
    hotelCheckInDate: req.body.hotelCheckInDate,
    hotelCheckOutDate: req.body.hotelCheckOutDate,
  });
});

app.listen(port, () => {
  console.log(`app started on port ${port}`);
});
