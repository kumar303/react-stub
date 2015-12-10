import React, { Component } from 'react';


function reactStub(realComponent, {name} = {}) {
  if (!name) {
    if (realComponent.name) {
      name = realComponent.name;  // ES6 class name
    } else if (realComponent.constructor) {
      name = realComponent.constructor.name;
    }
    if (!name) {
      name = 'object';
    }
    name = `Fake:${name}`;
  }

  class FakeComponent extends Component {
    constructor(props) {
      super(props);
      validateReactProps(props, realComponent, {name});
    }
    render() {
      return <span>This is a fake component</span>;
    }
  }

  return FakeComponent;
}

export default reactStub;


function validateReactProps(props, realComponent, {name} = {}) {
  var propTypes = realComponent.propTypes || {};

  Object.keys(props).forEach((key) => {
    if (typeof propTypes[key] === 'undefined') {
      throw new Error(`faked component does not accept property ${key}`);
    }
  });

  Object.keys(propTypes).forEach((key) => {
    let validatePropValue = propTypes[key];
    // It's not really documented but this validator is currently defined at
    // https://github.com/facebook/react/blob/master/src/isomorphic/classic/types/ReactPropTypes.js#L88
    let error = validatePropValue(props, key, name, 'prop');
    if (error) {
      throw error;
    }
  });
}
