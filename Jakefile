var path = require('path')
  , fs = require('fs')
  , cwd = process.cwd()
  , utilities = require('utilities')
  , genutils = require('geddy-genutils')
  , genDirname = __dirname;

var ns = 'view';

// Load the basic Geddy toolkit
genutils.loadGeddy();
var utils = genutils.loadGeddyUtils();

// Tasks
task('default', function() {
  var self = this;
  var t = jake.Task['view:create'];
  t.reenable();
  t.invoke.apply(t, Array.prototype.slice.call(arguments));
});

namespace(ns, function() {
  task('create', function(name, template, data, transform) {
    if (!genutils.inAppRoot()) {
      fail('You must run this generator from the root of your application.');
      return;
    }

    if (!name) {
      fail('Missing view name.');
      return;
    }

    if (!template) {
      fail('Missing view template.');
      return;
    }

    var appPath = process.cwd();
    var viewsDir = path.join(appPath, 'app', 'views');

    if (!data) {
      data = genutils.getShared() || {};
    }

    // try to parse data
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data) || {};
      } catch(error) {
        data = {};
      }
    }
    else if(typeof data !== 'object') {
      data = {};
    }

    var force = genutils.flagSet('-f','--force');
    var usePublic = genutils.flagSet('-p', '--public');

    var viewPath = path.join(appPath, usePublic ? 'public' : 'app', 'views', name);
    var viewDir = path.dirname(viewPath);

    if (!fs.existsSync(template)) {
      fail('Template file does not exists.');
      return;
    }

    if (!force && fs.existsSync(viewPath)) {
      fail('View already exists. Use -f to replace it.');
      return;
    }

    // create destination dir if it does not exists
    jake.mkdirP(viewDir);

    // extend data
    data.geddy = geddy;
    data.viewFileName = path.basename(viewPath);
    data.viewDirName = path.relative(appPath, viewDir);
    data.viewIsPublic = usePublic;

    genutils.template.write(template, viewPath, data, transform);
  });

  task('help', function() {
    console.log(
      fs.readFileSync(
        path.join(__dirname, 'help.txt'),
        {encoding: 'utf8'}
      )
    );
  });

  desc('Clears the test temp directory.');
  task('clean', function() {
    console.log('Cleaning temp files ...');
    var tmpDir = path.join(__dirname, 'test', 'tmp');
    utilities.file.rmRf(tmpDir, {silent:true});
    fs.mkdirSync(tmpDir);
  });

  desc('Copies the test app into the temp directory.');
  task('prepare-test-app', function() {
    console.log('Preparing test app ...');
    jake.cpR(
      path.join(__dirname, 'test', 'geddy-test-app'),
      path.join(__dirname, 'test', 'tmp'),
      {silent: true}
    );
    console.log('Test app prepared.');
  });
});

testTask('View', ['view:clean', 'view:prepare-test-app'], function() {
  this.testFiles.exclude('test/helpers/**');
  this.testFiles.exclude('test/fixtures/**');
  this.testFiles.exclude('test/template/**');
  this.testFiles.exclude('test/geddy-test-app');
  this.testFiles.exclude('test/tmp/**');
  this.testFiles.include('test/**/*.js');
});