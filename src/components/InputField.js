import React from 'react';

const InputField = React.createClass({
  contextTypes: {
    form: React.PropTypes.object.isRequired,
  },
  propTypes: {
    name: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
    onChange: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      isValid: true,
      error: null
    };
  },
  componentWillMount: function() {
    // The "pristine" value is the default value of the field
    // and can be passed by the form or directly as a prop 
    // of this component. Let's keep a reference
    this._pristineValue = this.props.defaultValue;

    // subscribe the input to the form
    this._getForm().subscribeInput(this, function(defaultValue) {
      // If the pristine value wasn't set before let's use the one 
      // provided by the form
      if (!this._pristineValue) {
        this._pristineValue = defaultValue;
      }

      //Default value can be passed by the form or directly on this input.
      //This input default props override form's default props
      this.setState({
        value: this._pristineValue
      });
    });
  },
  componentWillUnmount: function(){
    // unsubscribe the input from the form
    this._getForm().unsubscribeInput(this);
  },
  getName: function(){
    return this.props.name;
  },
  getValue: function(){
    return this.state.value;
  },
  resetValue: function(){
    // use the pristine value as default value
    this.setState({value: this._pristineValue});
  },
  _handleChangeValue: function(e, customValue) {
    const value = e ? e.target.value : customValue;

    this.setState({value: value}, function() {
      if (this.props.onChange) {
        this.props.onChange(e, value);
      }
    }.bind(this));
  },
  _getForm: function() {
    return this.context.form;
  },
  _createInputElement: function(child) {
    return React.cloneElement(child, {
      value: this.state.value, 
      name: this.props.name, 
      valid: this.state.isValid,
      onChange: this._handleChangeValue,
      error: this.state.error
    });
  },
  render: function(){
    let {
      name,
      defaultValue, // eslint-disable-line
      children,
      ...others 
    } = this.props;

    return (
      <div {...others}>
        {React.Children.map(children, this._createInputElement)}
      </div>
    );
  }
});

export default InputField;
