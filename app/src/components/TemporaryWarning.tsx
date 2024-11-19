import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';

const TemporaryWarning = () => {
  return (
    <Row>
      <Col xs={12}>
        <Alert className="text-center" variant="danger">
          <p>
            <strong>Let op!</strong> Het kan zijn dat er in de komende periode
            nog wijzigingen plaats vinden in de poules of het speelschema!
          </p>
          <p>
            Houd de website goed in de gaten voor de meest actuele informatie.
          </p>
        </Alert>
        <br />
      </Col>
    </Row>
  );
};

export default TemporaryWarning;
