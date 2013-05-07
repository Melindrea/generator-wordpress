'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var WordpressGenerator = module.exports = function WordpressGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  if (!options['test-framework']) {
    options['test-framework'] = 'mocha';
  }

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', { as: 'app' });

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.mainJsFile = '';

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(WordpressGenerator, yeoman.generators.NamedBase);

WordpressGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);

  var prompts = [{
    name: 'someOption',
    message: 'Would you like to enable this option?',
    default: 'Y/n',
    warning: 'Yes: Enabling this will be totally awesome!'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.someOption = (/y/i).test(props.someOption);

    cb();
  }.bind(this));
};

WordpressGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

WordpressGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

WordpressGenerator.prototype.composer = function composer() {
  this.template('_composer.json', 'composer.json');
};

WordpressGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

WordpressGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

WordpressGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

WordpressGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

WordpressGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy('404.html', 'app/404.html');
  this.copy('robots.txt', 'app/robots.txt');
};

WordpressGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/theme');
};

WordpressGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
