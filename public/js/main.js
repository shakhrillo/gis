require([
"esri/Map",
"esri/views/MapView",
"esri/layers/BaseDynamicLayer",
"esri/widgets/LayerList"
], (Map, MapView, BaseDynamicLayer, LayerList) => {

// Define a custom dynamic layer that pulls WMS images
const CustomWMSLayer = BaseDynamicLayer.createSubclass({
    properties: {
    mapUrl: null,
    mapParameters: null
    },
    
    getImageUrl: function (extent, width, height){
    const urlVariables = this._prepareQuery(this.mapParameters, extent, width, height);
    const queryString = this._joinUrlVariables(urlVariables);
    console.log(`WMS Request URL: ${this.mapUrl}?${queryString}`);
    return this.mapUrl + "?" + queryString;
    },

    // Prepare query parameters for the URL to an image to be generated
    _prepareQuery: function (queryParameters, extent, width, height) {
    const wkid = extent.spatialReference.isWebMercator ? 3857 : extent.spatialReference.wkid;
    const replacers = {
        width: width,
        height: height,
        wkid: wkid,
        xmin: extent.xmin,
        xmax: extent.xmax,
        ymin: extent.ymin,
        ymax: extent.ymax
    };

    const urlVariables = this._replace({}, queryParameters, replacers);
    return urlVariables;
    },

    // replace the url variables with the application provided values
    _replace: (urlVariables, queryParameters, replacers) => {
    Object.keys(queryParameters).forEach((key) => {
        urlVariables[key] = Object.keys(replacers).reduce((previous, replacerKey) => {
        return previous.replace("{" + replacerKey + "}", replacers[replacerKey]);
        }, queryParameters[key]);
    });

    return urlVariables;
    },
    _joinUrlVariables: (urlVariables) => {
    return Object.keys(urlVariables).reduce((previous, key) => {
        return previous + (previous ? "&" : "") + key + "=" + urlVariables[key];
    }, "");
    }
});

// Create an instance of the custom layer
const wmsLayer = new CustomWMSLayer({
    mapUrl: "http://localhost:3030",
    mapParameters: {
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "GetMap",
    LAYERS: "1",
    STYLES: "",
    FORMAT: "image/png",
    TRANSPARENT: "TRUE",
    CRS: "EPSG:{wkid}",
    BBOX: "{xmin},{ymin},{xmax},{ymax}",
    WIDTH: "{width}",
    HEIGHT: "{height}"
    },
    // minScale: 20000000,
    title: "UK-Air Arsenic (WMS)"
});

// Initialize the map with the custom WMS layer
const map = new Map({
    basemap: "topo-vector",
    layers: [wmsLayer]
});

// Set up the view
const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-0.1276, 51.5074], // London
    zoom: 10
});

// Add layer list widget
const layerList = new LayerList({ view });
view.ui.add(layerList, "top-right");
});
