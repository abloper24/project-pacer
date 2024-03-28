import closeIcon from "../../assets/images/icons/close-24px.svg";
import "./DeleteModal.scss";
import React, { useState } from "react";

const DeleteModal = ({ isOpen, onClose, onDelete, selectedEntryDelete, clients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!isOpen) return null;

  const taskDescription = selectedEntryDelete.description;
  const startDate = selectedEntryDelete.starttime.slice(0, 10);
  const startTime = selectedEntryDelete.starttime.slice(11, 19);
  const endTime = selectedEntryDelete.endtime.slice(11, 19);
  const clientName = clients.find(client => client.clientid === selectedEntryDelete.clientid)?.name;

  return (
    <div className="modal__container">
      <div className="modal__content">
        <button onClick={onClose} className="modal__close-btn">
          <img src={closeIcon} alt="close icon" />
        </button>
        <h2 className='modal__title'>Are you sure you want to delete this time entry?</h2>
        <div>
          <h3>
            Task:
          </h3>
          <p>
            {taskDescription}
          </p>
        </div>
        <div>
          <h3>
            Date:
          </h3>
          <p>
            {startDate}
          </p>
        </div>
        <div>
          <h3>
          Start Time:
          </h3>
          <p>
            {startTime}
          </p>
        </div>
        <div>
          <h3>
          End Time:
          </h3>
          <p>
            {endTime}
          </p>
        </div>
        <div>
          <h3>
          Client:
          </h3>
          <p>
            {clientName}
          </p>
        </div>


        <div className="modal__btn-container">
          <button onClick={onClose} className="modal__cancel-btn">Cancel</button>
          <button onClick={onDelete} className="modal__delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;