import _ from 'underscore';
import warning from 'warning';
import React from 'react';

export default class Form extends React.Component {
  static childContextTypes = {
    form: React.PropTypes.object
  };

  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.node,
      React.PropTypes.array
    ]),
    defaultData: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
    onValidate: React.PropTypes.func
  };

  static defaultProps = {
    defaultData: {},
    onSubmit: () => {},
    // validate with no errors as default
    onValidate: (dataModel, next) => {next();} 
  };

  constructor(props, context){
    super(props, context);
    // This will store all the input fields
    // registered on this form
    this.inputs = {};

    // register the initial state
    this.state = {
      isValid: false,
      errors: {}
    };
  }

  getChildContext() {
    return {
      form: this
    };
  }

  componentDidMount() {
    // Set the "ready" flag used to control validation.
    // We don't want to validate the form before it
    // gets mounted to the dom
    this._ready = true;
    this._validateModel();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onValidate !== this.props.onValidate) {
      this._validateModel();
    }
  }

  subscribeInput(inputComponent, next) {
    const inputName = inputComponent.getName();

    // input component with same name are not considered valid
    if (!!this.inputs[inputName]) {
      warning(true, 'An input with name "' + inputName + '" already exists.');
    } else {
      let initialValue;

      // Grab the initial value if it exists
      if (this.props.defaultData && this.props.defaultData[inputName]) {
        initialValue = this.props.defaultData[inputName];
      }

      // register the input
      this.inputs[inputName] = inputComponent;

      // validate the model when a new input is added
      // this will support fields dynamically added
      this._validateModel();

      // run the callback with the default value
      if (typeof next === 'function') {
        next.call(inputComponent, initialValue);
      }
    }
  }

  unsubscribeInput(inputComponent) {
    const inputName = inputComponent.getName();
    
    // unregister the input
    this.inputs = _.omit(this.inputs, inputName);

    // Validate the model when an input is removed.
    this._validateModel();
  }

  getModel() {
    return this._createModel();
  }

  isValid() {
    return this.state.isValid;
  }

  submit() {
    return this._handleSubmit();
  }

  _handleSubmit = (e) => {
    // block the execution in case the form should be submitted
    // normally and it's valid
    if (this.props.url && this.state.isValid) {
      return;
    }

    if (this.state.isValid) {
      return this.props.onSubmit(e, this.getModel());
    }

    // prevent normal form submission
    e && e.preventDefault();
  }

  _handleValidationResponse = (errors) => {
    this.setState({
      isValid: !errors,
      errors: errors
    });
  }

  _createModel = () => {
    let model = {};

    // grab the value of each registered input
    _.each(this.inputs, (component, name) => {
      model[name] = component.getValue();
    });

    // just to be sure...
    return _.extend({}, model); 
  }

  _validateModel = () => {
    // prevent validation if the form is not ready yet
    if (this._ready) {
      this.props.onValidate(this.getModel(), this._handleValidationResponse);
    }
  }

  render() {
    let {
      children, // eslint-disable-line
      defaultData, // eslint-disable-line
      onSubmit, // eslint-disable-line
      onValidate, // eslint-disable-line
    } = this.props;

    return (
      <form 
       ref="form"
       onSubmit={this._handleSubmit}>
        {children}
      </form>
    );
  }
}
