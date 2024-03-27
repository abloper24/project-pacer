import "./ClientsPage.scss";
import deleteIcon from '../../assets/images/icons/delete_outline-24px.svg'
import editIcon from '../../assets/images/icons/edit-24px.svg'
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import DeleteClientModal from "../../components/DeleteClientModal/DeleteClientModal";
import EditClientModal from "../../components/EditClientModal/EditClientModal";



import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";



function ClientsPage({ clients, getTimerEntries, getClients }) {


    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClientToDelete, setSelectedClientToDelete] = useState(null);

    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
    const [selectedClientToEdit, setSelectedClientToEdit] = useState(null);


    const navigate = useNavigate();


    //delete modal pop-up for clients
    const openClientModal = (client) => {
        setSelectedClientToDelete(client);
        setIsClientModalOpen(true);
    };
    
    const closeClientModal = () => {
        setIsClientModalOpen(false);
        setSelectedClientToDelete(null);
    };
    

    const deleteClient = async () => {
        if (selectedClientToDelete) {
            try {
                await axios.delete(`http://localhost:8080/clients/${selectedClientToDelete.clientid}`);
                closeClientModal();
                getClients();
            } catch (error) {
                console.error("Error deleting client:", error);
            }
        }
    };

    //edit client modal pop up
    const openEditClientModal = (client) => {
        setSelectedClientToEdit(client);
        setIsEditClientModalOpen(true);
    };

    const closeEditClientModal = () => {
        setIsEditClientModalOpen(false);
        setSelectedClientToEdit(null);
    };

    const updateClient = async (updatedClientData) => {
        if (selectedClientToEdit) {
            try {
                await axios.patch(`http://localhost:8080/clients/${selectedClientToEdit.clientid}`, updatedClientData);
                closeEditClientModal();
                getClients();
            } catch (error) {
                console.error("Error updating client:", error);
            }
        }
    };



    const handleAddNewClient = () => {
        navigate('/clients/add');
    };

    useEffect(() => {
        const fetchEntries = async () => {
            getTimerEntries();
        };
        fetchEntries();
    }, []);


    return (
        <>
            <section className="clients-page">
                <h1 className="clients-page__title">All your awesome Clients</h1>
                <div className="clients-page__actions">
                    <button onClick={handleAddNewClient} className="clients-page__add-btn">
                        Add New Client
                    </button>
                </div>

                <div className="clients-page__table">
                    <div className="clients-page__table-header">
                        <div className="client__td-heading">Name</div>
                        <div className="client__td-heading">Email</div>
                        <div className="client__td-heading">Phone</div>
                        <div className="client__td-heading">Address</div>
                        <div className="client__td-heading">Actions</div>
                    </div>

                    {clients.map((client) => (
                        <div key={client.clientid} className="client">
                            <div className="client__text client__name">{client.name}</div>
                            <div className="client__text">{client.email}</div>
                            <div className="client__text">{client.phone}</div>
                            <div className="client__text">{client.address}</div>
                            <div className="client__actions">
                                <button onClick={() => openClientModal(client)} className="client__delete-btn">
                                    <img src={deleteIcon} alt="Delete" />
                                </button>
                                <button onClick={() => openEditClientModal(client)} className="client__edit-btn">
                            <img src={editIcon} alt="Edit" />
                        </button>
                            </div>
                        </div>
                    ))}
                </div>

                <DeleteClientModal
                    isOpen={isClientModalOpen}
                    onClose={closeClientModal}
                    onDelete={deleteClient}
                    selectedClientToDelete={selectedClientToDelete}
                />

                <EditClientModal
                    isOpen={isEditClientModalOpen}
                    onClose={closeEditClientModal}
                    onUpdate={updateClient}
                    selectedClientToEdit={selectedClientToEdit}
                />

            </section>
        </>
    )
}

export default ClientsPage;

