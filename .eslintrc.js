module.exports = {
  "extends": "standard",
  "rules": {
    //"padded-blocks": 0
  },
  "env": {
    "browser": true, // browser global variables
    "node": false, // Node.js global variables and Node.js scoping
    "commonjs": false, // CommonJS global variables and CommonJS scoping (use this for browser-only code that uses Browserify/WebPack)
    "shared-node-browser": false, // Globals common to both Node and Browser
    "es6": true, // enable all ECMAScript 6 features except for modules (this automatically sets the ecmaVersion parser option to 6)
    "worker": false, // web workers global variables
    "amd": false, // defines require() and define() as global variables as per the amd spec
    "mocha": false, // adds all of the Mocha testing global variables
    "jasmine": false, // adds all of the Jasmine testing global variables for version 1.3 and 2.0
    "jest": false, // Jest global variables
    "phantomjs": false, // PhantomJS global variables
    "protractor": false, // Protractor global variables
    "qunit": false, // QUnit globals
    "jquery": true, // jQuery globals
    "prototypejs": false, // Prototype.js global variables
    "shelljs": false, // ShellJS globals
    "meteor": false, // Meteor globals
    "mongo": false, // MongoDB globals
    "applescript": false, // AppleScript global variables
    "nashorn": false, // Java 8 Nashorn global variables
    "serviceworker": false, // Service Worker global variables
    "atomtest": false, // Atom test globals
    "embertest": false, // Ember test globals
    "webextensions": false, // WebExtensions globals
    "greasemonkey": false, // GreaseMonkey globals
  },
}