'use strict';

const should = require('should');
const gutil = require('gulp-util');
const fs = require('fs');
const path = require('path');

const artTemplate = require('../');

var getTemplate = function (templateName) {
    let base = path.join(__dirname, 'fixtures');
    let filePath = path.join(base, templateName + '.tpl');

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
    let filePath = path.join(__dirname, 'fixtures', templateName + '.html');

    return fs.readFileSync(filePath, 'utf8');
};

describe('gulp-art-template', function () {
    it('should render template', function (done) {
        let template = getTemplate('index');

        let stream = artTemplate({
            data: getData('index')
        });

        let expect = getExpect('index');

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