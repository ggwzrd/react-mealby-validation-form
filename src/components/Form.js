import _ from 'underscore';
import warning from 'warning';

import React from 'react';
import ReactDOM from 'react-dom';

const Form = React.createClass({
  propTypes:{
    children: React.PropTypes.oneOfType([
      React.PropTypes.node,
      React.PropTypes.array
    ]),
    defaultData: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
    onValidate: React.PropTypes.func
  },
  childContextTypes: {
    form: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      form: this
    };
  },
  getDefaultProps: function() {
    return {
      onSubmit: () => {},
      onValidate: (dataModel, next) => {  next(); }
    };
  },
  getInitialState: function() {
    return {
      isValid: false,
      errors: {},
    };
  },
  componentWillMount: function() {
    // register a container for inputs and data
    this.inputs = {}; 
    this.model = {}; 
  },
  componentDidMount: function() {
    this._ready = true;
    this._validateModel();
  },
  componentDidUpdate: function(prevProps) {
    if (prevProps.onValidate !== this.props.onValidate) {
      this._validateModel();
    }
  },
  subscribeInput: function(inputComponent) {
    const inputName = inputComponent.getName();
    let initialValue = inputComponent.getDefaultValue();

    // default value specified on the field component overrides
    // the default value specified on the parent form
    if (!initialValue && this.props.defaultData[inputName]) {
      initialValue = this.props.defaultData[inputName];
    }

    // input component with same name are not considered valid
    if(!!this.inputs[inputName]) {
      warning(true, 'An input with name "' + this.inputs[name].props.name + '" already exists.');
    } else {
      // register the input and save the initial value
      this.inputs[inputName] = inputComponent;
      this.model[inputName] = initialValue;

      // validate the model when a new input is added
      this._validateModel();
    }
  },
  unsubscribeInput: function(inputComponent) {
    const inputName = inputComponent.getName();
    
    // unregister the input and delete model value
    this.inputs = _.omit(this.inputs, inputName);
    this.model = _.omit(this.model, inputName);

    // validate the model when an input is removed
    this._validateModel();
  },
  getModel: function() {
    return this.model;
  },
  isValid: function() {
    return this.state.isValid;
  },
  submit: function() {
    return this._handleSubmit();
  },
  _handleSubmit: function(e) {
    // block the execution in case the form should be submitted
    // normally and it's valid
    if (this.props.url && this.state.isValid) {
      return;
    }

    if (this.state.isValid) {
      return this.props.onSubmit(e, this.getModel());
    }

    // prevent normal form submission
    e && e.preventDefault();
  },
  _handleValidationResponse: function(errors) {
    this.setState({
      isValid: !errors,
      errors: errors
    });
  },
  _validateModel: function() {
    // prevent validation if the form 
    // is not ready yet
    if (this._ready) {
      this.props.onValidate(this.getModel(), this._handleValidationResponse);
    }
  },
  render: function(){
    let {
      children, // eslint-disable-line
      defaultData, // eslint-disable-line
      onSubmit, // eslint-disable-line
      onValidate, // eslint-disable-line
      ...others
    } = this.props;

    return (
      <form 
       {...others}
       ref="form"
       onSubmit={this._handleSubmit}>
        {children}
      </form>
    );
  }
});

export default Form;
