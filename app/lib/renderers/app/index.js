'use strict';

const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;

ipcRenderer.on('photo-response', (e, res) => {
    switch (res) {
        case 'invalid-file':
            dialog.showErrorBox('Invalid File', 'The file you provided is not supported.');
        break;
    }
});

const dropper = document.getElementById('dropper');

dropper.ondragover = () => {
    return false;
};

dropper.ondragleave = dropper.ondragend = () => {
    return false;
};

dropper.ondrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    ipcRenderer.send('photo-dropped', file.path);
    return false;
};
