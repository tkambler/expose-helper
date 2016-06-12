'use strict';

let Promise = require('bluebird');
let sizeOf = require('image-size');
module.exports = Promise.promisify(sizeOf, {
    'context': sizeOf
});
