"use strict";

var packager = require('electron-packager');
const pkg = require('./package.json');
const argv = require('minimist')(process.argv.slice(2));
const devDeps = Object.keys(pkg.devDependencies);

const appName = argv.name || pkg.productName;
const shouldUseAsar = argv.asar || false;
const shouldBuildAll = argv.all || false;
const arch = argv.arch || 'all';
const platform = argv.platform || 'darwin';

const DEFAULT_OPTS = {
    dir: './dist',
    name: appName,
    asar: shouldUseAsar
};


console.log("DEFAULT_OPTS " + JSON.stringify(DEFAULT_OPTS));

const icon = './dist/assets/app-icon';

if (icon) {
    DEFAULT_OPTS.icon = icon;
}

pack(platform, arch, function done(err, appPath) {
    console.log(err);
});

function pack(plat, arch, cb) {
    // there is no darwin ia32 electron
    if (plat === 'darwin' && arch === 'ia32') return;

    const iconObj = {
        icon: DEFAULT_OPTS.icon + (() => {
            let extension = '.png';
            if (plat === 'darwin') {
                extension = '.icns';
            } else if (plat === 'win32') {
                extension = '.ico';
            }
            return extension;
        })()
    };

    const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
        platform: plat,
        arch,
        prune: true,
        all: shouldBuildAll,
        'app-version': pkg.version || DEFAULT_OPTS.version,
        out: `release/${plat}-${arch}`
    });

    packager(opts, cb);
}