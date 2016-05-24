import _ from 'underscore';
import warning from 'warning';
import React from 'react';

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
      defaultData: {},
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
    // This will store all the input fields
    // registered on this form
    this.inputs = {};
  },
  componentDidMount: function() {
    // Set the "ready" flag used to control validation.
    // We don't want to validate the form before it 
    // gets mounted to the dom
    this._ready = true;
    this._validateModel();
  },
  componentDidUpdate: function(prevProps) {
    if (prevProps.onValidate !== this.props.onValidate) {
      this._validateModel();
    }
  },
  subscribeInput: function(inputComponent, next) {
    const inputName = inputComponent.getName();

    // input component with same name are not considered valid
    if (!!this.inputs[inputName]) {
      warning(true, 'An input with name "' + inputName + '" already exists.');
    } else {
      let initialValue;

      // Grab the initial value if it exists
      if (this.props.defaultData && this.props.defaultData[inputName]) {
        initialValue = this.props.defaultData[inputName];
      }

      // register the input
      this.inputs[inputName] = inputComponent;

      // validate the model when a new input is added
      // this will support fields dynamically added
      this._validateModel();

      // run the callback with the default value
      if (typeof next === 'function') {
        next.call(inputComponent, initialValue);
      }
    }
  },
  unsubscribeInput: function(inputComponent) {
    const inputName = inputComponent.getName();
    
    // unregister the input
    this.inputs = _.omit(this.inputs, inputName);

    // Validate the model when an input is removed.
    this._validateModel();
  },
  getModel: function() {
    return this._createModel();
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
  _createModel: function() {
    let model = {};

    // grab the value of each registered input
    _.each(this.inputs, function(component, name){
      model[name] = component.getValue();
    });

    // just to be sure...
    return _.extend({}, model); 
  },
  _validateModel: function() {
    // prevent validation if the form is not ready yet
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
       ref="form"
       onSubmit={this._handleSubmit}>
        {children}
      </form>
    );
  }
});

export default Form;
