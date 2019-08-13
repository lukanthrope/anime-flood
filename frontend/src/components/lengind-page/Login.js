import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

const Login = ({ authorize, showSpinner }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const usernameError = 'enter your username';
  const passwordError = 'enter password';

  const login = async e => {
    e.preventDefault();

    showSpinner();

    if (username === '') {
      showSpinner();
      return setError(usernameError);
    } 
      
    if (password === '') {
      showSpinner();
      return setError(passwordError);
    }

    try {
      const res = await axios.post('/api/login', {
        username, password
      });
      console.log(res);
      if (res.data !== 'wrong username or password') {
        showSpinner();
        localStorage.setItem('user', username);
        localStorage.setItem('token', res.data);
        return authorize(username);
      } else {
        showSpinner();
        setError(res.data);
      }
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <Form onSubmit={(e) => login(e)}> 
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Nickname</Form.Label>
        <Form.Control 
          type="username"
          placeholder="Nickname" 
          value={username}
          onChange={e => setUsername(e.target.value)}
          isInvalid={error && error !== passwordError}
          />
          <Form.Text className="text-danger">
          { error === usernameError ? error : '' }
          </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control 
          type="password"
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          isInvalid={error && error !== usernameError}
          />
          <Form.Text className="text-danger">
          { error && error !== usernameError ? error : '' }
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
}

const mapDispatchTopProps = dispatch => ({
  showSpinner: () => dispatch({ type: 'SHOW_SPINNER' }),
  authorize: username => dispatch({
    type: 'AUTHORIZE',
    payload: {
      username
    }
  }),
});

export default connect(null, mapDispatchTopProps)(Login);