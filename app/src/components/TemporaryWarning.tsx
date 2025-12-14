import React from 'react';
import { Row, Col, Alert, Modal, Button } from 'react-bootstrap';
import useAutoResetStorageValue from '../util/usePersistantState';

const TemporaryAlert = () => {
  return (
    <Alert className="text-center" variant="warning">
      Let op! Er kunnen nog wijzigingen plaats vinden in het speelschema!
      <br />
      <br />
      Houd altijd de website goed in de gaten voor de meest actuele informatie.
    </Alert>
  );
};

const TemporaryWarning = ({ modal = false }: { modal: boolean }) => {
  const [show, setShow] = useAutoResetStorageValue<boolean>(
    'temp-warning-modal',
    modal,
  );
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Let op!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TemporaryAlert />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Sluit
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col xs={12}>
          <TemporaryAlert />
          <br />
        </Col>
      </Row>
    </>
  );
};

export default TemporaryWarning;
