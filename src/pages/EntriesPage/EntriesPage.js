import "./EntriesPage.scss";
import deleteIcon from '../../assets/images/icons/delete_outline-24px.svg'
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";



function EntriesPage({ clients, timerEntries,  getTimerEntries, setSelectedEntries }) {
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
            <section>
                <h1>Entries</h1>
                <p> this is the time entries page</p>
                <div>
                <button onClick={handleAddEntry}>
                    Add New Entry
                </button>
                </div>

                <div>
                <button onClick={handleCreateInvoice}>
                    Create Invoice
                </button>
                </div>
                {/* will add manual entry form later */}
                {/* <form>
                    <input 
                    type="text"
                    id=""
                    name=""
                    placeholder=""
                    ></input>
                    <input 
                    type="text"
                    id=""
                    name=""
                    placeholder=""
                    ></input>
                </form> */}


                {/* table heading for tablet and desktop version */}
                {/* <div>
            <h3>Checkbox</h3>
            <h3>Date</h3>
            <h3>StartTime</h3>
            <h3>EndTime</h3>
            <h3>Duration/Time</h3>
            <h3>Task</h3>
            <h3>Client Name</h3>
            <h3>Billing Status</h3>
        </div> */}

                <div>
                    {timerEntries.map((timerEntry) => (
                        <div key={timerEntry.timerid}>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={uiSelectedEntries.includes(timerEntry.timerid)}
                                    onChange={() => handleSelectCheckbox(timerEntry.timerid)}
                                />

                            </div>
                            <div>Date: {timerEntry.starttime.slice(0, 10)}</div>
                            <div>StartTime: {timerEntry.starttime.slice(11, 19)}</div>
                            <div>EndTime: {timerEntry.endtime.slice(11, 19)}</div>
                            <div>Duration/Time: {formatDuration(timerEntry.duration)}</div>
                            <div>Task: {timerEntry.description}</div>
                            <div>Client Name: {clients.find(client => client.clientid === timerEntry.clientid)?.name}</div>
                            <div>Billing Status: {timerEntry.invoiced ? "Invoiced" : "Not Invoiced"}</div>
                            <div>
                                <button
                                    onClick={() => openModal(timerEntry)}
                                >
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

