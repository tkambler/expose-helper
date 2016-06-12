'use strict';

module.exports = (grunt) => {

    let os = require('os');
    let path = require('path');
    let spawn = require('child_process').spawn;

    grunt.registerTask('launch', function() {

        let done = this.async();

        let electronBinary;

        switch (os.platform()) {
            case 'darwin':
                electronBinary = path.resolve('node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron');
            break;
            case 'win32':
                electronBinary = path.resolve('node_modules/electron-prebuilt/dist/electron.exe');
            break;
        }

        switch (os.platform()) {

            case 'darwin':
            case 'win32':

                let spawned = spawn(electronBinary, [
                    '.'
                ], {
                    'cwd': 'app',
                    'env': {
                        'ELECTRON_ENABLE_LOGGING': 1,
                        'ELECTRON_ENABLE_STACK_DUMPING': 1
                    }
                });

                spawned.stdout.on('data', (data) => {
                    grunt.log.writeln(data);
                });

                spawned.stderr.on('data', (data) => {
                    grunt.log.writeln(data);
                });

                spawned.on('close', (code) => {
                    if (code !== 0) {
                        return grunt.fail.fatal(new Error('Electron exited with status code: ' + code.toString()));
                    }
                    done();
                });

            break;

            default:
                return grunt.fail.fatal(new Error(`Unknown platform: ${os.platform()}`));
            break;

        }

    });

};
