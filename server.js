'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');

const PORT = process.env.PORT;
const server = express();
server.use(cors());

server.get('/', (req, res) => {
    res.send('Working !!!')
})

server.get('/weather', (req, res) => {
    //get the city name from the user input (searchQuery)
    let searchQuery = req.query.city;
    console.log(searchQuery);

    //search for the city in the json file (instead of the API)
    const city = weather.find(city => {
        return city.city_name.toLocaleLowerCase() === searchQuery.toLocaleLowerCase()
    })
    // console.log('******', city);

    //create new objects for the new city  
    try {
        const weatherArray = city.data.map(day => new Forecast(day));
        res.status(200).send(weatherArray);
    } catch (err) {
        errHandler(err, response);
    }

})


function Forecast(day) {
    this.date = day.valid_date;
    this.description = day.weather.description;
}

function errHandler(err, response) {
    response.status(500).send(`something went wrong ==> ${error}`);
}

server.get('*', (request, response) => {
    response.status(404).send('not found');
})

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})