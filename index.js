var jake = require('jake');
var path = require('path');
var validTasks = ['default', 'help', 'create'];

module.exports = function(appPath, args) {
  // keep support of old style gen syntax
  if (args.length > 0 && validTasks.indexOf(args[0]) === -1) {
    args = ['default[' + args.join(',') + ']'];
  }

  // force to load local Jakefile and jakelib
  args.push('--jakefile');
  args.push(path.join(__dirname,'Jakefile'));
  args.push('--jakelibdir');
  args.push(path.join(__dirname,'jakelib'));

  // run our tasks
  jake.run.apply(jake, args);
}

// make tasks available programaticly
validTasks.forEach(function(task) {
  module.exports[task] = function() {
    var t = jake.Task.create;
    t.invoke.apply(t, Array.prototype.slice.call(arguments));
  }
});