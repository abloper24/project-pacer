import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            //  HH:MM format to duration in seconds (backend format)
            const [hours, minutes] = duration.split(":").map(Number);
            const durationInSeconds = (hours * 60 * 60) + (minutes * 60);

            // Using entryDate and assuming the start time is at the beginning of the day
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
            });

            console.log(response.data);

            navigate("/timers");
        } catch (error) {
            console.error("Error adding new entry:", error);

        }
    };


    return (
        <section>
            <h1>Add a New Entry Page</h1>
            <form onSubmit={handleSubmit}>
                <label>Date:</label>
                <input
                    type="date"
                    id="entry-date"
                    name="entry-date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                />

                <label>Duration:</label>
                <input
                    type="text"
                    id="duration"
                    placeholder="HH:MM"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />

                <label>Task:</label>
                <textarea
                    id="task-entry"
                    placeholder="What task did you forget to track?"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <label>Client:</label>
                <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                >
                    {clients.map((client) => (
                        <option key={client.clientid} value={client.clientid}>
                            {client.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Add Entry</button>
            </form>
        </section>
    );
}

export default AddNewEntryPage;
