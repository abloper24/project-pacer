import "./EntriesPage.scss";
import deleteIcon from '../../assets/images/icons/delete_outline-24px.svg'
import editIcon from '../../assets/images/icons/edit-24px.svg'
// import DeleteModal from "../../components/DeleteModal/DeleteModal";
import React, { useState } from "react";



function EntriesPage({ clients, timerEntries }) {
    // console.log(clients)
    // console.log(entries)
    // console.log(timerEntries[0].timerid)

    const [selectedEntries, setSelectedEntries] = useState([]);
    timerEntries.sort((a, b) => new Date(b.starttime) - new Date(a.starttime));

      const handleSelectCheckbox = (timerId) => {
        if (selectedEntries.includes(timerId)) {
            setSelectedEntries(selectedEntries.filter(id => id !== timerId));
        } else {
            setSelectedEntries([...selectedEntries, timerId]);
        }
    };
  

    return (
        <>
            <section>
                <h1>Entries</h1>
                <p> this is the time entries page</p>
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
                                    checked={selectedEntries.includes(timerEntry.timerid)}
                                    onChange={() => handleSelectCheckbox(timerEntry.timerid)}
                                />

                            </div>
                            <div>Date: {timerEntry.starttime.slice(0, 10)}</div>
                            <div>StartTime: {timerEntry.starttime.slice(11, 19)}</div>
                            <div>EndTime: {timerEntry.endtime.slice(11, 19)}</div>
                            <div>Duration/Time: {timerEntry.duration}</div>
                            <div>Task: {timerEntry.description}</div>
                            <div>Client Name: {clients.find(client => client.clientid === timerEntry.clientid)?.name}</div>
                            <div>Billing Status:</div>
                            <div>
                                <button><img src={deleteIcon} alt="Delete"/></button>
                                <button><img src={editIcon} alt="Edit"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default EntriesPage;



  //combine entries - timer & manual entries
    // const combinedEntries = [...entries, ...timerEntries];
    //sort them most recent on top - b before a


  // const compositeKey = (combinedEntries) => `${combinedEntries.entryid}-${combinedEntries.timerid}`;
    // console.log(combinedEntries)


  