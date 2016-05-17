import React from 'react';

const InputField = React.createClass({
  contextTypes: {
    form: React.PropTypes.object.isRequired,
  },
  propTypes: {
    name: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      value: undefined
    };
  },
  componentWillMount: function() {
    this.context.form.subscribeInput(this.props.name, this);
  },
  componentWillUnmount: function(){
    this.context.form.unsubscribeInput(this.props.name);
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

export default InputField;
