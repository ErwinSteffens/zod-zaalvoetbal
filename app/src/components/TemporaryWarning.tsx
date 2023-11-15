import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';

const TemporaryWarning = () => {
  return (
    <Row>
      <Col xs={12}>
        <Alert className="text-center" variant="danger">
          <strong>Let op!</strong> Het kan zijn dat er in de komende periode nog
          wijzigingenplaats vinden in het speelschema!
        </Alert>
        <br />
      </Col>
    </Row>
  );
};

export default TemporaryWarning;
