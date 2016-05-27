import React, { Component } from 'react';



export default class Ratings extends Component {
  
  static propTypes = {
      onClick: React.PropTypes.func,
      value: React.PropTypes.number,
      maxRating: React.PropTypes.number,
  };
  static defaultProps = {
      maxRating: 3,
  };
  
  _handleClick(i, e) {
    e.preventDefault();
    this.props.onChange(i);
  }
  render() {
    let buttons = [];
    let color = {color: "red"}
    for(var i=1; i<=3; i++){ 
      buttons.push(
      <button 
        onClick={this._handleClick.bind(this, i)}
        key={i}
        style = {i === this.props.value ? color : null}>
        {i}
      </button>
      );
    }
    return (
      <div>
        {buttons}
      </div>
    );
  }
}
