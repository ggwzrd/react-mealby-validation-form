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

});

const DummyForm = React.createClass({
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
