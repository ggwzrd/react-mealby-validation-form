require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Form from './Form';
import InputField from './InputField';
import SkillInput from './SkillInput';
import List from './ListCombo';

const AppComponent = React.createClass({
  
  render: function(){
    return (
      <div className="index">
        <Form>
          <InputField name="nome">
            <input type="text"/>
          </InputField>

          <InputField name="email" defaultValue="example@email.com">
            <input type="email"/>
          </InputField>

          <InputField name="password">
            <input type="password"/>
          </InputField>

          <InputField name="skills">
            <SkillInput/>
          </InputField>
          <InputField name="list">
            <List />
          </InputField>
        </Form>
      </div>
    );
  }
});

export default AppComponent;
