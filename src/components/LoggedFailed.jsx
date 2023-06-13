import React from 'react';
import { Col, Image, Row, Container } from 'react-bootstrap';

import ImageLoggedFailed from '../assets/undraw_Login_re_4vu2.png';

function LoggedFailed(props) {
  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <Image src={ImageLoggedFailed} style={{ width: '80%' }} />
        </Col>
        <Col>
          <div>
            <h1>El login es requerido para acceder a la pagina</h1>
            <p>
              Logueate en el siguiente enlace{' '}
              <a href="/login"  rel="noopener noreferrer">
                Login
              </a>{' '}
              Primero logueate ya que este acceso es limitado.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoggedFailed;