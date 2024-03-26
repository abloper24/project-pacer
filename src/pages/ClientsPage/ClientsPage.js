import "./ClientsPage.scss";
import deleteIcon from '../../assets/images/icons/delete_outline-24px.svg'
import editIcon from '../../assets/images/icons/edit-24px.svg'
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import DeleteClientModal from "../../components/DeleteClientModal/DeleteClientModal";
import EditClientModal from "../../components/EditClientModal/EditClientModal";



import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";



function ClientsPage({ clients, timerEntries, getTimerEntries, setSelectedEntries, getClients }) {

    // updateCheckedTimers, checkedTimers, markEntryAsInvoiced

    const [selectedTimers, setSelectedTimers] = useState([]);
    const [clientTimers, setClientTimers] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTimerDelete, setSelectedTimerDelete] = useState(null);

    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClientToDelete, setSelectedClientToDelete] = useState(null);

    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
    const [selectedClientToEdit, setSelectedClientToEdit] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        const getClientTimers = async () => {
            let sortedTimers = {};

            for (let client of clients) {
                try {
                    const response = await axios.get(`http://localhost:8080/clients/${client.clientid}/timers`);
                    sortedTimers[client.clientid] = response.data.sort((a, b) => new Date(b.starttime) - new Date(a.starttime));
                } catch (error) {
                    console.error(`Error fetching timers for client ${client.name}:`, error);
                }
            }
            setClientTimers(sortedTimers);
        };

        if (clients.length > 0) {
            getClientTimers();
        }
    }, [clients]);

    const formatDuration = (seconds) => {
        const pad = (num) => num.toString().padStart(2, '0');
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${pad(hours)}:${pad(minutes)}`;
    };



    //delete modal pop-up for timer entries
    const openModal = (timerEntry) => {
        setSelectedTimerDelete(timerEntry);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTimerDelete(null);
    };

    const deleteEntry = async (timer) => {
        try {
            await axios.delete(`http://localhost:8080/timers/${timer.timerid}`);
            closeModal();
            getTimerEntries();
        } catch (error) {
            console.error("Error deleting timer entry:", error);
        }
    };


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


    const handleCheckboxChange = (timerId) => {
        setSelectedTimers((prevSelectedTimers) => {
            if (prevSelectedTimers.includes(timerId)) {
                return prevSelectedTimers.filter((id) => id !== timerId);
            } else {
                return [...prevSelectedTimers, timerId];
            }
        });
    };

    // const handleCheckboxChange = async (timerId) => {
       
    //     if (checkedTimers[timerId]) {
    //         return; 
    //     }

    //     try {
    //         await markEntryAsInvoiced(timerId);
    //     } catch (error) {
    //         console.error("Error marking entry as invoiced:", error);
    //     }
    // };


    const handleCreateInvoice = () => {
        const entriesToInvoice = timerEntries.filter(entry => selectedTimers.includes(entry.timerid));
        setSelectedEntries(entriesToInvoice);
        navigate('/invoices');
    };


    const handleAddEntry = () => {
        navigate('/timers/add');
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
            <section>
                <div>
                    <button onClick={handleAddNewClient}>Add New Client</button>
                    <button onClick={handleAddEntry}>Add New Entry</button>
                    <button onClick={handleCreateInvoice}>Create Invoice</button>
                </div>
                <h1>Clients</h1>
                {clients.map((client) => (
                    <div key={client.clientid}>
                        <h2>{client.name}</h2>
                        <button onClick={() => openClientModal(client)}>
                            <img src={deleteIcon} alt="Delete" />
                        </button>
                        <button onClick={() => openEditClientModal(client)}>
                            <img src={editIcon} alt="Edit" />
                        </button>
                        <p>{client.email}</p>
                        <p>{client.phone}</p>
                        <p>{client.address}</p>

                        <div>
                            {clientTimers[client.clientid]?.map((timer) => (
                                <div key={timer.timerid}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTimers.includes(timer.timerid)}
                                        onChange={() => handleCheckboxChange(timer.timerid)}
                                    />
                                    {/* <input
                                        type="checkbox"
                                        checked={!!checkedTimers[timer.timerid]} 
                                        onChange={() => handleCheckboxChange(timer.timerid)}
                                        disabled={timer.invoiced || !!checkedTimers[timer.timerid]} 
                                    /> */}
                                    <div>Date: {timer.starttime.slice(0, 10)}</div>
                                    <div>StartTime: {timer.starttime.slice(11, 19)}</div>
                                    <div>EndTime: {timer.endtime.slice(11, 19)}</div>
                                    <div>Duration/Time: {formatDuration(timer.duration)}</div>
                                    <div>Task: {timer.description}</div>
                                    <div>Billing Status: {timer.invoiced ? "Invoiced" : "Not Invoiced"}</div>
                                    <button onClick={() => openModal(timer)}>
                                        <img src={deleteIcon} alt="Delete" />

                                    </button>
                                    <DeleteModal
                                        isOpen={isModalOpen}
                                        onClose={closeModal}
                                        onDelete={() => deleteEntry(selectedTimerDelete)}
                                        selectedEntryDelete={selectedTimerDelete}
                                        clients={clients}
                                    />

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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

