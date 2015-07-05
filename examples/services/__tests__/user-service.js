var helpers = require('test-helper');
var ngModule = helpers.module;
var inject = helpers.inject;

require('../user-service');

var expect = require('chai').expect;

var MOCK_USER = {
  username: 'riku'
};

var MOCK_USERS = [{id: 1}, {id: 2}];

describe('User service', function() {
  beforeEach(ngModule('services.user'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', '/api/users').respond(MOCK_USERS);
    $httpBackend.when('GET', '/api/users/me').respond(MOCK_USER);

    this.$httpBackend = $httpBackend;
  }));

  afterEach(function() {
    this.$httpBackend.verifyNoOutstandingExpectation();
    this.$httpBackend.verifyNoOutstandingRequest();
  });

  describe('getUsers method', function() {
    it('should return a list of users', function(done) {
      inject(function(UserService) {
        UserService.getUsers().then(function(users) {
          expect(users).to.deep.equal(MOCK_USERS);
          done();
        }).catch(done);

        $httpBackend.flush();
      })
    });
  });

  describe('getUser method', function() {
    it('should return current user', function(done) {
      inject(function(UserService) {
        UserService.getUser().then(function(users) {
          expect(users).to.deep.equal(MOCK_USER);
          done();
        }).catch(done);

        $httpBackend.flush();
      })
    });
  });

});
