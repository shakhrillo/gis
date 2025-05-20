const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: '*'
}));

app.get('/arsenic', (req, res) => {
  const baseUrl = 'https://ukair.maps.rcdo.co.uk/ukairserver/services/aq_amb_2022/Arsenic_viridis/MapServer/WMSServer';
  
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = baseUrl + (queryString ? `?${queryString}` : '');

  request(targetUrl).pipe(res);
});

// https://ukair.maps.rcdo.co.uk/ukairserver/services/aq_amb_2022/BaP_viridis/MapServer/WMSServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities
app.get('/aq', (req, res) => {
  const baseUrl = 'https://ukair.maps.rcdo.co.uk/ukairserver/services/aq_amb_2022/BaP_viridis/MapServer/WMSServer';
  
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
