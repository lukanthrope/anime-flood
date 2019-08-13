import React, { useState, useEffect } from 'react';
import tyan from '../../pics/tyan3.png';
import tyan2 from '../../pics/tyan2.png';
import Registration  from './Registration';

import { Container, Row, Col } from 'react-bootstrap';
import './styles/styles.css'
import Login from './Login';

const Lendos = () => {
  const [hasAccount, setHasAccount] = useState(true); 

  const handleClick = () =>
    setHasAccount(prev => !prev);

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      document.body.style.background = 'white';
    }, []);

  return (
    <div className="container">
      <Container>
        <h1 className="h1-header">Wecome to Anime-Flood</h1>
        <Row>
          <Col xs="2" lg="3">
            <img className="firstPic lendingPic" src={tyan} alt={'tyan'} />
          </Col>
          <Col xs="8" lg="6">

          { hasAccount ? <h4>
              Sign in 
              <span className="text-muted small"> have no account?<span className="sign" onClick={handleClick}> sign up</span></span>
              
            </h4> : <h4>
              Registration 
              <span className="text-muted small"> have an account?<span className="sign" onClick={handleClick} > sign in</span></span>  
            </h4> } 
            
            { hasAccount ? <Login /> : <Registration /> } 
          </Col>
          <Col xs="2" lg="3">
            <img className="lendingPic" src={tyan2} alt={'tyan'} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Lendos;