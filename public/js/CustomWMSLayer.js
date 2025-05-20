define(["esri/layers/BaseDynamicLayer"], function (BaseDynamicLayer) {
    class CustomWMSLayer extends BaseDynamicLayer {
        constructor(options) {
            super(options);
            this.mapUrl = options.mapUrl;
            this.mapParameters = options.mapParameters;

            // Set title
            this.title = options.title || "Custom WMS Layer";
        }

        getImageUrl(extent, width, height) {
            const urlVariables = this._prepareQuery(this.mapParameters, extent, width, height);
            const queryString = this._joinUrlVariables(urlVariables);
            console.log(`WMS Request URL: ${this.mapUrl}?${queryString}`);
            return this.mapUrl + "?" + queryString;
        }

        _prepareQuery(queryParameters, extent, width, height) {
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
        }

        _replace(urlVariables, queryParameters, replacers) {
            Object.keys(queryParameters).forEach((key) => {
                urlVariables[key] = Object.keys(replacers).reduce((previous, replacerKey) => {
                    return previous.replace("{" + replacerKey + "}", replacers[replacerKey]);
                }, queryParameters[key]);
            });

            return urlVariables;
        }

        _joinUrlVariables(urlVariables) {
            return Object.keys(urlVariables).reduce((previous, key) => {
                return previous + (previous ? "&" : "") + key + "=" + urlVariables[key];
            }, "");
        }
    }

    return CustomWMSLayer;
});