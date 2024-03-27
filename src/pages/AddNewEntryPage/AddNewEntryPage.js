import "./AddNewEntryPage.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from 'react-select';

function AddNewEntryPage({ clients }) {
    const [entryDate, setEntryDate] = useState("");
    const [duration, setDuration] = useState("");
    const [task, setTask] = useState("");
    const [selectedClientId, setSelectedClientId] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (clients.length > 0) {
            setSelectedClientId(clients[0].clientid.toString());
        }
    }, [clients]);

    //select react 
    const clientOptions = clients.map(client => ({
        value: client.clientid.toString(),
        label: client.name,
    }));
    const selectedOption = clientOptions.find(option => option.value === selectedClientId);
    const handleSelectChange = selectedOption => {
        setSelectedClientId(selectedOption.value);
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            //  HH:MM format to duration in seconds (backend format)
            const [hours, minutes] = duration.split(":").map(Number);
            const durationInSeconds = (hours * 60 * 60) + (minutes * 60);

            // entryDate the start time is at the beginning of the day
            const startTime = new Date(entryDate);
            const endTime = new Date(startTime.getTime() + durationInSeconds * 1000);

            // starttime and endttime times as strings to send to the backend
            const formattedStartTime = `${entryDate}T00:00:00`;
            const formattedEndTime = endTime.toISOString().split('.')[0].replace('T', ' ');

            const response = await axios.post("http://localhost:8080/timers", {
                starttime: formattedStartTime,
                endtime: formattedEndTime,
                duration: durationInSeconds,
                description: task,
                clientid: selectedClientId,
                invoiced: false,
            });

            console.log(response.data);

            navigate("/timers");
        } catch (error) {
            console.error("Error adding new entry:", error);

        }
    };


    return (
        <section className="entry-form">
            <h1 className="entry-form__title">Add a New Entry Page</h1>
            <form onSubmit={handleSubmit} className="entry-form__form">
                <div className="entry-form__field">
                    <label htmlFor="entry-date" className="entry-form__label">Date:</label>
                    <input
                        type="date"
                        id="entry-date"
                        name="entry-date"
                        className="entry-form__input"
                        value={entryDate}
                        onChange={(e) => setEntryDate(e.target.value)}
                    />
                </div>

                <div className="entry-form__field">
                    <label htmlFor="duration" className="entry-form__label">Duration:</label>
                    <input
                        type="text"
                        id="duration"
                        className="entry-form__input"
                        placeholder="HH:MM"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </div>

                <div className="entry-form__field">
                    <label htmlFor="task-entry" className="entry-form__label">Task:</label>
                    <textarea
                        id="task-entry"
                        className="entry-form__textarea"
                        placeholder="What task did you forget to track?"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                </div>

                <div className="entry-form__field">
                    <label htmlFor="client" className="entry-form__label">Client:</label>
                    <Select
                        id="client"
                        className="entry-form__select"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        options={clientOptions}
                        placeholder="Select a client..."
                    />
                </div>

                <button type="submit" className="entry-form__submit-btn">Add Entry</button>
            </form>
        </section>

    );
}

export default AddNewEntryPage;
