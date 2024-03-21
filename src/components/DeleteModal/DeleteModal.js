import React from 'react';
import closeIcon from "../../assets/images/icons/close-24px.svg";
import "./DeleteModal.scss";

const DeleteModal = ({ isOpen, onClose, onDelete, deleteWarehouseName }) => {

    // console.log(deleteWarehouseName) yes deleteWarehouseName is being passed correctly
    
  if (!isOpen) return null;

  return (
    <div className="modal__container">
      <div className="modal__content">
        <button onClick={onClose} className="modal__close-btn">
          <img src={closeIcon} alt="close icon" />
        </button>
        <h2 className='modal__title'>Delete {deleteWarehouseName} warehouse?</h2>
        <p className='modal__description'>
          Please confirm that you'd like to delete the {deleteWarehouseName} from the list of warehouses.
          You won't be able to undo this action.
        </p>
        <div className="modal__btn-container">
          <button onClick={onClose} className="modal__cancel-btn">Cancel</button>
          <button onClick={onDelete} className="modal__delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;