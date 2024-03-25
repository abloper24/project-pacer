import closeIcon from "../../assets/images/icons/close-24px.svg";
import "./DeleteClientModal.scss";
import React from "react";

const DeleteClientModal = ({ isOpen, onClose, onDelete, selectedClientToDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal__container">
      <div className="modal__content">
        <button onClick={onClose} className="modal__close-btn">
          <img src={closeIcon} alt="close icon" />
        </button>
        <h2 className='modal__title'>Are you sure you want to delete this client?</h2>
        <div>Name:{selectedClientToDelete.name}</div>
        <div>Email: {selectedClientToDelete.email}</div>
        <div>Phone: {selectedClientToDelete.phone}</div>
        <div>Address: {selectedClientToDelete.address}</div>
        <div className="modal__btn-container">
          <button onClick={onClose} className="modal__cancel-btn">Cancel</button>
          <button onClick={onDelete} className="modal__delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClientModal;
