import _ from 'underscore';
import React from 'react';


export default class ListCombo extends React.Component {
  static propTypes = {
    value : React.PropTypes.string,
    name : React.PropTypes.string,
    valid : React.PropTypes.bool,
    onChange : React.PropTypes.func,
    error : React.PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    
    this.state = {
      currentlySelected: this.props.data[0].name,
    };
  }
  
   _createItem = (item) => {
    return (
      <option key={item} value={item}>
        {item}
      </option>
    );
  }
   _handleChangeBrand = (e) =>{
      this.setState({currentlySelected : e.target.value});
  }
  
  render() {
    console.log('rendered');
    return(
      <div>
        Brand: 
        <select  
          value={this.state.currentlySelected} 
          onChange={this._handleChangeBrand}>
            {this.props.data.map(function(item){
              return(this._createItem(item.name));
            }.bind(this))}
        </select>
        Size: <select>{
            this.props.data.map(function(item){
              let sizes;
              if(item.name===this.state.currentlySelected){
                sizes = item.size.map(this._createItem);
              }
              return(sizes);
        }.bind(this))} </select>
      </div>
    )
  }
}