import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';

const TemporaryWarning = () => {
  return (
    <Row>
      <Col xs={12}>
        <Alert className="text-center" variant="warning">
          Let op! We zijn nog druk bezig met de site en de speelschema&apos;s.
          Deze zijn dus nog niet definitief!
        </Alert>
        <br />
      </Col>
    </Row>
  );
};

export default TemporaryWarning;
