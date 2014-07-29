var fs = require('fs');
var path = require('path')
  , utilities = require('utilities')
  , geddyPath = path.normalize(path.join(require.resolve('geddy'), '../../'));

// Load the basic Geddy toolkit
require(path.join(geddyPath,'lib/geddy'));

// Dependencies
var cwd = process.cwd()
  , utils = require(path.join(geddyPath, 'lib/utils'))
  , Adapter = require(path.join(geddyPath, 'lib/template/adapters')).Adapter
  , genDirname = __dirname;

function flagSet(shortName, name) {
  return process.argv.indexOf(shortName) !== -1 || process.argv.indexOf(name) !== -1;
}

var _writeTemplate = function (src, dest, data) {
  var ext = path.extname(src)
    , supported = ['.ejs', '.jade', '.mustache', '.swig', '.handlebars']

  if (supported.indexOf(ext) == -1) {
    fail('Unsuported template engine. Try one of these instead: ' + supported.join(', '));
    return;
  }

  var text = fs.readFileSync(src, 'utf8').toString()
    , adapter
    , templContent;

  // render with the correct adapter
  adapter = new Adapter({engine: ext.substring(1), template: text});
  templContent = adapter.render(data);

  // Write file
  fs.writeFileSync(dest, templContent, 'utf8');

  console.log('[Added] ' + dest);
};

// Tasks
task('default', function() {
  var self = this;
  var t = jake.Task.create;
  t.reenable();
  t.invoke.apply(t, Array.prototype.slice.call(arguments));
});

task('create', function(name, template, data) {
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
  if (!fs.existsSync(viewsDir) || !fs.statSync(viewsDir).isDirectory()) {
    fail('You must run this generator from the root of your application.');
    return;
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

  var force = flagSet('-f','--force');
  var usePublic = flagSet('-p', '--public');

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

  _writeTemplate(template, viewPath, data);
});

task('help', function() {
  console.log(
    fs.readFileSync(
      path.join(__dirname, 'help.txt'),
      {encoding: 'utf8'}
    )
  );
});

testTask('Resource', ['clean', 'prepare-test-app'], function() {
  this.testFiles.exclude('test/helpers/**');
  this.testFiles.exclude('test/fixtures/**');
  this.testFiles.exclude('test/template/**');
  this.testFiles.exclude('test/geddy-test-app');
  this.testFiles.exclude('test/tmp/**');
  this.testFiles.include('test/**/*.js');
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