import React, { memo } from 'react';
import { Container, Row, Button, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import './styles.css'

const Header = memo(({ authorize, username }) =>
  <header>
    <Container fluid={true}>
      <Row>
        <Col xs="8" lg="10"><h2 className="logo">Amime-flood</h2></Col>
        <Col xs="1" lg="2">
          <span className="font-weight-bold span-username">{username} </span>
          <Button variant="light" onClick={() => authorize(null)}>
            logout
          </Button>
        </Col>
      </Row>
    </Container>
  </header>
)

const mapDispatchTopProps = dispatch => ({
  authorize: username => {
    localStorage.clear();
    dispatch({ type: 'AUTHORIZE', payload: { username } })
  },
});

export default connect(null, mapDispatchTopProps)(Header);