var jake = require('jake');
var path = require('path');
var genutils = require('geddy-genutils');
var validTasks = ['default', 'help', 'create', 'test'];
var ns = 'view';

module.exports = function(appPath, args) {
  gentuils.jake.run(__dirname, ns, validTasks, args);
};

module.exports.setViewData = function(data)
{
  process._viewData = data;
};