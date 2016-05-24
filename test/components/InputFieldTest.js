/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {shallow, mount} from 'enzyme';
import InputField from 'components/InputField';

const spy = sinon.spy;
const subscribeInput = spy((component, next) => { next.call(component,'default-value'); });
const unsubscribeInput = spy();

describe('<InputField />', () => {
  beforeEach(() => {
    subscribeInput.reset();
    unsubscribeInput.reset();
  });

  it('should implement interface', () => {
    expect(InputField.prototype.getName, 'Did not implement getName()').to.be.a('function');
    expect(InputField.prototype.getValue, 'Did not implement getValue()').to.be.a('function');
    expect(InputField.prototype.resetValue, 'Did not implement reset()').to.be.a('function');
  });

  it('should render child component', () => {
    const wrapper = mount(
      <DummyForm>
        <InputField name="test-field" defaultValue="custom-value">
          <DummyInput/>
        </InputField>
      </DummyForm>
    );

    expect(wrapper.find(DummyInput), 'Did not rendered child component').to.have.length(1);
    expect(wrapper.find(DummyInput).props()).to.have.all.keys(['value','name','valid','error','onChange']);
    expect(wrapper.find(DummyInput).prop('value')).to.equal('custom-value');
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

  it('should change the state value when child value change', () => {
    const formWrapper = shallow(<DummyForm/>);
    const fieldWrapper = mount(
      <InputField name="test-field" defaultValue="default-value">
        <input type="text"/>
      </InputField>
    , {context: {form : formWrapper.instance()}});


    fieldWrapper.find('input').simulate('change',{target:{value:'custom-value'}});

    const mountedComponent = fieldWrapper.instance();
    expect(mountedComponent.getValue()).to.equal('custom-value');
  });

  it('should render an error if is not valid', () => {
    const formWrapper = shallow(<DummyForm/>);
    const fieldWrapper = mount(
      <InputField name="test-field" defaultValue="default-value">
        <DummyInput/>
      </InputField>
    , {context: {form : formWrapper.instance()}});

    expect(fieldWrapper.find('p.error')).to.have.length(0);

    fieldWrapper.setState({isValid: false});
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

    fieldWrapper.find('input').simulate('change',{target:{value:'custom-value'}});
    expect(mountedComponent.getValue()).to.equal('custom-value');

    mountedComponent.resetValue();

    expect(mountedComponent.getValue()).to.equal('default-value');
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

