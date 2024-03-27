import "./EntriesPage.scss";
import deleteIcon from '../../assets/images/icons/delete_outline-24px.svg'
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";



function EntriesPage({ clients, timerEntries, getTimerEntries, setSelectedEntries, toggleInvoiceStatus }) {

    const [uiSelectedEntries, setUISelectedEntries] = useState([]);
    const [selectedEntryDelete, setselectedEntryDelete] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const navigate = useNavigate();

    //sorting entries from new to old
    timerEntries.sort((a, b) => new Date(b.starttime) - new Date(a.starttime));

    //format duration into HH:MM
    function formatDuration(seconds) {
        const pad = (num) => (num < 10 ? `0${num}` : num);
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.ceil((seconds % 3600) / 60);
        if (minutes === 60) {
            hours++;
            minutes = 0;
        }
        return `${pad(hours)}:${pad(minutes)}`;
    }

    //selecting entries with checkbox 
    const handleSelectCheckbox = (timerId) => {
        const newSelectedEntries = uiSelectedEntries.includes(timerId) ? uiSelectedEntries.filter(id => id !== timerId) : [...uiSelectedEntries, timerId];
        setUISelectedEntries(newSelectedEntries);

        const entriesToUpdate = timerEntries.filter(entry => newSelectedEntries.includes(entry.timerid));
        setSelectedEntries(entriesToUpdate);


    };


    //delete modal pop-up
    const openModal = (timerEntry) => {
        setselectedEntryDelete(timerEntry);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setselectedEntryDelete(null);
    };

    //delete axios request
    const deleteEntry = async () => {
        try {
            await axios.delete(`http://localhost:8080/timers/${selectedEntryDelete.timerid}`);
            console.log(`Entry with id ${selectedEntryDelete.timerid} deleted.`);
            closeModal();
            getTimerEntries(); //to call all entries again to be updated on the page
        } catch (error) {
            console.error("Error deleting time entry:", error);
        }
    };



    const handleCreateInvoice = () => {
        navigate('/invoices');
    };

    const handleAddEntry = () => {
        navigate('/timers/add');
    };

    useEffect(() => {
        const fetchEntries = async () => {
            getTimerEntries();
        };
        fetchEntries();
    }, []);


    return (
        <>
            <section className="entries-page">
                <h1 className="entries-page__title">Time Entries</h1>
                <p className="entries-page__description">You rock - here are all the time entries you have done!</p>
                <div className="entries-page__actions">
                    <button onClick={handleAddEntry} className="entries-page__add-btn">
                        Add New Entry
                    </button>
                    <button onClick={handleCreateInvoice} className="entries-page__invoice-btn">
                        Create Invoice
                    </button>

                </div>

                <div className="entries-page__table">
                    <div className="entries-page__table-header">
                        <div className="entry__td-heading">  </div>
                        <div className="entry__td-heading">Date</div>
                        <div className="entry__td-heading">Start</div>
                        <div className="entry__td-heading">End</div>
                        <div className="entry__td-heading">Duration</div>
                        <div className="entry__td-heading">Task</div>
                        <div className="entry__td-heading">Client Name</div>
                        <div className="entry__td-heading">Billing Status</div>
                        <div className="entry__td-heading">Actions</div>
                    </div>

                    {timerEntries.map((timerEntry) => (
                        <div key={timerEntry.timerid} className="entry">
                            <input
                                type="checkbox"
                                checked={uiSelectedEntries.includes(timerEntry.timerid)}
                                onChange={() => handleSelectCheckbox(timerEntry.timerid)}
                                className="entry__checkbox"
                            />
                            <div className="entry__item">
                                <div className="entry__label">Date:</div>
                                <div className="entry__text">{timerEntry.starttime.slice(0, 10)}</div>
                            </div>
                            <div className="entry__item">
                                <div className="entry__label">Start:</div>
                                <div className="entry__text">{timerEntry.starttime.slice(11, 19)}</div>

                            </div>

                            <div className="entry__item">
                                <div className="entry__label">End:</div>
                                <div className="entry__text">{timerEntry.endtime.slice(11, 19)}</div>
                            </div>

                            <div className="entry__item">
                                <div className="entry__label">Duration:</div>
                                <div className="entry__text">{formatDuration(timerEntry.duration)}</div>

                            </div>

                            <div className="entry__item">
                                <div className="entry__label">Task:</div>
                                <div className="entry__text">{timerEntry.description}</div>

                            </div>

                            <div className="entry__item">
                                <div className="entry__label">Client:</div>
                                <div className="entry__text">{clients.find(client => client.clientid === timerEntry.clientid)?.name}</div>

                            </div>
                            <div className="entry__item">
                                <div className="entry__label">Billing Status:</div>
                                <div className="entry__text">{timerEntry.invoiced ? "Invoiced" : "Not Invoiced"}</div>
                            </div>

                            <div className="entry__actions entry__actions">
                                <button onClick={() => toggleInvoiceStatus(timerEntry.timerid, timerEntry.invoiced)} className="entry__invoice-btn">
                                    {timerEntry.invoiced ? "Mark as Not Invoiced" : "Mark as Invoiced"}
                                </button>
                                <button onClick={() => openModal(timerEntry)} className="entry__delete-btn">
                                    <img src={deleteIcon} alt="Delete" />
                                </button>
                                <DeleteModal
                                    isOpen={isModalOpen}
                                    onClose={closeModal}
                                    onDelete={deleteEntry}
                                    selectedEntryDelete={selectedEntryDelete}
                                    clients={clients}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>

    )
}

export default EntriesPage;

