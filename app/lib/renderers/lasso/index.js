'use strict';

require('./menu');

const fillPolygon = require('./fill-polygon');
const PolygonLasso = require('./polygon-lasso');
const fs = require('fs');
const path = require('path');
const $ = require('jquery');
const data = require('electron').remote.require('data');
const _ = require('lodash');
const $inspector = $('.inspector');
const $imageText = $('#image-text');

function initInspector() {

    let iw = $inspector.width();
    let ih = $inspector.height();

    $inspector.css({
        'left': data.fit.width - iw - 10,
        'top': data.fit.height - ih - 10
    });

    $inspector.draggable({
        'containment': [10, 10, data.fit.width - iw - 10, data.fit.height - ih - 10],
        'scroll': false
    });

    $imageText.val(`The quick red fox jumps over the long white fence.`);

}

function getImageText() {
    return $imageText.val();
}

function createImage() {

    var $container = $('#container');

    $container.css({
        'width': data.fit.width,
        'height': data.fit.height
    });

    let $img = $(`<img src="file://${data.photo}">`);
    $img.css({
        'width': data.fit.width,
        'height': data.fit.height
    });
    $container.html($img);

    return $img;

//     return {
//         '$img': $img,
//         '$content': $content,
//         '$post': $post
//     };

}

function overlayImageText(text, poly) {

    let $content = $('.content');
    $content.html(text);

}

function createTextContainer($img) {

    let $content = $(`
        <div class="content">
        </div>
    `);

    let $post = $(`
        <div class="post">
        </div>
    `);

    $post.html($content);

    $post.css({
        'top': '10%',
        'left': '10%',
        'width': '40%',
        'height': '40%',
        'color': '#fff'
    });

    $img.after($post);

    return {
        '$post': $post,
        '$content': $content
    };

}

initInspector();

let $img = createImage();

let polygonLasso = new PolygonLasso($img);

polygonLasso.on('polygon_defined', (res) => {

    console.log('polygon_defined', res);

    if (!$('.post').size()) {
        createTextContainer($img);
    }

    let $post = $('.post');
    let $content = $('.content');
    let txt = getImageText();

    $content.html(`<p>${txt}</p>`);

    let css = _.cloneDeep(res.bounding);
    for (var k in css) {
        css[k] = css[k] + '%';
    }

    $post.css(css);

    fillPolygon($content, res.polygon);

    let metadata = `
---
top: ${res.bounding.top}
left: ${res.bounding.left}
width: ${res.bounding.width}
height: ${res.bounding.height}
polygon: ${JSON.stringify(res.polygon)}
textcolor: #fff
---
${txt}
    `;

data.metadata = metadata;

});
