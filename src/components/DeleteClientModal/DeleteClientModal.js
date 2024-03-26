import closeIcon from "../../assets/images/icons/close-24px.svg";
import "./DeleteClientModal.scss";
import React from "react";

const DeleteClientModal = ({ isOpen, onClose, onDelete, selectedClientToDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-del-client__container">
      <div className="modal-del-client__content">
        <button onClick={onClose} className="modal-del-client__close-btn">
          <img src={closeIcon} alt="close icon" />
        </button>
        <h2 className='modal-del-client__title'>Are you sure you want to delete this client?</h2>
        <div>
          <h3>Name:</h3><p>{selectedClientToDelete.name}</p></div>
        <div><h3>Email:</h3><p>{selectedClientToDelete.email}</p> </div>
        <div><h3>Phone: </h3><p>{selectedClientToDelete.phone}</p></div>
        <div><h3>Address:</h3><p>{selectedClientToDelete.address}</p> </div>
        <div className="modal-del-client__btn-container">
          <button onClick={onClose} className="modal-del-client__cancel-btn">Cancel</button>
          <button onClick={onDelete} className="modal-del-client__delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClientModal;
