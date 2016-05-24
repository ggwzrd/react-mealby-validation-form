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
    const defaultValue = 'default-value';
    const renderedForm = shallow(<Form defaultData={{testField: defaultValue}}/>).instance();
    const renderedInput = shallow(<DummyInput />).instance();

    const testPropertyName = renderedInput.getName();
    const nextHandlerStub = spy((formDefaultValue) => {
      expect(formDefaultValue, 'Did not pass the default value').to.equal(defaultValue);
    });

    // subscribe the input
    renderedForm.subscribeInput(renderedInput, nextHandlerStub);
    const isDummyInput = TestUtils.isCompositeComponentWithType(renderedForm.inputs[testPropertyName], DummyInput);

    expect(renderedForm.inputs, 'Did not register the input').to.have.property(testPropertyName);
    expect(isDummyInput, 'Did not registered a correct input').to.equal(true);
    expect(nextHandlerStub.calledOnce, 'Did not call the callback').to.equal(true);

    // // unsubscribe the input
    renderedForm.unsubscribeInput(renderedInput);

    expect(renderedForm.inputs, 'Did not unsubscribe the input').not.to.have.property(testPropertyName);
  });

  it('should get the model', () => {
    const renderedForm = shallow(<Form defaultData={{testField: 'default-value'}}/>).instance();
    const renderedInput = shallow(<DummyInput />).instance();

    renderedForm.subscribeInput(renderedInput);

    expect(renderedForm.getModel()).to.have.property('testField', 'test-value');
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
  getName(){ 
    return 'testField'; 
  },
  getValue(){ 
    return 'test-value'; 
  },
  render(){
    return <span/>;
  }
});
