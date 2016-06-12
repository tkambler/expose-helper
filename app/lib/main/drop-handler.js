'use strict';

const {ipcMain} = require('electron');
const mime = require('mime');
const EventEmitter = require('eventemitter3');
const validMimeTypes = ['image/jpeg', 'image/png'];

class DropHandler extends EventEmitter {

    constructor() {
        super();
        this._listen();
    }

    _listen() {
        ipcMain.on('photo-dropped', (e, photoPath) => {
            let mimeType = mime.lookup(photoPath);
            if (validMimeTypes.indexOf(mimeType) < 0) {
                e.sender.send('photo-response', 'invalid-file');
            } else {
                this.emit('dropped', photoPath);
            }
        });
    }

}

module.exports = DropHandler;
