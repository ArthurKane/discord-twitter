const fs = require('fs');
const { dest, series } = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');

function emptyBuildFolder(cb) {
    if (!fs.existsSync('./build')) {
        fs.mkdirSync('./build');
    }
    del.sync(['./build/*']);
    cb();
}

function transpileTs() {

    const tsProject = ts.createProject('tsconfig.json');

    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(dest('build'));
}

function watchSuccess(cb) {
    console.log('Compilation Successful');
    cb();
}

exports.build = series(
    emptyBuildFolder,
    transpileTs,
);
