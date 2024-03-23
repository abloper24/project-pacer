import "./AddNewEntryPage.scss";
import deleteIcon from '../../assets/images/icons/delete_outline-24px.svg'
import editIcon from '../../assets/images/icons/edit-24px.svg'
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function AddNewEntryPage({ clients }) {
    // console.log(clients)
    // console.log(entries)
    // console.log(timerEntries[0])
    
  
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    //delete modal pop-up
    const openModal = (timerEntry) => {
        // setselectedEntryDelete(timerEntry);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        // setselectedEntryDelete(null);
    };



    const handleCreateInvoice = () => {
        navigate('/invoices'); 
    };

    const handleAddEntry = () => {
        navigate('/invoices'); 
    };
    

    return (
        <>
            <section>
                <h1>Add a New Entry Page</h1>
                <p> this is the page to add new entries </p>
                
               <form>
                <label>
                    Date:
                </label>
                <input
                        type="date"
                        id="entry-date"
                        name="entry-date"
                        // value={invoiceDate}
                        // onChange={handleDateChange}
                    />
                
                <label>Duration</label>
                <input
                type="number"
                id="duration"
                placeholder="00:00H"
                
                ></input>
                <label>Task</label>
                <textarea
                type="text"
                id="task-entry"
                placeholder="What task did you forget to track?"
                >
                </textarea>
                <label>Client:</label>
                <select>
                    <option>
                        Clients
                    </option>
                </select>



               </form>

             
            </section>
        </>
    )
}

export default AddNewEntryPage;
