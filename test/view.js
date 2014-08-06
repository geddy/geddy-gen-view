var path = require('path')
  , assert = require('assert')
  , fs = require('fs')
  , exec = require('child_process').exec
  , utilities = require('utilities')
  , genutils = require('geddy-genutils')
  , tests;

var testAppDir = path.join(__dirname, 'tmp', 'geddy-test-app');
var viewsDir = path.join(testAppDir, 'app', 'views');
var publicViewsDir = path.join(testAppDir, 'public', 'views');

function createView(name, template, argv, cb)
{
  if (!argv) {
    argv = []
  }

  if (typeof argv === 'function') {
    cb = argv;
    argv = [];
  }

  var p = exec(path.join(__dirname, 'helpers', 'exec.js') + ' ' + name + ' ' + template + ' ' + argv.join(' '), cb);
  p.stdout.pipe(process.stdout);
  //p.stderr.pipe(process.stderr);
}

tests = {
  'beforeEach': function() {
    // go to app root
    process.chdir(path.join(__dirname, 'tmp', 'geddy-test-app'));
  },
  'Call outside of test app\'s root': function(next) {
    process.chdir('./app');
    createView('template.html', path.join(__dirname, 'template', 'template.html.ejs'), function(err, stdout, stderr) {
      assert.equal(stderr.split('\n')[1], 'Error: You must run this generator from the root of your application.');
      next();
    });
  },
  'Create a view': function(next) {
    createView('foo/first.html', path.join(__dirname, 'template', 'template.html.ejs'), function(err, stdout, stderr) {
      if (err) {
        console.log(err);
        fail();
        return;
      }

      var viewPath = path.join(viewsDir, 'foo', 'first.html');
      assert.equal(fs.existsSync(viewPath), true);
      assert.equal(fs.readFileSync(viewPath, 'utf8'), fs.readFileSync(path.join(__dirname, 'fixtures', 'template.html')));
      next();
    });
  },
  'Create a public view': function(next) {
    createView('foo/second.html', path.join(__dirname, 'template', 'template.html.ejs'), ['-p'], function(err, stdout, stderr) {
      if (err) {
        console.log(err);
        fail();
        return;
      }

      var viewPath = path.join(publicViewsDir, 'foo', 'second.html');
      assert.equal(fs.existsSync(viewPath), true);
      assert.equal(fs.readFileSync(viewPath, 'utf8'), fs.readFileSync(path.join(__dirname, 'fixtures', 'public', 'template.html')));

      createView('foo/third.html', path.join(__dirname, 'template', 'template.html.ejs'), ['--public'], function(err, stdout, stderr) {
        if (err) {
          console.log(err);
          fail();
          return;
        }

        var viewPath = path.join(publicViewsDir, 'foo', 'third.html');
        assert.equal(fs.existsSync(viewPath), true);
        assert.equal(fs.readFileSync(viewPath, 'utf8'), fs.readFileSync(path.join(__dirname, 'fixtures', 'public', 'template.html')));
        next();
      });
    });
  },
  'Re-create the same view': function(next) {
    createView('foo/first.html', path.join(__dirname, 'template', 'template.html.ejs'), function(err, stdout, stderr) {
      assert.equal(stderr.split('\n')[1], 'Error: View already exists. Use -f to replace it.');
      next();
    });
  },
  'Overwrite the view': function(next) {
    createView('foo/first.html', path.join(__dirname, 'template', 'template.html.ejs'), ['-f'], function(err, stdout, stderr) {
      if (err) {
        console.log(err);
        fail();
        return;
      }

      var viewPath = path.join(viewsDir, 'foo', 'first.html');
      assert.equal(fs.existsSync(viewPath), true);
      assert.equal(fs.readFileSync(viewPath, 'utf8'), fs.readFileSync(path.join(__dirname, 'fixtures', 'template.html')));


      createView('foo/first.html', path.join(__dirname, 'template', 'template.html.ejs'), ['--force'], function (err, stdout, stderr) {
        if (err) {
          console.log(err);
          fail();
          return;
        }

        var viewPath = path.join(viewsDir, 'foo', 'first.html');
        assert.equal(fs.existsSync(viewPath), true);
        assert.equal(fs.readFileSync(viewPath, 'utf8'), fs.readFileSync(path.join(__dirname, 'fixtures', 'template.html')));
        next();
      });
    });
  },
  'Create view with data': function(next)
  {
    genutils.runGen('geddy-gen-view', ['foo/data.html', path.join(__dirname, 'template', 'data.html.ejs')], { foo: 'bar', bar: 'baz'}, function() {
      var viewPath = path.join(viewsDir, 'foo', 'data.html');
      assert.equal(fs.existsSync(viewPath), true);
      assert.equal(fs.readFileSync(viewPath, 'utf8'), fs.readFileSync(path.join(__dirname, 'fixtures', 'data.html')));
      next();
    });

  }
};

module.exports = tests;