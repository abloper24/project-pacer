import "./EntriesPage.scss";
import deleteIcon from '../../assets/images/icons/delete_outline-24px.svg'
import editIcon from '../../assets/images/icons/edit-24px.svg'
// import DeleteModal from "../../components/DeleteModal/DeleteModal";



function EntriesPage({ clients, entries, timerEntries }) {
    // console.log(clients)
    // console.log(entries)
    // console.log(timerEntries)

    return (
        <>
            <section>
                <h1>Entries</h1>
                <p> this is the time entries page</p>
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
                    <div>
                        <h3>Checkbox Selection</h3>
                        <span>Checkbox square</span>
                    </div>
                    <div>
                        <h3>Date</h3>
                        <p>11/03/2024</p>
                    </div>
                    <div>
                        <h3>StartTime</h3>
                        <p>01:01:34</p>
                    </div>
                    <div>
                        <h3>EndTime</h3>
                        <p>01:02:34</p>
                    </div>
                    <div>
                        <h3>Duration/Time</h3>
                        <p>1h</p>
                    </div>
                    <div>
                        <h3>Task</h3>
                        <p>Design phase for Project C</p>
                    </div>
                    <div>
                        <h3>Client Name</h3>
                        <p>Alice Johnson</p>
                    </div>
                    <div>
                        <h3>Billing Status</h3>
                        <p>Invoiced</p>
                    </div>
                    <div>
                        <button><img src={deleteIcon}/></button>
                        <button><img src={editIcon}/></button>

                    </div>
                </div>
            </section>
        </>
    )
}

export default EntriesPage;