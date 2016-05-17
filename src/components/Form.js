import React from 'react';

const Form = React.createClass({
  propTypes:{
    children: React.PropTypes.oneOfType([
      React.PropTypes.node,
      React.PropTypes.array
    ]),
    defaultData: React.PropTypes.object
  },
  childContextTypes: {
    form: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      form: this
    };
  },
  componentWillMount: function(){
    this.inputs = {}; // put all the inputs here
  },
  componentDidMount: function(){
    console.log(this.inputs); // eslint-disable-line
  },
  subscribeInput: function(name, inputComponent){
    if(!this.inputs[name]){
        this.inputs[name] = inputComponent;
        this.inputs[name]._setValue(this.props.defaultData[name]);
    }else{
        this.inputs[name]._setError('Component already exist');
        this.inputs[name]._displayError();
        this.inputs[name]._setError('duplicated');
        console.error('!Component '+this.inputs[name]._getName()+' already exist'); // eslint-disable-line
    }
      
  },
  unsubscribeInput: function(name){
    this.inputs[name] = null;
  },
  render: function(){
    return (
      <form>
        {this.props.children}
      </form>
    );
  }
});

export default Form;
