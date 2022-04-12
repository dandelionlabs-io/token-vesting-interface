import React from "react";
import { Modal } from "react-bootstrap";

const LoadingModal = (props) => {
  const { isLoading } = props;

  return (
    <Modal show={isLoading} backdrop="static" centered>
      <Modal.Header>
        <Modal.Title>Loading...</Modal.Title>
      </Modal.Header>
    </Modal>
  );
};

export default LoadingModal;
