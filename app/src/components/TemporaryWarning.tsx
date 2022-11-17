import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';

const TemporaryWarning = () => {
  return (
    <Row>
      <Col xs={12}>
        <Alert className="text-center" variant="warning">
          Let op! Het kan zijn dat er in de komende periode nog wat kleine
          wijzigingen plaats vinden in het speelschema.
        </Alert>
        <br />
      </Col>
    </Row>
  );
};

export default TemporaryWarning;
