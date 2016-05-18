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
    // Validation succeed if it does not returns any error
    handleValidate: spy((model, next) => { next() }), 
    // Validation fails if it returns any error
    handleFailValidate: spy((model, next) => { next({'test-field' : 'validation error'}); }) 
  };

  beforeEach(() => {
    handlersStub.handleSubmit.reset();
    handlersStub.handleValidate.reset();
    handlersStub.handleFailValidate.reset();
  });

  it('should implement interface', () => {
    expect(Form.prototype.subscribeInput, 'Did not implement subscribeInput(inputComponent)').to.be.a('function');
    expect(Form.prototype.unsubscribeInput, 'Did not implement unsubscribeInput(inputName)').to.be.a('function');
    expect(Form.prototype.getModel, 'Did not implement getModel()').to.be.a('function');
    expect(Form.prototype.isValid, 'Did not implement isValid()').to.be.a('function');
    expect(Form.prototype.submit, 'Did not implement submit()').to.be.a('function');
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
    const testPropertyName = renderedInput.getName();

    // subscribe the input
    renderedForm.subscribeInput(renderedInput);
    let model = renderedForm.getModel();

    expect(model, 'Did not register the input in the model').to.have.property(testPropertyName);
    expect(renderedForm.inputs, 'Did not register the input').to.have.property(testPropertyName);

    const isDummyInput = TestUtils.isCompositeComponentWithType(renderedForm.inputs[testPropertyName], DummyInput);
    expect(isDummyInput, 'Did not the input component').to.equal(true);
    expect(model[testPropertyName], 'Did not register the input default value').to.equal(renderedInput.getDefaultValue());

    // // unsubscribe the input
    renderedForm.unsubscribeInput(renderedInput);
    model = renderedForm.getModel();

    expect(renderedForm.inputs, 'Did not unsubscribe the input').not.to.have.property(testPropertyName);
    expect(model, 'Did not deleted the input from the model').not.to.have.property(testPropertyName);
  });

  it('should validate the model when mounted', () => {
    const wrapper = mount(<Form onValidate={handlersStub.handleValidate}/>);
    const renderedForm = wrapper.instance();

    expect(handlersStub.handleValidate.calledOnce).to.equal(true);
    expect(handlersStub.handleValidate.calledWith(renderedForm.getModel()), 'Did not pass the model as parameter to the validation function').to.equal(true);
  });

  it('should submit based on validation', () => {
    const wrapper = mount(
      <Form onSubmit={handlersStub.handleSubmit} onValidate={handlersStub.handleValidate}>
        <DummyInput />
        <button type="submit"/>
      </Form>
    );

    wrapper.find('form').simulate('submit');
    expect(handlersStub.handleValidate.called, 'Does not call validation on submit').to.equal(true);
    expect(handlersStub.handleSubmit.calledOnce, 'Does not submit with valid form').to.equal(true);

    // simulate submit
    handlersStub.handleSubmit.reset();
    wrapper.instance().submit();
    expect(handlersStub.handleSubmit.calledOnce, 'Did not submit with public method').to.equal(true);

    handlersStub.handleSubmit.reset();
    wrapper.find('button').simulate('click');
    expect(handlersStub.handleSubmit.calledOnce, 'Did not submit with button form').to.equal(true);

    // switch the validation handler
    wrapper.setProps({onValidate: handlersStub.handleFailValidate});

    // simulate submit
    handlersStub.handleSubmit.reset();
    wrapper.find('form').simulate('submit');
    expect(handlersStub.handleSubmit.called, 'Did submit invalid form').to.equal(false);
  });
});

const DummyInput = React.createClass({
  value: 'test-value',
  getName(){ 
    return 'test-field'; 
  },
  getDefaultValue(){ 
    return this.value; 
  },
  setValue(value){ 
    this.value = value; 
  },
  render(){
    return <span/>;
  }
});
