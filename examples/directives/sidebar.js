'use strict';

var angular = require('angular');

angular
.module('directives.sidebar', [])
.directive('sidebar', function() {
  return {
    restrict: 'A',
    link: function(scope, $el) {
      $el.addClass('sidebar');
    }
  };
});
