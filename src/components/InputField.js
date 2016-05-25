import React from 'react';

export default class InputField extends React.Component {
  static contextTypes = {
    form: React.PropTypes.object.isRequired
  };

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
    onChange: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);

    //set the initial state
    this.state = {
      isValid: true,
      error: null
    };
  }

  componentWillMount() {
    // The "pristine" value is the default value of the field
    // and can be passed by the form or directly as a prop
    // of this component. Let's keep a reference
    this._pristineValue = this.props.defaultValue;

    // subscribe the input to the form
    this._getForm().subscribeInput(this, function(defaultValue){
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
  }

  componentWillUnmount() {
    // unsubscribe the input from the form
    this._getForm().unsubscribeInput(this);
  }

  getName() {
    return this.props.name;
  }

  getValue() {
    return this.state.value;
  }

  resetValue() {
    // use the pristine value as default value
    this.setState({value: this._pristineValue});
  }

  _handleChangeValue = (e, customValue) => {
    let value = customValue;

    if (!value && e) {
      value = e.target.value;
    }

    this.setState({value: value}, () => {
      if (this.props.onChange) {
        this.props.onChange(e, value);
      }
    });
  }

  _getForm = () =>  {
    return this.context.form;
  }

  _createInputElement = (child) => {
    return React.cloneElement(child, {
      value: this.state.value, 
      name: this.props.name, 
      valid: this.state.isValid,
      onChange: this._handleChangeValue,
      error: this.state.error
    });
  }

  render() {
    let {
      name, // eslint-disable-line
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
}
