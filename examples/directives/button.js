'use strict';

var angular = require('angular');

angular
.module('directives.button', [])
.directive('btn', function() {
  return {
    template: '<button ng-click="onClick()" class="btn" ng-transclude></button>',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      onClick: '&'
    }
  };
});
