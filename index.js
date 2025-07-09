import express from "express";
import path from "path";
import url from 'url';
const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(port, () =>{
    console.log(`app started on port ${port}`);
});