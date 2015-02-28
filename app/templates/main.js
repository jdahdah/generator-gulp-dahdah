// Project: <%= fullname %> (<%= shortname %>)
// File purpose: Custom javascript for project
// Author: <%= author %>

/* jshint devel:true */
'use strict';
console.log('\'Allo \'Allo!');

<% if (includeFastclick) { %>
/*global FastClick */
$(function() {
    FastClick.attach(document.body);
});
<% } %>
