require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Form from './Form';
import TextField from './TextField';

const AppComponent = React.createClass({
  render: function(){
    var data = {
      first_name: 'Giulio',
      email: 'giulio@email.com'
    };

    return (
      <div className="index">
        <Form defaultData={data}>
          <InputField name="first_name"/>
        </Form>
      </div>
    );
  }
});

export default AppComponent;
