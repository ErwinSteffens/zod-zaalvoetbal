import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';

const TemporaryWarning = () => {
  return (
    <Row>
      <Col xs={12}>
        <Alert className="text-center" variant="danger">
          <strong>Let op!</strong> Het kan zijn dat er in de komende periode nog
          wijzigingen plaats vinden in de poules of het speelschema!
          <br />
          <br />
          Houd de website goed in de gaten voor de meest actuele informatie.
        </Alert>
        <br />
      </Col>
    </Row>
  );
};

export default TemporaryWarning;
