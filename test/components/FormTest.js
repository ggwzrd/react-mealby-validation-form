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
    const wrapper = shallow(<Form />);
    const renderedForm = wrapper.instance();

    expect(renderedForm.subscribeInput).to.be.a('function');
    expect(renderedForm.unsubscribe).to.be.a('function');
    expect(renderedForm.getModel).to.be.a('function');
    expect(renderedForm.isValid).to.be.a('function');
    expect(renderedForm.submit).to.be.a('function');
  });

  it('should create an empty data model', () => {
    const wrapper = shallow(<Form />);
    const renderedForm = wrapper.instance();
    const dataModel = renderedForm.getModel();

    expect(dataModel).to.be.an('object');
    expect(dataModel).to.be.empty;
  });

  it('should subscribe/unsubscribe inputs', () => {
    const wrapper = shallow(<Form />);
    const renderedForm = wrapper.instance();
    const inputStub = React.createElement(DummyInput);
    let model;

    // subscribe the input
    const testPropertyName = inputStub.getName();
    renderedForm.subscribeInput(inputStub);

    model = renderedForm.getModel();
    expect(model, 'did not register the input on the model').to.have.property(testPropertyName);
    expect(model[testPropertyName], 'did not register the input value').to.equal(inputStub.getValue());

    // unsubscribe the input
    renderedForm.unsubscribe(testPropertyName);

    model = renderedForm.getModel();
    expect(model, 'did not unsubscribed the input').not.to.have.property(testPropertyName);
  });

  it('should validate the model when mounted', () => {
    const wrapper = shallow(<Form onValidate={handlersStub.handleValidate}/>);
    const renderedForm = wrapper.instance();

    expect(handlersStub.handleValidate.called).to.equal(false);

    wrapper.render();

    expect(handlersStub.handleValidate.calledOnce).to.equal(true);
    expect(handlersStub.handleValidate.calledWith(renderedForm.getModel())).to.equal(true);
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

    expect(handlersStub.handleSubmit.calledTwice).to.equal(true);

    // reset the handler and switch the validation handler
    wrapper.setProps({onValidate: handlersStub.handleFailValidate});
    handlersStub.handleSubmit.reset();

    // simulate submit
    wrapper.find('button').simulate('click');
    wrapper.instance().submit();

    expect(handlersStub.handleSubmit.called, 'did submit whit invalid data model').to.equal(false);
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
