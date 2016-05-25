import _ from 'underscore';
import React from 'react';

export default class SkillInput extends React.Component {
  static propTypes = {
    value : React.PropTypes.array,
    name : React.PropTypes.string,
    valid : React.PropTypes.bool,
    onChange : React.PropTypes.func,
    error : React.PropTypes.string
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      textValue: ''
    };
  }

  _handleChange = (e) => {
    this.setState({textValue: e.target.value});
  }

  _handleAdd = (e) => {
    e.preventDefault();
    const currentValue = _.extend([], this.props.value);

    currentValue.push({
      name: this.state.textValue,
      rating: 0
    });

    this.props.onChange(e, currentValue);
  }

  _createItem(item) {
    return (
      <li key={item.name}>{item.name} - {item.rating}</li>
    );
  }

  render() {
    const currentValue = this.props.value || [];

    return (
      <div>
        <input 
         type="text" 
         onChange={this._handleChange}
         value={this.state.textValue}/>
        <button onClick={this._handleAdd}>+</button>
        <ul>
          {currentValue.map(this._createItem)}
        </ul>
      </div>
    );
  }
}
