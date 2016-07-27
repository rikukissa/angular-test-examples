# Testing Angular.js app headlessly with node.js + mocha
_Lean unit tests with minimal setup_

#### Keypoints
* Fake DOM (Everything works without a real browser)
* Uses ngMocks to inject and mock Angular.js dependencies
* I'm assuming you are already using browserify (but everything works fine without it)

## Some background
Majority of search result about unit testing Angular.js apps is about how to do it by using test frameworks that run the tests in a real browser. Even though it's great to be able to test your code in multiple platforms, in my opinion it creates a lot of boilerplate code and makes it hard to run the tests in, for instance a CI-server.

In most cases I just want to include a module from my code to my tests, call methods from the module and do assertions to assure that everything is working properly.

## 1. Set up a mock DOM

```sh
npm install jsdom@~3.x.x -D
```

Even though jsdom 4.0 is already available by the time I'm writing this we will still use the 3.x version because the most recent versions support only io.js.

_tests/test-helper.js_
```javascript
var jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><head><script></script></head><body></body></html>');
global.window = global.document.parentWindow;
global.navigator = window.navigator = {};
```


## 2. Install and set-up ngMocks

**If you have installed Angular with Bower:**

`bower install angular-mocks -D`

**If you have installed Angular with npm:**

`npm install angular-mocks -D`

:warning: Make sure your angular-mocks version matches your angular version


_tests/test-helper.js_
```javascript
var jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><head><script></script></head><body></body></html>');
global.window = global.document.parentWindow;
global.navigator = window.navigator = {};
global.Node = window.Node;

global.window.mocha = {};
global.window.beforeEach = beforeEach;
global.window.afterEach = afterEach;

/*
 * Only for Bower users
 */
require('../bower_components/angular');
require('../bower_components/angular-mocks');

/*
 * Only for NPM users
 */
require('angular/angular');
require('angular-mocks');

global.angular = window.angular;
global.inject = global.angular.mock.inject;
global.ngModule = global.angular.mock.module;
```

## 3. Install Mocha and write some tests

`npm install mocha -D`

I assume that your directory structure looks something similar to this

```
app/
  scripts/
    services/
      - userService.js
    controllers/
package.json
```

Lets create a new directory called **\__tests\__** under our *services/* directory and a new test file called **userService.js** there.

```
app/
  scripts/
    services/
      __tests__/
        - userService.js
      - userService.js
    controllers/
package.json
```

Here's a reference implementation of our userService.js

```javascript
angular.module('myServices.user', []).service('UserService', function() {
  return {
    getUsers: function () {
      return [];
    }
});
```

*app/scripts/services/\__tests\__/userService.js*

```javascript
var assert = require('assert');
require('../../../tests/test-helpers');

// Loads the module we want to test
require('../userService');

describe('User service', function() {
  beforeEach(ngModule('myServices.user'));

  it('should return a list of users', inject(function(UserService) {
    assert.equal(UserService.getUsers().length, 0);
  }));
});
```

Now by running `./node_modules/.bin/mocha app/scripts/**/__tests__/**/*.js` we should see that our tests work.

**Protip:** You most likely want to add that to your package.json's **scripts.test** field.

```json
"scripts": {
  "test": "mocha app/scripts/**/__tests__/**/*.js"
}
```
Notice how you don't have to use the ./node_modules... path anymore since npm resolves it for you. If you are using npm >=2.0 you can no also use `npm test -- --watch` to start Mocha in watch mode.

## For Browserify users

If you want to also mock the modules your services (or what ever you are testing) are using I would recommend [proxyquire](https://github.com/thlorenz/proxyquire).

---

## Known issues

#### Broken `--watch` mode
If you've installed Angular.js with npm you'll notice that on Mocha's watch mode your fake DOM is recreated on every reload but the Angular.js code isn't re-evaluated which leads into thrown exceptions about angular being undefined.
There's two causes for this: angular and angular-mocks are both singletons and Mocha doesn't re-evaluate anything in node_modules. This problem doesn't exist for Bower users since their angular and angular-mocks are in the bower_components directory.

**Solution**

Even though this is a bit dirty, I solved this by invalidating require cache for angular and related modules.

*tests/test-helper.js*
```javascript
//...
delete require.cache[require.resolve('angular')];
delete require.cache[require.resolve('angular/angular')];
delete require.cache[require.resolve('angular-mocks')];

require('angular/angular');
require('angular-mocks');

global.angular = window.angular;
global.inject = global.angular.mock.inject;
global.ngModule = global.angular.mock.module;
```
