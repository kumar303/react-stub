import React, { Component } from 'react';


export default function reactStub(realComponent, {name} = {}) {
  if (!name) {
    if (realComponent.name) {
      name = realComponent.name;  // ES6 class name
    } else if (realComponent.constructor) {
      name = realComponent.constructor.name;
    }
    if (!name) {
      name = 'object';
    }
    name = `reactStub:${name}`;
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


function validateReactProps(props, realComponent, {name} = {}) {
  var propTypes = realComponent.propTypes || {};
  var defaultProps = realComponent.defaultProps || {};
  // This makes a map of prop values starting with defaults and finishing
  // with instance properties.
  var effectiveProps = {...defaultProps, ...props};

  Object.keys(props).forEach((key) => {
    if (typeof propTypes[key] === 'undefined' && key !== 'children') {
      throw new Error(`faked component does not accept property ${key}`);
    }
  });

  Object.keys(propTypes).forEach((key) => {
    let validatePropValue = propTypes[key];
    // It's not really documented but this validator is currently defined at
    // https://github.com/facebook/react/blob/master/src/isomorphic/classic/types/ReactPropTypes.js#L88
    let error = validatePropValue(effectiveProps, key, name, 'prop');
    if (error) {
      throw error;
    }
  });
}
