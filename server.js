'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const weather = require('./data/weather.json');
const axios = require('axios');


const PORT = process.env.PORT;
const server = express();
server.use(cors());

server.get('/', (req, res) => {
    res.send('Working !!!')
})

//LAB 07
// server.get('/weather', (req, res) => {
//     //get the city name from the user input (searchQuery)
//     let searchQuery = req.query.city;
//     console.log(searchQuery);

//     //search for the city in the json file (instead of the API)
//     const city = weather.find(city => {
//         return city.city_name.toLocaleLowerCase() === searchQuery.toLocaleLowerCase()
//     })
//     // console.log('******', city);

//     //create new objects for the new city  
//     try {
//         const weatherArray = city.data.map(day => new Forecast(day));
//         res.status(200).send(weatherArray);
//     } catch (err) {
//         errHandler(err, response);
//     }
// })

// http://localhost:3000/weather?searchQuery=amman
server.get('/weather',handleWeather);
server.get('/movie',handleMovies);


function handleWeather(request,response){
    let { searchQuery } = request.query;

    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${process.env.WEATHER_PRIVATE_KEY}`;

    axios.get(url)
        .then(results => {
            // console.log('**************', results.data);
            const weatherArray = results.data.data.map(day => new Forecast(day));
            response.status(200).send(weatherArray);
        })
        .catch(error => {
            errHandler(error, response);
        })
}


function handleMovies(request,response){
    let { searchQuery } = request.query;
    // console.log(searchQuery)
    // console.log(process.env.MOVIE_API_KEY)
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&language=de-DE&region=DE`;


    axios.get(url)
        .then(results => {
            console.log('********', results.data);
            const moviesArray = results.data.results.map(movie => new Movie(movie));
            response.status(200).send(moviesArray);
        })
        .catch(error => {
            errHandler(error, response);
        })
}






function Forecast(day) {
    this.date = day.valid_date;
    this.description = day.weather.description;
}

class Movie {
    constructor(movie) {
        this.title = movie.title;
        this.overview = movie.overview;
        this.averageVotes = movie.vote_average;
        this.totalVotes = movie.vote_count;
        this.imageUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
        this.popularity = movie.popularity;
        this.releasedOn = movie.release_date;

    }
}



function errHandler(err, response) {
    response.status(500).send(`something went wrong ==> ${err}`);
}

server.get('*', (request, response) => {
    response.status(404).send('not found');
})

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})