import React from 'react';
import Reflux from 'reflux';
import FormMixin from './../stores/FormMixin';

var FormStore = Reflux.createStore({
    mixins: [FormMixin.repository]
});

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
      isValid: true,
      error: null
    };
  },
  componentWillMount: function() {
    this.listenTo(FormStore.model,this._handleUpdateModel);
    this.context.form.subscribeInput(this.props.name, this);
  },
  componentWillUnmount: function(){
    this.context.form.unsubscribeInput(this.props.name);
  },
  getName: function(){
      return this.props.name;
  },
  getDefaultValue: function(){
      return this.props.defaultValue;
  },
  resetValue: function(){
      FormMixin.actions.modelUpdate(this.props.name, this.props.defaultValue);
  },
  _handleChange: function(e){
    var value = e.target.value;

    FormMixin.actions.modelUpdate(this.props.name, value);
  },
  _handleUpdateModel: function(model){
      this.setState({value:model[this.props.name]});
  },
  render: function(){
    let {
      name,
      defaultValue, // eslint-disable-line
      ...others 
    } = this.props;
      
    return (
      <div {...others}>
        {React.cloneElement(this.props.children, {value: this.state.value, name: name, isValid: this.state.isValid , error: this.state.error})}
      </div>
    );
  }
});

export default InputField;
