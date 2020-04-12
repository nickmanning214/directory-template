var assert = require('assert');
var dirSame = require('@nickmanning214/dir-same');
var path = require('path');
const renderDirectory = require('../index.js');
const rimraf = require('rimraf');

const singleFileDir = path.join(__dirname,'single-file');
const singleFileDeeperDir = path.join(__dirname,'single-file-deeper');
const singleFileName = path.join(__dirname,'single-file-name');

const renderObj = {
    name:'hello',
    color:'red'
}

describe('single-file', function() {
    before(async function() {
        await renderDirectory(singleFileDir,'to-compile',singleFileDir,'compiled',renderObj);
    });
    it('should be identical to the other directory', function(done) {

        //temp setTimeout to see if it's an async problem.
            const same = dirSame(singleFileDir,'compiled',singleFileDir,'compiled-prototype');
            assert.ok(same);
            done();
    });
    after(function(done){
        //You have to clean up the created directory. It doesn't work to recreate it over the last one.
        rimraf(path.join(singleFileDir,'compiled'),done)
    });
});

describe('single-file-deeper', function() {
    before(async function() {
        await renderDirectory(singleFileDeeperDir,'to-compile',singleFileDeeperDir,'compiled',renderObj);
    });
    it('should be identical to the other directory', function(done) {

        //temp setTimeout to see if it's an async problem.
            const same = dirSame(singleFileDeeperDir,'compiled',singleFileDeeperDir,'compiled-prototype');
            assert.ok(same);
            done();
    });

    after(function(done){
        //You have to clean up the created directory. It doesn't work to recreate it over the last one.
        rimraf(path.join(singleFileDeeperDir,'compiled'),done)
    })

});

describe('single-file-name', function() {
    before(async function() {
        await renderDirectory(singleFileName,'to-compile',singleFileName,'compiled',renderObj);
    });
    it('should be identical to the other directory', function(done) {

        //temp setTimeout to see if it's an async problem.
            const same = dirSame(singleFileName,'compiled',singleFileName,'compiled-prototype');
            assert.ok(same);
            done();
    });

    after(function(done){
        //You have to clean up the created directory. It doesn't work to recreate it over the last one.
        rimraf(path.join(singleFileName,'compiled'),done)
    })

});

