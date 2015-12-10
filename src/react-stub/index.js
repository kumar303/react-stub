import React, { Component } from 'react';
import sinon from 'sinon';


function stubCreator(realObject) {
  return makeStub(realObject);
}

export default stubCreator;


function makeStub(realObject, {name} = {}) {
  if (!name) {
    if (realObject.name) {
      name = realObject.name;  // ES6 class name
    } else if (realObject.constructor) {
      name = realObject.constructor.name;
    }
    if (!name) {
      name = 'object';
    }
    name = `Fake:${name}`;
  }
  var realType = typeof realObject;
  if (  (realType !== 'function' && realType !== 'object') ||
        realObject === null) {
    // This is a string, number, or null so we don't need to stub it.
    return realObject;
  }
  if (realObject.prototype instanceof Component) {
    return reactComponentStub(realObject, {name});
  } else {
    return objectStub(realObject, {name});
  }
}


function objectStub(realObject, {name} = {}) {
  var realType = typeof realObject;
  var stub = sinon.stub();
  if (realType === 'object') {
    stub.throws(new Error(`${name} is not a function`));
    for (let prop in realObject) {
      stub[prop] = makeStub(realObject[prop], {name: prop});
    }
  }
  return stub;
}


function reactComponentStub(realComponent, {name} = {}) {
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
