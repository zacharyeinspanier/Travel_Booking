import express from "express";
import path from "path";
import url from 'url';
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended : true }));

app.get('/', (req, res) => {
    res.render("index.ejs")
});
app.get('/about', (req, res) => {
    res.render("about.ejs")
});
app.get('/flights', (req, res) => {
    res.render("flights.ejs")
});

app.get('/hotels', (req, res) => {
    res.render("hotels.ejs")
});

app.post('/search_for_flights', (req, res) => {
    console.log(req.body);
    res.render("flights.ejs")
});

app.post('/search_for_hotels', (req, res) => {
    console.log(req.body);
    res.render("hotels.ejs")
});

app.listen(port, () =>{
    console.log(`app started on port ${port}`);
});