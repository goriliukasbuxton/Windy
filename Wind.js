define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
   // 'dijit/_TemplatedMixin',
    //'dijit/_WidgetsInTemplateMixin',
    './Wind/plugins/RasterLayer',
    //'dojo/text!./Wind/templates/Wind.html',
   'dojo/dom',
    'dojo/on',
    'dojo/topic',
    'esri/domUtils', 'esri/request',
    'dojo/number', 'dojo/json',
    'dijit/registry',
    'dojo/domReady!'
], function (
    declare,
    _WidgetBase,
    //_TemplatedMixin,
    //_WidgetsInTemplateMixin,
    RasterLayer,
   // template,
    dom,
    on, topic, domUtils, esriRequest, number, JSON, registry
) {

    return declare([_WidgetBase,// _TemplatedMixin,
       // _WidgetsInTemplateMixin
    ], {

        //widgetsInTemplate: true,
        //templateString: template,
        canvas:  null,
        postCreate: function () {
            this.inherited(arguments);
            map = this.map;
            canvasSupport = this.supports_canvas();
            this.init();

            
        },
        init: function(){
            // Add raster layer
            if (canvasSupport) {
                rasterLayer = new RasterLayer(null, {
                    opacity: 0.75
                });
                map.addLayer(rasterLayer);

                map.on("extent-change", redraw);
                map.on("resize", function () { });
                map.on("zoom-start", redraw);
                map.on("pan-start", redraw);
                datagfs = './js/gis/dijit/Wind/data/gfs.json'
                //console.log(data);
                var layersRequest = esriRequest({
                    url: datagfs,
                    content: {},
                    handleAs: "json"
                });


                layersRequest.then(
                  function (response) {
                      console.log(response);
                      windy = new Windy({ canvas: rasterLayer._element, data: response });
                      redraw();
                  }, function (error) {
                      console.log("Error: ", error.message);
                  });
            } else {
                console.log("This browser doesn't support canvas");
                //dom.byId("mapCanvas").innerHTML = "This browser doesn't support canvas. Visit <a target='_blank' href='http://www.caniuse.com/#search=canvas'>caniuse.com</a> for supported browsers";
            }

            function redraw() {
                rasterLayer._element.width = map.width;
                rasterLayer._element.height = map.height;
                windy.stop();
                var extent = map.geographicExtent;
                setTimeout(function () {
                    windy.start(
                      [[0, 0], [map.width, map.height]],
                      map.width,
                      map.height,
                      [[extent.xmin, extent.ymin], [extent.xmax, extent.ymax]]
                    );
                }, 500);
            }
        },
        supports_canvas: function () {
            return !!document.createElement("canvas").getContext;
        }


    })

});
