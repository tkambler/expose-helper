'use strict';

let path = require('path');
require('module').globalPaths.push(path.join(__dirname, 'lib'));

require('renderers/app');
