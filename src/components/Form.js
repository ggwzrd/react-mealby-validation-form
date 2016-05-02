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
    this.inputs[name] = inputComponent;
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
