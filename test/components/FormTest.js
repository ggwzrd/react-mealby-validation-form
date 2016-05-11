/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

// Uncomment the following lines to use the react test utilities
// import React from 'react/addons';
// const TestUtils = React.addons.TestUtils;

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { render } from 'enzyme';
import Form from 'components/Form';

describe('<Form />', () => {

  it('it can subscribe inputs', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <Form>
        <DummyInput/>
      </Form>
    );

    const renderedForm = ReactTestUtils.findRenderedComponentWithType(
      tree,
      Form
    );

    expect(renderedForm.inputs).to.be.an('object');
    expect(renderedForm.inputs).to.have.property('test-field');
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
    return null;
  }
});



