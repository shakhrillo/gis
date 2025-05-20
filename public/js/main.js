require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/LayerList",
    "js/CustomWMSLayer.js" // Import the custom WMS layer
], (Map, MapView, LayerList, CustomWMSLayer) => {

    // Create an instance of the custom layer
    const wmsLayerArsenic = new CustomWMSLayer({
        mapUrl: "http://localhost:3030/arsenic",
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

    const wmsLayerAq = new CustomWMSLayer({
        mapUrl: "http://localhost:3030/aq",
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
        title: "UK-Air AQ (WMS)"
    });

    // Initialize the map with the custom WMS layer
    const map = new Map({
        basemap: "topo-vector",
        layers: [
            wmsLayerArsenic,
            wmsLayerAq
        ]
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
