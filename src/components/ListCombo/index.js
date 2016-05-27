import _ from 'underscore';
import React from 'react';

const data= [
      {name: 'Obey',
       size:['M','L', 'XL']},
      {name: 'Vans',
       size:['S','L', 'XL']},
      {name: 'Convers',
       size:['S','M', 'L']}
    ];

export default class SkillInput extends React.Component {
  static propTypes = {
    value : React.PropTypes.string,
    name : React.PropTypes.string,
    valid : React.PropTypes.bool,
    onChange : React.PropTypes.func,
    error : React.PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    
    let sizes =[];
    for(let i=0;i<3;i++){
      sizes.push(this._createItem(data[0].size[i]));
    }
    
    this.state = {
      currentlySelected: '',
      sizes: sizes
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
     this.setState({currentlySelected: e.target.value}); 
     let i, y;
     let item = [];
     for(i=0;i<3;i++){
       if(data[i].name === e.target.value){
         for(y=0;y<3;y++){
          item.push(this._createItem(data[i].size[y]));
         };
         i=3;
       };
      };
     this.setState({sizes: item });
    }
  
  render() {
    let options = [];
    for(let i=0;i<3;i++){
      options.push(this._createItem(data[i].name));
    }
    return(
      <div>
        Brand: 
        <select  
          value={this.state.currentlySelected} 
          onChange={this._handleChangeBrand}>
            {options}
        </select>
        Size: <select> {this.state.sizes} </select>
      </div>
    )
  }
}