// Project: <%= fullname %> (<%= shortname %>)
// File purpose: Custom javascript for project
// Author: <%= author %>

var app = (function()
{

  var _initialize = function() {

    // Avoid `console` errors in browsers that lack a console.
    _globalConsole();<% if (includeViewportFix) { %>

    // Fix vw/vh/vmin/vmax support in Mobile Safari
    window.viewportUnitsBuggyfill.init();<% } %><% if (includeFastclick) { %>

    // Speed up tap reactions on mobile browsers
    FastClick.attach(document.body);<% } %>

    // Init various custom scripts
    _initExample();
  };


  var _initExample = function () {
    console.log('\'Allo \'Allo!');
  };


  var _globalConsole = function() {
    // Adopted from HTML5 Boilerplate:
    // https://github.com/h5bp/html5-boilerplate/blob/master/dist/js/plugins.js
    var method;
    var noop = function () {};
    var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
      method = methods[length];

      // Only stub undefined methods.
      if (!console[method]) {
        console[method] = noop;
      }
    }
  };


  return {
    // set public methods
    initialize : _initialize
  };

}());

window.app = app;

// Wait until the DOM is fully loaded
// and start app
<% if (includeJQuery || includeBootstrap) { %>$(function() {
  app.initialize();
});<% } else { %>if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', app.initialize, false);
}<% } -%>