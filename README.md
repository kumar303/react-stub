# React Stub

A stubbing tool that leads to safer and more maintainable
[React][react] unit tests.

[![Build Status](https://travis-ci.org/kumar303/react-stub.svg?branch=master)](https://travis-ci.org/kumar303/react-stub)

**MESSAGE FROM THE FUTURE: I don't use this much anymore.**
**I prefer relying on strong typing with [Flow](https://flowtype.org/) to achieve the same goals. ~Kumar**

## How it works

You create a stub component out of a real component. The stub is just a normal
React component -- you can render it, nest it, inspect its properties,
do whatever you want. Example:

```javascript
// Pretend this is something in your app:
import Login from 'components/login';

import reactStub from 'react-stub';
let LoginStub = reactStub(Login);
```

## Install

    npm install --save-dev react-stub

## Requirements

* Your app needs to be using [React][react] `0.14` or greater
  (until [issue 2](https://github.com/kumar303/react-stub/issues/2) is resolved).

## Safer and more maintainable tests

Stubs and mocks are generally risky in dynamic languages such as JavaScript
because you have to keep track of interface refactoring *in your head* and that's
hard. This leads to a maintainance burden and in the worst case scenario you
might have a passing test suite yet a failing application.
React Stub attempts to solve these problems.

Here is an overview of error feedback you get when running tests:

* If the component you've stubbed out gets moved or renamed, you'll see an error.
* If you try to set a property on the stub that isn't in the real component's
  [PropTypes][prop-types] then you'll get an error.
* If you assign an invalid property value on the stub component you'll see a
  [PropTypes][prop-types] validation error.
* If a component forgets to declare a required property on a stubbed
  sub-component, you'll also see a [PropTypes][prop-types] validation error.

## Make sure your app uses components correctly

A good case for stubbed components is when you have one component that depends
on another but you want to unit test each of them independently. Stubbing out
the one you're not testing helps you focus on the interface of the dependent
component, which is typically its properties. This also helps
keep your test suite lean and fast.

Imagine you have an `App` component that relies on a `Login` component. If you want
to test `App` in isolation, the first thing you need to do is
re-design your `App` class to accept a stubbed dependency:

```javascript
import React, { Component, PropTypes } from 'react';

// Import the real component for reference.
import DefaultLogin from 'components/login';

export default class App extends Component {
  static propTypes = {
    Login: PropTypes.func.isRequired,
  }
  static defaultProps = {
    // When not testing, the real Login is used.
    Login: DefaultLogin,
  }
  render() {
    let Login = this.props.Login;
    return <Login/>;
  }
}
```

This component design allows you to inject a stub component while testing, like
this:

```javascript
// Pretend these are custom components for your app.
import App from 'components/app';
import Login from 'components/login';

import ReactTestUtils from 'react-addons-test-utils';
import reactStub from 'react-stub';

let LoginStub = reactStub(Login);
ReactTestUtils.renderIntoDocument(
  <App Login={LoginStub} />
);
```

If the stub gets used incorrectly, you'll see an exception when the top level
component gets rendered. For example, if you pass an unexpected attribute,
you'll see an error:

```javascript
ReactTestUtils.renderIntoDocument(
  <LoginStub userId={321} />
);
```

```
...
reactStub:Login does not accept property userId
```

## Deeper property inspection

If you want to go beyond simply verifying the [PropTypes][prop-types] of the
stubbed component, you can use typical React testing approaches. For example:

```javascript
// Pretend these are custom components for your app.
import App from 'components/app';
import Login from 'components/login';

import ReactTestUtils from 'react-addons-test-utils';
import reactStub from 'react-stub';

let LoginStub = reactStub(Login);
let renderedApp = ReactTestUtils.renderIntoDocument(
  <App Login={LoginStub} />
);

let renderedLogin = ReactTestUtils.findRenderedComponentWithType(
  renderedApp, LoginStub
);

// You could now make assertions about `renderedLogin.props` ...

```

## Development

Clone the source, install [NodeJS](https://nodejs.org/en/),
and run this from the source directory to install the dependency modules:

    npm install

Make sure you have [grunt](http://gruntjs.com/)
installed and on your path. Otherwise, run this:

    npm install -g grunt

To run the tests each time you edit a file, run:

    grunt watch-test

To run a test suite once, run:

    grunt test

To check for lint errors, run:

    grunt eslint

To build a distribution from source, run:

    grunt build

## Distribution

To create a new release:

* Increment the version in `package.json`.
* Make sure the release history section in `README.md` is up to date.
* Commit and push your changes.
* Tag the version (like `git tag 0.0.1`) and push the tag with
  `git push --tags`.
* Run `grunt build` to create a common JS distribution (in the `dist` folder).
* Run `npm publish`.

## Release history

* `0.0.2` (2015-12-14)
  * Provide a proper common JS distribution, i.e. no transpilation required.

* `0.0.1` (2015-12-14)
  * Initial release!

[react]: https://facebook.github.io/react/
[prop-types]: https://facebook.github.io/react/docs/reusable-components.html#prop-validation
