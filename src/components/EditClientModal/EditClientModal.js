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
        <div className="modal-edit__container">
            <div className="modal-edit__content">
                <button onClick={onClose} className="modal-edit__close-btn">
                    <img src={closeIcon} alt="close icon" />
                </button>
                <h2>Edit Client</h2>
                <form className="form-edit" onSubmit={handleEditSubmit}>

                    <div className="form-edit__field">
                        <label className="form-edit__label">Name:</label>
                        <input type="text" name="name" value={clientData.name} onChange={handleEditChange} />
                    </div>

                    <div className="form-edit__field">
                        <label className="form-edit__label">Email:</label>
                        <input type="email" name="email" value={clientData.email} onChange={handleEditChange} />
                    </div>

                    <div className="form-edit__field">
                        <label className="form-edit__label">Phone:</label>
                        <input type="text" name="phone" value={clientData.phone} onChange={handleEditChange} />
                    </div>

                    <div className="form-edit__field">
                        <label className="form-edit__label">Address:</label>
                        <input type="text" name="address" value={clientData.address} onChange={handleEditChange} />
                    </div>
                    <div className="modal-edit__btn-container">
                        <button type="button" onClick={onClose} className="modal-edit__cancel-btn">Cancel</button>
                        <button type="submit" className="modal-edit__update-btn">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;
