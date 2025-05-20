const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();

// Allow your frontend origin explicitly or '*'
app.use(cors({
    // origin: 'http://localhost:5173', // Change to your frontend origin OR
    origin: '*' // wildcard if you want to allow all origins
}));

// Handle preflight OPTIONS requests properly
// app.options('*', cors());

// Handle all GET requests
app.get('/', (req, res) => {
  // Compose the target URL with query params from original request
  const baseUrl = 'https://ukair.maps.rcdo.co.uk/ukairserver/services/aq_amb_2022/Arsenic_viridis/MapServer/WMSServer';
  
  // Build query string from req.query
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = baseUrl + (queryString ? `?${queryString}` : '');

  // Pipe the proxied response back to client
  request(targetUrl).pipe(res);
});

// load index.html
app.get('/map', (req, res) => {
  res.sendFile(__dirname + '/templates/map.html');
});

app.listen(3030, () => {
  console.log('Server is running on http://localhost:3030');
});
