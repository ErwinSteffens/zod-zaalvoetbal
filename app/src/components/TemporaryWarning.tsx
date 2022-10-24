import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'

const TemporaryWarning = () => {
  return (
    <Row>
      <Col xs={12}>
        <Alert className="text-center" variant="warning">
          Let op! De speelschema's voor deze poule zijn nog niet definitief.
        </Alert>
        <br />
      </Col>
    </Row>
  )
}

export default TemporaryWarning
