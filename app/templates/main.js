/* jshint devel:true */
console.log('\'Allo \'Allo!');

<% if (includeFastclick) { %>
$(function() {
    FastClick.attach(document.body);
});
<% } %>
