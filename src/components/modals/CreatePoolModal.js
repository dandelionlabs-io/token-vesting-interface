import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ethers } from "ethers";
import Factory from "../../abi-js/Factory";

const CreatePoolModal = (props) => {
  const { isOpen, setIsCreateModalOpen, ethProvider } = props;

  const [name, setName] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleClose = () => setIsCreateModalOpen(false);

  const createPool = async () => {
    const contract = new ethers.Contract(
      process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS,
      Factory,
      ethProvider.getSigner()
    );
    setIsPending(true);

    const tx = await contract
      .createFullPool(
        name,
        process.env.REACT_APP_TOKEN_ADDRESS,
        startTime,
        duration
      )
      .catch((e) => {
        alert(e.message);
        setIsPending(false);
      });

    tx.wait().then(() => window.location.reload());
  };

  return (
    <Modal show={isOpen} centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Pool creation window</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Name</p>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <p>Start time</p>
        <input
          type="number"
          onChange={(e) => setStartTime(parseInt(e.target.value))}
        />
        <p>Duration</p>
        <input
          type="number"
          onChange={(e) => setDuration(parseInt(e.target.value))}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={createPool} disabled={isPending}>
          {isPending ? "Pending..." : "Create"}
        </Button>
        <Button variant="secondary" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePoolModal;
