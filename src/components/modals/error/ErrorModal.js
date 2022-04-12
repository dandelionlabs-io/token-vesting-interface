import React from "react";
import { Modal, Button } from "react-bootstrap";

const ErrorModal = (props) => {
  const { isError, setIsError, errorMessage } = props;

  const handleClose = () => setIsError(false);

  return (
    <Modal show={isError} centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{errorMessage}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
