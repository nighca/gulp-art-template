/**
 * @file artTemplate plugin for Gulp
 * @author nighca<nighca@live.cn>
 */

'use strict';

const artTemplate = require('art-template');
const through2 = require('through2');
const gutil = require('gulp-util');

const PluginError = gutil.PluginError;

artTemplate.defaults.extname = '.tpl';

module.exports = function (options) {
    options = Object.assign({
        data: {}
    }, options);

    return through2.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new PluginError('gulp-art-template', 'Streaming not supported'));
            return;
        }

        let renderer = artTemplate.compile(
            file.contents.toString(),
            {filename: file.path}
        );

        let data = typeof options.data === 'function'
            ? options.data(file) || {}
            : options.data;

        file.path = gutil.replaceExtension(file.path, '.html');

        file.contents = new Buffer(renderer(data));

        cb(null, file);
    });
};
