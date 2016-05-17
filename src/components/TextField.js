import React from 'react';

const TextField = React.createClass({
  contextTypes: {
    form: React.PropTypes.object
  },
  propTypes: {
    name: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      value: undefined,
      isValid: true,
      errorMessage: undefined,
    };
  },
  componentWillMount: function() {
    this.context.form.subscribeInput(this.props.name, this);
  },
  componentWillUnmount: function(){
    this.context.form.unsubscribeInput(this.props.name);
  },
  _setValue: function(value){
    this.setState({value:value});
  },
  _setValidity: function(value){
      this.setState({isValid: value});
  },
  _setError: function(message){
      this._setValidity(false);
      this.setState({errorMessage: message});
  },
  _displayError: function(){
      if(this._getValidity()){
        document.body.appendChild(<p>+this._getErrorMessage()+</p>);
        console.log('I am in');
      }
  },
  _getValue: function(){
    return this.state.value;
  },
  _getName: function(){
    return this.props.name;
  },
  _getType: function(){
    return this.props.type;
  },
  _getValidity: function(){
      return this.state.isValid;
  },
  _getErrorMessage: function(){
      return this.state.errorMessage;
  },
  _handleChange: function(e){
    var value = e.target.value;

    this.setState({
      value: value
    });
  },
  render: function(){
    let {
      name,
      defaultValue,
      ...others // eslint-disable-line
    } = this.props;

    return (
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        value={this.state.value}
        onChange={this._handleChange}/>
    );
  }
});

export default TextField;
