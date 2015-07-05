'use strict';

var angular = require('angular');

angular
.module('services.user', [])
.factory('UserService', function($http) {

  return {
    getUsers: function() {
      return $http.get('/api/users').then(function(response) {
        return response.data;
      });
    },
    getUser: function() {
      return $http.get('/api/users/me').then(function(response) {
        return response.data;
      });
    }
  }
});
