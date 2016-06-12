'use strict';

const $ = require('jquery');
const data = require('electron').remote.require('data');
const EventEmitter = require('eventemitter3');
const _ = require('lodash');
let $body = $('body');

///////

var svg;
var brush;

let d3 = require('d3-custom');

var initPoly = function($container) {

    var w = $container.width();
    var h = $container.height();

    svg = d3.select($container[0]).append('svg')
      .attr("width", w)
      .attr("height", h);

        brush = d3.svg.polybrush()
        .x(d3.scale.linear().range([0, w]))
        .y(d3.scale.linear().range([0, h]))
        .on("brushstart", function() {
          svg.selectAll(".selected").classed("selected", false);
        })
        .on("brush", function() {
          // set the 'selected' class for the circle
          svg.selectAll(".point").classed("selected", function(d) {
            //get the associated circle
            var id = d3.select(this).attr("id");
            var i = id.substr(id.indexOf("-")+1, id.length);
            var vornoi = d3.select("#path-"+i);
            // set the 'selected' class for the path
            if (brush.isWithinExtent(d[0], d[1])) {
              vornoi.classed("selected", true);
              return true;
            } else {
              vornoi.classed("selected", false);
              return false;
            }
          });
        });

      svg.append("svg:g")
        .attr("class", "brush")
        .call(brush);

    return brush;

};

var submit = () => {

    var coords = brush.extent();
//     var text = $textEditor.val();
    var text = "Hello, world.";
    var $extent = $('.extent');
    console.log('$extent', $extent);
    var w = $extent[0].getBoundingClientRect().width;
    var h = $extent[0].getBoundingClientRect().height;
    var pos = $extent.position();
    var ratio = data.fit.scale;
    var size = data.fit;

    var extentPos = $extent.position();
    console.log('extentPos', extentPos);

    var extentCoords = [];
    extentCoords[0] = {
        'x': extentPos.left,
        'y': extentPos.top
    };
    extentCoords[1] = {
        'x': extentPos.left + w,
        'y': extentPos.top
    };
    extentCoords[2] = {
        'x': extentPos.left,
        'y': extentPos.top + h
    };
    extentCoords[4] = {
        'x': extentPos.left + w,
        'y': extentPos.top + h
    };

    console.log('extentCoords', extentCoords);

//     coords = coords.map((coord) => {
//         return {
//             'x': coord[0] * ratio,
//             'y': coord[1] * ratio
//         };
//     });

    coords = coords.map((coord) => {
        return {
            'x': coord[0],
            'y': coord[1]
        };
    });

    // Make them relative to the extent box
    coords = coords.map((coord) => {
        coord.x = coord.x - extentPos.left;
        coord.y = coord.y - extentPos.top;
        return coord;
    });

    // Calc % relative to extent box
    coords = coords.map((coord) => {
        coord.x = coord.x / w * 100;
        coord.y = coord.y / h * 100;
        return coord;
    });

    console.log('coords1', coords);

//     coords = coords.map((coord) => {
//         coord.x = parseInt(coord.x * ratio, 10);
//         coord.y = parseInt(coord.y * ratio, 10);
//         return coord;
//     });

//     coords = coords.map((coord) => {
//         coord.x = coord.x / size.width * 100;
//         coord.y = coord.y / size.height * 100;
//         return coord;
//     });

    console.log('pos', pos);
    console.log('coords', coords);
    console.log('submit', text, coords);
    console.log('ratio', ratio);
    console.log('w', w);
    console.log('h', h);

//     pos.top = parseInt(pos.top * ratio, 10);
//     pos.left = parseInt(pos.left * ratio, 10);
//     w = parseInt(w * ratio, 10);
//     h = parseInt(h * ratio, 10);

    pos.top = pos.top * ratio;
    pos.left = pos.left * ratio;
    w = w * ratio;
    h = h * ratio;

    pos.top = pos.top / size.height * 100;
    pos.left = pos.left / size.width * 100;
    w = w / size.width * 100;
    h = h / size.height * 100;

    var polygon = JSON.stringify(coords);

    var yaml = `
---
top: ${pos.top}
left: ${pos.left}
width: ${w}
height: ${h}
polygon: ${polygon}
textcolor: #ffffff
---
${text}
    `;

    console.log(yaml);

};

class PolygonLasso extends EventEmitter {

    constructor($img) {

        super();

        this.$img = $img;

        let offset = $img.offset();

        let $outerChart = $(`<div id='outer-chart'><div id='inner-chart'></div></div>`);
        $outerChart.css({
            'left': offset.left,
            'top': offset.top,
            'height': data.fit.height,
            'width': data.fit.width
        });

        $body.append($outerChart);
        let $innerChart = $('#inner-chart');
        $innerChart.css({
            'height': data.fit.height,
            'width': data.fit.width
        });
        this.brush = initPoly($innerChart);

        brush.on('brushend', () => {
            this.emit('polygon_defined', {
//                 'extent_coords': this.getExtentCoords(),
//                 'extent_coords_percentage': this.getExtentCoordsPercentage(),
//                 'polygon_coords': this.getPolygonCoords(),
//                 'absolute_polygon_coords': this.getAbsolutePolygonCoords(),
                'bounding': this.getBoundingInfo(true),
                'polygon': this.getPolygonInfo(true)
//                 'percentage_bounding_info': this.getPercentageBoundingInfo()
            });
        });

    }

    getExtentCoords() {

        let coords = this.brush.extent();
        let $extent = $('.extent');
        let w = $extent[0].getBoundingClientRect().width;
        let h = $extent[0].getBoundingClientRect().height;
        let pos = $extent.position();

        return [
            [pos.left, pos.top],
            [pos.left + w, pos.top],
            [pos.left, pos.top + h],
            [pos.left + w, pos.top + h]
        ];

    }

    getExtentCoordsPercentage() {

        let coords = this.brush.extent();
        let $extent = $('.extent');
        let w = $extent[0].getBoundingClientRect().width;
        let h = $extent[0].getBoundingClientRect().height;
        let pos = $extent.position();
        let ratio = data.fit.scale;
        let size = data.fit;
        let $imgw = this.$img.width();
        let $imgh = this.$img.height();

        // var extentPos = $extent.position();
        let extentPos = $extent.offset();
        extentPos.top -= 10;
        extentPos.left -= 10;
        console.log('t/l', extentPos.top, extentPos.left);
        extentPos.top = Math.round(extentPos.top / $imgh * 100);
        extentPos.left = Math.round(extentPos.left / $imgw * 100);
        extentPos.width = Math.round(w / $imgw * 100);
        extentPos.height = Math.round(h / $imgh * 100);

        /*
        Return: bounding box: top, left, width, height (percentages)
        */

        return extentPos;

    }

    getPercentageBoundingInfo() {

        console.log('data', data);

        let absInfo = this.getAbsoluteBoundingInfo();

    }

    getPolygonInfo(perc) {

        let boundingInfo = this.getBoundingInfo();
        let e = this.brush.extent();

        e = e.map((coords) => {
            return {
                'x': coords[0] - boundingInfo.left,
                'y': coords[1] - boundingInfo.top
            };
        });

        if (!perc) {
            return e;
        }

        e = e.map((coords) => {
            coords.x = Math.round(coords.x / boundingInfo.width * 100);
            coords.y = Math.round(coords.y / boundingInfo.height * 100);
            return coords;
        });

        return e;

    }

    getBoundingInfo(perc) {

        let $extent = $('.extent');
        let bcr = $extent[0].getBoundingClientRect();
        let res = {};
        res.top = bcr.top;
        res.left = bcr.left;
        res.width = bcr.width;
        res.height = bcr.height;

        if (!perc) {
            return res;
        }

        console.log('data', data);
        // data.fit.height, data.fit.width, data.fit.scale
        // console.log('...res', _.cloneDeep(res));

        res.top = res.top / data.fit.height * 100;
        res.left = res.left / data.fit.width * 100;
        res.height = res.height / data.fit.height * 100;
        res.width = res.width / data.fit.width * 100;

        for (var k in res) {
            res[k] = Math.round(res[k]);
        }

        return res;

    }

    getAbsolutePolygonCoords() {

        return this.brush.extent();

    }

// Everything is in percentages:
// ---
// top: 25
// left: 54
// width: 27
// height: 30
// polygon: [{"x":0,"y":35},{"x":26,"y":0},{"x":100,"y":9},{"x":94,"y":100},{"x":24,"y":96}]
// textcolor: #ff9518
// ---

    getPolygonCoords() {

        let coords = this.brush.extent();
        let $extent = $('.extent');
        let w = $extent[0].getBoundingClientRect().width;
        let h = $extent[0].getBoundingClientRect().height;
        let pos = $extent.position();
        let ratio = data.fit.scale;
        let size = data.fit;

        // var extentPos = $extent.position();
        let extentPos = $extent.offset();
        extentPos.top -= 10;
        extentPos.left -= 10;

        // let $x = $(`<div></div>`);
        // $x.css({
        //     'width': 10,
        //     'height': 10,
        //     'background-color': '#fff',
        //     'position': 'absolute',
        //     'left': extentPos.left,
        //     'top': extentPos.top
        // });
        // $('#inner-chart').append($x);

        var extentCoords = [];
        extentCoords[0] = {
            'x': extentPos.left,
            'y': extentPos.top
        };
        extentCoords[1] = {
            'x': extentPos.left + w,
            'y': extentPos.top
        };
        extentCoords[2] = {
            'x': extentPos.left,
            'y': extentPos.top + h
        };
        extentCoords[4] = {
            'x': extentPos.left + w,
            'y': extentPos.top + h
        };

        console.log('extentCoords', extentCoords);

    //     coords = coords.map((coord) => {
    //         return {
    //             'x': coord[0] * ratio,
    //             'y': coord[1] * ratio
    //         };
    //     });

        coords = coords.map((coord) => {
            return {
                'x': coord[0],
                'y': coord[1]
            };
        });

        // Make them relative to the extent box
        coords = coords.map((coord) => {
            coord.x = coord.x - extentPos.left;
            coord.y = coord.y - extentPos.top;
            return coord;
        });

        // Calc % relative to extent box
        coords = coords.map((coord) => {
            coord.x = coord.x / w * 100;
            coord.y = coord.y / h * 100;
            return coord;
        });

        coords = coords.map((coord) => {
            coord.x = Math.round(coord.x);
            coord.y = Math.round(coord.y);
            return coord;
        });

        return coords;

    }

}

module.exports = PolygonLasso;
