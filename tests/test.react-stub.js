import React, { Component, PropTypes } from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import reactStub from 'react-stub';


describe('reactStub', function() {

  it('requires a truthy component', function() {
    expect(() => reactStub()).to.throw(/realComponent is undefined/);
  });

  it('renders a stub component', function() {
    class RealComponent extends Component {
      render() {
        return <div/>;
      }
    }
    var Fake = reactStub(RealComponent);
    // This throws an error if the stub is not a component.
    ReactTestUtils.renderIntoDocument(<Fake/>);
  });

  it('lets you find a fake component', function() {
    class RealComponent extends Component {
      render() {
        return <span>real</span>;
      }
    }

    var Fake = reactStub(RealComponent);
    var container = ReactTestUtils.renderIntoDocument(<Fake/>);

    // This will throw an error if it can't be found.
    ReactTestUtils.findRenderedComponentWithType(container, Fake);
  });

  it('prevents you from setting an unknown property', function() {
    class RealComponent extends Component {
      static propTypes = {
        other: PropTypes.object,
      }
      render() {
        return <div/>;
      }
    }

    var Fake = reactStub(RealComponent);
    expect(() => ReactTestUtils.renderIntoDocument(
        <Fake wrongAttr="non-existant" />
      ))
      .to.throw(/faked component does not accept property wrongAttr/);
  });

  it('allows you to set a known property', function() {
    class RealComponent extends Component {
      static propTypes = {
        foo: PropTypes.string.isRequired,
      }
      render() {
        return <div/>;
      }
    }

    var Fake = reactStub(RealComponent);
    // This should not throw an error.
    ReactTestUtils.renderIntoDocument(<Fake foo="thing" />);
  });

  it('allows you to set a key property', function() {
    class RealComponent extends Component {
      render() {
        return <div/>;
      }
    }

    var Fake = reactStub(RealComponent);
    // This should not throw an error.
    // This is handled by default because React does not include in props.
    // It seemed like a good case to test anyway.
    ReactTestUtils.renderIntoDocument(<Fake key={5} />);
  });

  it('prevents you from assigning an invalid property', function() {
    class RealComponent extends Component {
      static propTypes = {
        foo: PropTypes.string.isRequired,
      }
      render() {
        return <div/>;
      }
    }

    let msg = new RegExp(
      'Invalid prop `foo` of type `number` supplied to '+
      '`Fake:RealComponent`, expected `string`'
    );
    let Fake = reactStub(RealComponent);
    expect(() => ReactTestUtils.renderIntoDocument(<Fake foo={5} />))
      .to.throw(msg);
  });

  it('prevents you from forgetting to set a required property', function() {
    class RealComponent extends Component {
      static propTypes = {
        foo: PropTypes.string.isRequired,
      }
      render() {
        return <div/>;
      }
    }

    let msg = /Required prop `foo` was not specified in `Fake:RealComponent`/;
    let Fake = reactStub(RealComponent);
    expect(() => ReactTestUtils.renderIntoDocument(<Fake/>)).to.throw(msg);
  });

  it('allows you to skip default values', function() {
    class RealComponent extends Component {
      static propTypes = {
        foo: PropTypes.string.isRequired,
      }
      static defaultProps = {
        foo: 'default value',
      }
      render() {
        return <div/>;
      }
    }

    var Fake = reactStub(RealComponent);
    // No error thrown.
    ReactTestUtils.renderIntoDocument(<Fake/>);
  });

  it('prefers actual prop values rather than defaults', function() {
    class RealComponent extends Component {
      static propTypes = {
        foo: PropTypes.string.isRequired,
      }
      static defaultProps = {
        foo: 'default value',
      }
      render() {
        return <div/>;
      }
    }

    let msg = new RegExp(
      'Invalid prop `foo` of type `number` supplied to ' +
      '`Fake:RealComponent`, expected `string`');
    let Fake = reactStub(RealComponent);
    expect(() => ReactTestUtils.renderIntoDocument(
        <Fake foo={9999} />
      ))
      .to.throw(msg);
  });

});
