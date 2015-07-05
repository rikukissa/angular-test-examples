var helpers = require('test-helper');
var ngModule = helpers.module;
var inject = helpers.inject;

require('../sidebar');

var expect = require('chai').expect;

describe('directive', function() {
  beforeEach(ngModule('directives.sidebar'));

  it('should have proper classname', inject(function($rootScope, $compile) {
    var scope = $rootScope.$new();
    var compiled = $compile('<div sidebar></div>')(scope);
    expect(compiled.attr('class')).to.contain('sidebar');
  }));
});
