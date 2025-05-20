const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
  const baseUrl = 'https://ukair.maps.rcdo.co.uk/ukairserver/services/aq_amb_2022/Arsenic_viridis/MapServer/WMSServer';
  
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = baseUrl + (queryString ? `?${queryString}` : '');

  request(targetUrl).pipe(res);
});

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'map.html'));
});

app.listen(3030, () => {
  console.log('Server is running on http://localhost:3030');
});
