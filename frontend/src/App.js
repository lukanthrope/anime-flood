import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Lendos from './components/lengind-page/Lendos';
import Chat from './components/Chat';
import Spinner from './components/Spinner';

import './App.css';

function App({ spinner }) {
  const [permitted, setPermitted] = useState(undefined);

  const check = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.get('/api/chat', { headers: {"Authorization" : `Bearer ${token}`} });
      setPermitted(true);
    } catch (err) {
      setPermitted(false);
    }
  };

  useEffect(() => {(
    async () => await check())()
  });
  
  return (
    <div className="App">
      { spinner && <Spinner /> }
      { typeof permitted === 'undefined' ? <Spinner /> : !permitted ? <Lendos /> : <Chat /> }  
    </div>
  );
}

const mapStateToProps = state => ({
  spinner: state.showSpinner,
  username: state.user,
});

export default connect(mapStateToProps)(App);
