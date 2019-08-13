import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

const Registration = ({ authorize, showSpinner }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const register = async e => {
    e.preventDefault();

    showSpinner();

    try {
      const res = await axios.post('/api/registration', {
        username, password
      });
    
      errorHandler(res.data);
      
      if (res.data.registred) {
        localStorage.setItem('user', username);
        localStorage.setItem('token', res.data.token)
        authorize(username);
        showSpinner();
        return;
      }

    } catch(err) {
      console.log(err);
    }

    showSpinner();
  }

  const both = 'fulfill this field';

  const errorHandler =  type => {
    const errors = {
      'username: Path `username` is required., password: Path `password` is required.': both,
      'username: Path `username` is required., password: Short password': both,
      'username: Path `username` is required.': 'enter username',
      'password: Path `password` is required.': 'enter password',
      'password: Short password': 'short password',
      'username taken': 'username taken',
      'default': ''
    };

    setResult(errors[type] || errors['default']);
  };

  const IsInvalid = field  => {
    if (result.includes(field) || result === both)
      return true;
    return false;
  };

  return (
    <Form onSubmit={(e) => register(e)}> 
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Nickname</Form.Label>
        <Form.Control 
          type="username"
          placeholder="Nickname" 
          value={username}
          onChange={e => setUsername(e.target.value)}
          isInvalid={IsInvalid('username')}
          />
        <Form.Text className="text-danger">
          {IsInvalid('username') ? result : ''}
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control 
          type="password"
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          isInvalid={IsInvalid('password')} 
          />
          <Form.Text className="text-danger">
            {IsInvalid('password') ? result : ''}
          </Form.Text>
      </Form.Group>
      <Form.Group controlId="formBasicChecbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  showSpinner: () => dispatch({ type: 'SHOW_SPINNER' }),
  authorize: username => dispatch({
    type: 'AUTHORIZE',
    payload: {
      username
    }
  }),
});

export default connect(null, mapDispatchToProps)(Registration);