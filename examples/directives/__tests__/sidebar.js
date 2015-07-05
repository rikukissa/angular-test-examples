/*global it, describe, beforeEach, ngModule, inject */

require('../../../test-helper');
require('../sidebar');

var chai = require('chai');
var expect = chai.expect;

describe('directive', function() {
  beforeEach(ngModule('directives.sidebar'));

  it('should...', inject(function($compile) {
    var compiled = $compile('<div sidebar></div>')({})[0];
    expect(compiled.className).to.contain('sidebar');
  }));
});
