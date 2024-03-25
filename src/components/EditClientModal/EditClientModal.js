import closeIcon from "../../assets/images/icons/close-24px.svg";
import "./EditClientModal.scss";
import React, { useState, useEffect } from "react";

const EditClientModal = ({ isOpen, onClose, onUpdate, selectedClientToEdit }) => {
  const [clientData, setClientData] = useState({
      name: "",
      email: "",
      phone: "",
      address: "",
  });

  useEffect(() => {
      if (selectedClientToEdit) {
          setClientData({
              name: selectedClientToEdit.name || "",
              email: selectedClientToEdit.email || "",
              phone: selectedClientToEdit.phone || "",
              address: selectedClientToEdit.address || "",
          });
      }
  }, [selectedClientToEdit]);

  const handleEditChange = (e) => {
      const { name, value } = e.target;
      setClientData(prevState => ({
          ...prevState,
          [name]: value,
      }));
  };

  const handleEditSubmit = (e) => {
      e.preventDefault();
      onUpdate(clientData);
  };

  if (!isOpen) return null;

  return (
      <div className="modal__container">
          <div className="modal__content">
              <button onClick={onClose} className="modal__close-btn">
                  <img src={closeIcon} alt="close icon" />
              </button>
              <h2>Edit Client</h2>
              <form onSubmit={handleEditSubmit}>
                  <label>Name:</label>
                  <input type="text" name="name" value={clientData.name} onChange={handleEditChange} />

                  <label>Email:</label>
                  <input type="email" name="email" value={clientData.email} onChange={handleEditChange} />

                  <label>Phone:</label>
                  <input type="text" name="phone" value={clientData.phone} onChange={handleEditChange} />

                  <label>Address:</label>
                  <input name="address" value={clientData.address} onChange={handleEditChange}></input>

                  <div className="modal__btn-container">
                      <button type="button" onClick={onClose} className="modal__cancel-btn">Cancel</button>
                      <button type="submit" className="modal__update-btn">Update</button>
                  </div>
              </form>
          </div>
      </div>
  );
};

export default EditClientModal;
