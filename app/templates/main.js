/* jshint devel:true */
'use strict';
console.log('\'Allo \'Allo!');

<% if (includeFastclick) { %>
/*global FastClick */
$(function() {
    FastClick.attach(document.body);
});
<% } %>
