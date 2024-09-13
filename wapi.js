const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000; // Use an environment variable for port number

// Create a logger instance
const winston = require('winston');
require('dotenv').config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
  ],
});

app.use(express.json());

// Middleware for logging incoming requests
const logRequest = (req, res, next) => {
  logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Middleware for CORS
const corsOptions = { origin: '*' };
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logRequest);

// API Endpoints
app.get('/', (req, res) => {
  logger.info('Received GET request at /');
  res.send('Welcome to WAPI!');
});

app.post('/weather', async (req, res) => {
  const cityName = req.query.param;
  if (!cityName) { // Validate cityName parameter
    return res.status(400).json({ error: 'Missing city name' });
  }

  logger.info("Getting weather data information");

  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) { // Check for API key existence
      return res.status(500).json({ error: 'OpenWeatherMap API key not set' });
    }

    const weatherResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    );
    const weatherData = weatherResponse.data;
    res.json(weatherData);
    logger.info("Received weather data information");
  } catch (error) {
    // Log error details
    console.error('Error fetching weather data:', error);
    logger.error(`Error fetching weather data: ${error.message}`);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = app; // Export the app instance
