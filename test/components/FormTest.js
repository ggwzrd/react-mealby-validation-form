/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {shallow, mount} from 'enzyme';
import Form from 'components/Form';

const spy = sinon.spy;

describe('<Form />', () => {
  const handlersStub = {
    handleSubmit: spy(),
    handleValidate: spy(() => { return true; }),
    handleFailValidate: spy(() => { return false; })
  };

  beforeEach(() => {
    handlersStub.handleSubmit.reset();
    handlersStub.handleValidate.reset();
    handlersStub.handleFailValidate.reset();
  });

  it('should implement interface', () => {
    expect(Form.prototype.subscribeInput, 'expected to implement subscribeInput(inputComponent)').to.be.a('function');
    expect(Form.prototype.unsubscribeInput, 'expected to implement unsubscribeInput(inputName)').to.be.a('function');
    expect(Form.prototype.getModel, 'expected to implement getModel()').to.be.a('function');
    expect(Form.prototype.isValid, 'expected to implement isValid()').to.be.a('function');
    expect(Form.prototype.submit, 'expected to implement submit()').to.be.a('function');
  });

  it('should create an empty data model', () => {
    const wrapper = shallow(<Form />);
    const renderedForm = wrapper.instance();
    const dataModel = renderedForm.getModel();

    expect(dataModel).to.be.an('object');
    expect(dataModel).to.be.empty;
  });

  it('should subscribe/unsubscribe inputs', () => {
    const formWrapper = shallow(<Form />);
    const inputWrapper = shallow(<DummyInput />);

    const renderedForm = formWrapper.instance();
    const renderedInput = inputWrapper.instance();

    let model;

    // subscribe the input
    const testPropertyName = renderedInput.getName();
    renderedForm.subscribeInput(renderedInput);

    model = renderedForm.getModel();
    expect(model, 'expected to register the input on the model').to.have.property(testPropertyName);
    expect(model[testPropertyName], 'expected to register the input value').to.equal(renderedInput.getValue());

    // unsubscribe the input
    renderedForm.unsubscribeInput(testPropertyName);

    model = renderedForm.getModel();
    expect(model, 'expected to unsubscribed the input').not.to.have.property(testPropertyName);
  });

  it('should validate the model when mounted', () => {
    const wrapper = mount(<Form onValidate={handlersStub.handleValidate}/>);
    const renderedForm = wrapper.instance();

    expect(handlersStub.handleValidate.calledOnce, 'expected to validate only once').to.equal(true);
    expect(handlersStub.handleValidate.calledWith(renderedForm.getModel()),'expected to validate the model').to.equal(true);
  });

  it('should submit based on validation', () => {
    const formWithSubmit = (
      <Form onSubmit={handlersStub.handleSubmit} onValidate={handlersStub.handleValidate}>
        <button type="submit"/>
      </Form>
    );
    
    const wrapper = mount(formWithSubmit);

    // simulate submit
    wrapper.find('button').simulate('click');
    wrapper.instance().submit();

    expect(handlersStub.handleSubmit.calledTwice, 'expected to submit').to.equal(true);

    // reset the handler and switch the validation handler
    wrapper.setProps({onValidate: handlersStub.handleFailValidate});
    handlersStub.handleSubmit.reset();

    // simulate submit
    wrapper.find('button').simulate('click');
    wrapper.instance().submit();

    expect(handlersStub.handleSubmit.called, 'expected to not submit with invalid data model').to.equal(false);
  });
});

const DummyInput = React.createClass({
  value: 'test-value',
  getName(){ 
    return 'test-field'; 
  },
  getValue(){ 
    return this.value; 
  },
  setValue(value){ 
    this.value = value; 
  },
  render(){
    return <span/>;
  }
});
