var assert = require('assert');
var dirSame = require('@nickmanning214/dir-same');
var path = require('path');
const renderDirectory = require('../index.js');
const rimraf = require('rimraf');

const singleFileDir = {
    dir:path.join(__dirname,'single-file'),
    toCompile:path.join(__dirname,'single-file','to-compile'),
    compiled:path.join(__dirname,'single-file','compiled')
}
const singleFileDeeperDir = {
    dir:path.join(__dirname,'single-file-deeper'),
    toCompile:path.join(__dirname,'single-file-deeper','to-compile'),
    compiled:path.join(__dirname,'single-file-deeper','compiled')
}
const singleFileName = {
    dir:path.join(__dirname,'single-file-name'),
    toCompile:path.join(__dirname,'single-file-name','to-compile'),
    compiled:path.join(__dirname,'single-file-name','compiled')
}
const twoBarsOneFileDir = {
    dir:path.join(__dirname,'two-vars-one-file'),
    toCompile:path.join(__dirname,'two-vars-one-file','to-compile'),
    compiled:path.join(__dirname,'two-vars-one-file','compiled')
}

const svelteCreateProject = path.join(__dirname,'svelte-create-project');

const renderObj = {
    name:'hello',
    color:'red'
}

describe('single-file', function() {
    before(async function() {
        await renderDirectory(singleFileDir.toCompile,singleFileDir.compiled,renderObj);
    });
    it('should be identical to the other directory', function(done) {

        //temp setTimeout to see if it's an async problem.
            const same = dirSame(singleFileDir.dir,'compiled',singleFileDir.dir,'compiled-prototype');
            assert.ok(same);
            done();
    });
    after(function(done){
        //You have to clean up the created directory. It doesn't work to recreate it over the last one.
        rimraf(singleFileDir.compiled,done)
    });
});

describe('single-file-deeper', function() {
    before(async function() {
        await renderDirectory(singleFileDeeperDir.toCompile,singleFileDeeperDir.compiled,renderObj);

    });
    it('should be identical to the other directory', function(done) {

        //temp setTimeout to see if it's an async problem.
            const same = dirSame(singleFileDeeperDir.dir,'compiled',singleFileDeeperDir.dir,'compiled-prototype');
            assert.ok(same);
            done();
    });

    after(function(done){
        //You have to clean up the created directory. It doesn't work to recreate it over the last one.
        rimraf(singleFileDeeperDir.compiled,done)
    })

});

describe('single-file-name', function() {
    before(async function() {
        await renderDirectory(singleFileName.toCompile,singleFileName.compiled,renderObj);
    });
    it('should be identical to the other directory', function(done) {

        //temp setTimeout to see if it's an async problem.
            const same = dirSame(singleFileName.dir,'compiled',singleFileName.dir,'compiled-prototype');
            assert.ok(same);
            done();
    });

    after(function(done){
        //You have to clean up the created directory. It doesn't work to recreate it over the last one.
        rimraf(singleFileName.compiled,done)
    })

});

describe('two-vars-one-file', function() {
    before(async function() {

        await renderDirectory(twoBarsOneFileDir.toCompile,twoBarsOneFileDir.compiled,renderObj);

    });
    it('should be identical to the other directory', function(done) {

        //temp setTimeout to see if it's an async problem.
            const same = dirSame(twoBarsOneFileDir.dir,'compiled',twoBarsOneFileDir.dir,'compiled-prototype');
            assert.ok(same);
            done();
    });

    after(function(done){
        //You have to clean up the created directory. It doesn't work to recreate it over the last one.
        rimraf(twoBarsOneFileDir.compiled,done)
    })

});


/*
const projectName = ''
const svelteRenderObj = {
    'component-name':titleCase(projectName).replace(/ /g,''),
    'component-scope':'',
    'slash-if-necessary':'',
    'package-name':projectName.toLowerCase().split(' ').join('-'),
    'author-name':authorName,
    'component-demo':demoLink,
    'component-description':componentDescription,
    'component-description-escape-quotes':componentDescription.replace(/"/g,'\\"')
  }

describe('svelte-create-project', function() {
    before(async function() {
        await renderDirectory(svelteCreateProject,'to-compile',svelteCreateProject,'compiled',svelteRenderObj);
    });
    it('should be identical to the other directory', function(done) {

        //temp setTimeout to see if it's an async problem.
            const same = dirSame(svelteCreateProject,'compiled',svelteCreateProject,'compiled-prototype');
            assert.ok(same);
            done();
    });

    after(function(done){
        //You have to clean up the created directory. It doesn't work to recreate it over the last one.
        rimraf(path.join(svelteCreateProject,'compiled'),done)
    })

});

*/
