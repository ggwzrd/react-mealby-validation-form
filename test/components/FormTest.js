/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

// Uncomment the following lines to use the react test utilities
// import React from 'react/addons';
// const TestUtils = React.addons.TestUtils;

import React from 'react';
import { mount } from 'enzyme';
import Form from 'components/Form';

describe('<Form />', () => {

  let tree;

  beforeEach(() => {
    tree =  mount(
      <Form>
        <DummyInput/>
      </Form>
    );
  });

  it('has inputs', () => {
    const renderedForm = tree.instance();
    expect(renderedForm.inputs).to.be.an('object');
  })

  it('should be able to subscribe inputs', () => {
    const renderedForm = tree.instance();
    expect(renderedForm.inputs).to.have.property('test-field');
  });

  it('should be able to unsubscribe inputs', () => {
    // remove child DummyInput
    tree.setProps({children: undefined});

    const renderedForm = tree.instance();
    expect(renderedForm.inputs).not.to.have.property('test-field');
  });
});

const DummyInput = React.createClass({
  contextTypes:{
    form: React.PropTypes.object,
  },
  componentWillMount: function() {
    this.context.form.subscribeInput('test-field', this);
  },
  componentWillUnmount: function() {
    this.context.form.unsubscribeInput('test-field');
  },
  render: function() {
    return <span/>;
  }
});
