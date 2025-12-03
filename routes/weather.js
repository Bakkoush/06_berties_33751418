const express = require('express');
const router = express.Router();
const request = require('request');

// ROUTE 1: Show form (weather.ejs)
router.get('/', (req, res) => {
  res.render("weather", { weather: null, error: null });
});

// ROUTE 2: Get weather for user-entered city
router.get('/now', (req, res, next) => {

  // Get city name from form, default to "london"
  let city = req.query.city || "london";

  // Your API key (assignment requires hardcoding)
  let apiKey = '662c7169479f4debef3e70d273dcc0b1';

  // Build URL
  let url =
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  // Make API request
  request(url, function (err, response, body) {
    if (err) {
      return res.render("weather", {
        weather: null,
        error: "Error contacting the weather service."
      });
    }

    let weather;

    // Try parsing JSON safely
    try {
      weather = JSON.parse(body);
    } catch (e) {
      return res.render("weather", {
        weather: null,
        error: "Invalid response from API."
      });
    }

    // Error handling for missing/invalid city
    if (!weather || !weather.main) {
      return res.render("weather", {
        weather: null,
        error: `No weather data found for "${city}".`
      });
    }

    // Success — pass weather data to EJS view
    res.render("weather", {
      weather: weather,
      error: null
    });
  });
});

module.exports = router;
