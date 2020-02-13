const express = require('express');
const app = express();
const winston = require('winston'),
    expressWinston = require('express-winston');

app.listen(9090);
app.use(express.static('public'));

let fetch = require('node-fetch');
let locations = {};
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));


app.get("/map_location", (req, res) => {
    let searchQuery = req.query.search;
    if (locations[searchQuery]) {
        res.json(locations[searchQuery])
    } else {
        fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchQuery}&inputtype=textquery&fields=geometry&key=AIzaSyDRvI-prQUfvq-J1UkILWYnIS2ssTh3Ze4`)
            .then(response => response.json())
            .then(response => {
                locations[searchQuery] = response;
                res.json(response);
            });
    }

});
