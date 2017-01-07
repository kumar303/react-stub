/*eslint-disable no-loop-func */

import React, { Component, PropTypes } from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import reactStub from 'react-stub';


function componentFactory({type='es6', propTypes={},
                           defaultProps={}, render} = {}) {
  var defaultRender = () => {
    return <div/>;
  };

  var renderFunc = typeof render === 'function' ?
    render : defaultRender;

  var RealComponent;

  if (type === 'es6') {
    RealComponent = class RealComponent extends Component {
      static propTypes = propTypes;
      static defaultProps = defaultProps;
      render = renderFunc;
    };
  } else if (type === 'createClass') {
    RealComponent = React.createClass({
      getDefaultProps: function() {
        return defaultProps;
      },
      propTypes: propTypes,
      render: renderFunc,
    });
  } else {
    throw new Error(`Unexpected type ${type}`);
  }

  return RealComponent;
}



describe('reactStub', function() {

  it('requires a truthy component', function() {
    expect(() => reactStub()).to.throw(/realComponent is undefined/);
  });

  var types = ['es6', 'createClass'];


  for (let type of types) {
    let componentName = type === 'es6' ? 'RealComponent' : 'Function';

    it(`renders a stub component (${type})` , () => {
      var RealComponent = componentFactory({type: type});
      var Fake = reactStub(RealComponent);
      // This throws an error if the stub is not a component.
      ReactTestUtils.renderIntoDocument(<Fake/>);
    });

    it(`lets you find a fake component (${type})`, () => {
      let render = () => {
        return <span>real</span>;
      };
      var RealComponent = componentFactory({type: type, render: render});
      var Fake = reactStub(RealComponent);
      var container = ReactTestUtils.renderIntoDocument(<Fake/>);

      // This will throw an error if it can't be found.
      ReactTestUtils.findRenderedComponentWithType(container, Fake);
    });

    it(`lets you add children to the stub (${type})`, () => {
      let render = () => {
        return <span>real</span>;
      };
      var RealComponent = componentFactory({type: type, render: render});
      var Fake = reactStub(RealComponent);
      var NestedFake = reactStub(RealComponent);
      // No errors.
      ReactTestUtils.renderIntoDocument(
        <Fake>
          <NestedFake/>
        </Fake>
      );
    });

    it(`prevents you from setting an unknown property (${type})`, () => {
      let propTypes = {
        other: PropTypes.object,
      };
      var RealComponent = componentFactory({type: type, propTypes: propTypes});
      var Fake = reactStub(RealComponent);
      let msg = new RegExp(
        `reactStub:${componentName} does not accept property wrongAttr`);
      expect(() => ReactTestUtils.renderIntoDocument(
          <Fake wrongAttr="non-existant" />
        ))
        .to.throw(msg);
    });

    it(`allows you to set a known property (${type})`, () => {
      let propTypes = {
        foo: PropTypes.string.isRequired,
      };
      var RealComponent = componentFactory({type: type, propTypes: propTypes});

      var Fake = reactStub(RealComponent);
      // This should not throw an error.
      ReactTestUtils.renderIntoDocument(<Fake foo="thing" />);
    });

    it(`allows you to set a key property (${type})`, () => {
      var RealComponent = componentFactory({type: type});
      var Fake = reactStub(RealComponent);
      // This should not throw an error.
      // This is handled by default because React does not include in props.
      // It seemed like a good case to test anyway.
      ReactTestUtils.renderIntoDocument(<Fake key={5} />);
    });

    it(`prevents you from assigning an invalid property (${type})`, () => {
      let propTypes = {
        foo: PropTypes.string.isRequired,
      };
      var RealComponent = componentFactory({type: type, propTypes: propTypes});
      let msg = new RegExp(
        `Invalid prop \`foo\` of type \`number\` supplied to `+
        `\`reactStub:${componentName}\`, expected \`string\``
      );
      let Fake = reactStub(RealComponent);
      expect(() => ReactTestUtils.renderIntoDocument(<Fake foo={5} />))
        .to.throw(msg);
    });

    it(`prevents you from forgetting to set a required prop (${type})`, () => {
      let propTypes = {
        foo: PropTypes.string.isRequired,
      };
      var RealComponent = componentFactory({type: type, propTypes: propTypes});

      let msg = new RegExp(
        `Required prop \`foo\` was not specified ` +
        `in \`reactStub:${componentName}\``);
      let Fake = reactStub(RealComponent);
      expect(() => ReactTestUtils.renderIntoDocument(<Fake/>)).to.throw(msg);
    });

    it(`allows you to skip default values (${type})`, () => {
      let propTypes = {
        foo: PropTypes.string.isRequired,
      };
      let defaultProps = {
        foo: 'default value',
      };
      var RealComponent = componentFactory({type: type, propTypes: propTypes,
                                            defaultProps: defaultProps});
      var Fake = reactStub(RealComponent);
      // No error thrown.
      ReactTestUtils.renderIntoDocument(<Fake/>);
    });

    it(`prefers actual prop values rather than defaults (${type})`, () => {
      let propTypes = {
        foo: PropTypes.string.isRequired,
      };
      let defaultProps = {
        foo: 'default value',
      };
      var RealComponent = componentFactory({type: type, propTypes: propTypes,
                                            defaultProps: defaultProps});
      let msg = new RegExp(
        `Invalid prop \`foo\` of type \`number\` supplied to ` +
        `\`reactStub:${componentName}\`, expected \`string\``);
      let Fake = reactStub(RealComponent);
      expect(() => ReactTestUtils.renderIntoDocument(
          <Fake foo={9999} />
        ))
        .to.throw(msg);
    });
  }
});

