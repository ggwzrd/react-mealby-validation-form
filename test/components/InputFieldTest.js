/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {shallow, mount} from 'enzyme';
import InputField from 'components/InputField';

const spy = sinon.spy;
const subscribeInput = spy();
const unsubscribeInput = spy();

describe('<InputField />', () => {
  beforeEach(() => {
    subscribeInput.reset();
    unsubscribeInput.reset();
  });

  it('should implement interface', () => {
    expect(InputField.prototype.getName, 'Did not implement getName()').to.be.a('function');
    expect(InputField.prototype.getDefaultValue, 'Did not implement getDefaultValue()').to.be.a('function');
    expect(InputField.prototype.setValue, 'Did not implement setValue()').to.be.a('function');
    expect(InputField.prototype.resetValue, 'Did not implement reset()').to.be.a('function');
  });

  it('should render child component with props', () => {
    const wrapper = mount(
      <DummyForm>
        <InputField name="test-field" defaultValue="default-value">
          <input type="text"/>
        </InputField>
      </DummyForm>
    );

    expect(wrapper.find('input'), 'Did not rendered child component').to.be.an('object');
    expect(wrapper.find('input').props().value).to.equal('default-value');
    expect(wrapper.find('input').props().name).to.equal('test-field');
    expect(wrapper.find('input').props().isValid).to.equal(true);
    //expect(wrapper.find('input').props().error).to.equal(null);
  });

  it('should be able to subsbribe/unsubscribe to the form', () => {
    const wrapper = mount(
      <DummyForm>
        <InputField name="test-field" defaultValue="default-value">
          <input type="text"/>
        </InputField>
      </DummyForm>
    );

    expect(subscribeInput.calledOnce).to.equal(true);
    expect(unsubscribeInput.called).to.equal(false);

    wrapper.unmount();

    expect(unsubscribeInput.calledOnce).to.equal(true);
  });

  it('should change the child value when the value change', () => {
    const formWrapper = shallow(<DummyForm/>);
    const fieldWrapper = shallow(
      <InputField name="test-field" defaultValue="default-value">
        <input type="text"/>
      </InputField>
    , {context: {form : formWrapper.instance()}});

    const mountedComponent = fieldWrapper.instance();
    mountedComponent.setValue('new-test-value');

    expect(fieldWrapper.find('input').props().value).to.equal('new-test-value');
  });

  it('should render an error if is not valid', () => {
    const formWrapper = shallow(<DummyForm/>);
    const fieldWrapper = mount(
      <InputField name="test-field" defaultValue="default-value">
        <DummyInput/>
      </InputField>
    , {context: {form : formWrapper.instance()}});

    expect(fieldWrapper.find('p.error')).to.have.length(0);

    fieldWrapper.setProps({valid: false});
    expect(fieldWrapper.find('p.error')).to.have.length(1);
  });

  it('should reset the value', () => {
    const formWrapper = shallow(<DummyForm/>);
    const fieldWrapper = mount(
      <InputField name="test-field" defaultValue="default-value">
        <input type="text"/>
      </InputField>
    , {context: {form : formWrapper.instance()}});

    const mountedComponent = fieldWrapper.instance();
    mountedComponent.setValue('new-test-value');

    expect(fieldWrapper.find('input').props().value).to.equal('new-test-value');

    mountedComponent.resetValue();

    expect(fieldWrapper.find('input').props().value).to.equal('default-value');
  });
});

const DummyForm = React.createClass({
  childContextTypes: {
    form: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      form: this
    };
  },
  subscribeInput: subscribeInput,
  unsubscribeInput: unsubscribeInput,
  render: function() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
});

const DummyInput = React.createClass({
  render: function() {
    console.log(this.props.error);
    return (
      <div>
        {this.props.value}
        {!this.props.valid && (
          <p className="error">{this.props.error}</p>
        )}
      </div>
    );
  }
});

