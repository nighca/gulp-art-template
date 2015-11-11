'use strict';

var should = require('should');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');

var artTemplate = require('../');

var getTemplate = function (templateName) {
    var base = path.join(__dirname, 'fixtures');
    var filePath = path.join(base, templateName + '.tpl');

    return new gutil.File({
        cwd: __dirname,
        base: base,
        path: filePath,
        contents: fs.readFileSync(filePath)
    });
};

var getData = function (templateName) {
    return require('./fixtures/' + templateName);
};

var getExpect = function (templateName) {
    var filePath = path.join(__dirname, 'fixtures', templateName + '.html');

    return fs.readFileSync(filePath, 'utf8');
};

describe('gulp-art-template', function () {
    it('should render template', function (done) {
        var template = getTemplate('index');

        var stream = artTemplate({
            data: getData('index')
        });

        var expect = getExpect('index');

        stream.on('data', function (htmlFile) {
            should.exist(htmlFile);
            should.exist(htmlFile.path);
            should.exist(htmlFile.contents);
            should.equal(htmlFile.contents.toString(), expect);
        });

        stream.once('end', done);

        stream.write(template);
        stream.end();
    });
});