import "./AddNewEntryPage.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from 'react-select';
import arrowBack from '../../assets/images/icons/arrow_back.svg'

function AddNewEntryPage({ clients }) {
    const [entryDate, setEntryDate] = useState("");
    const [duration, setDuration] = useState("");
    const [task, setTask] = useState("");
    const [selectedClientId, setSelectedClientId] = useState("");

    //form validation states
    const [errors, setErrors] = useState({});


    const navigate = useNavigate();

    //to go back
    const handleBackClick = () => {
        navigate(-1); 
      };

    // form validation of each field
    const validateForm = () => {
        let isValid = true;
        let errors = {};

        if (!entryDate) {
            isValid = false;
            errors['entryDate'] = 'Please enter date';
        }

        if (!duration || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(duration)) {
            isValid = false;
            errors['duration'] = 'Please enter duration in format HH:MM.';
        }

        if (!task.trim()) {
            isValid = false;
            errors['task'] = 'Please enter a task description';
        }

        if (!selectedClientId) {
            isValid = false;
            errors['client'] = 'Please select a Client';
        }

        setErrors(errors);
        return isValid;
    };

    //select react 
    const clientOptions = clients.map(client => ({
        value: client.clientid.toString(),
        label: client.name,
    }));
    const selectedOption = clientOptions.find(option => option.value === selectedClientId || null);

    const handleSelectChange = selectedOption => {
        if (selectedOption) {
            setSelectedClientId(selectedOption.value);
    
        } else {
            setSelectedClientId("");
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return; // stop submission if validation fails
        }

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
            <div className="entry-form__header">
           <button className='entry-form__back-btn' 
            onClick={handleBackClick}><img 
            src={arrowBack} alt='arrow_back-24px' /></button>
            <h1 className="entry-form__title">Add a New Entry</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="entry-form__form">
            
                <div className="entry-form__field">
                    <label className="entry-form__label">Date:</label>
                    <input
                        type="date"
                        id="entry-date"
                        name="entry-date"
                        className="entry-form__input"
                        value={entryDate}
                        onChange={(e) => setEntryDate(e.target.value)}
                    />
                    {errors.entryDate && <div className="entry-form__validation-message">{errors.entryDate}</div>}
                </div>

                <div className="entry-form__field">
                    <label className="entry-form__label">Duration:</label>
                    <input
                        type="text"
                        id="duration"
                        className="entry-form__input"
                        placeholder="HH:MM"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                    {errors.duration && <div className="entry-form__validation-message">{errors.duration}</div>}
                </div>

                <div className="entry-form__field">
                    <label className="entry-form__label">Task:</label>
                    <textarea
                        id="task-entry"
                        className="entry-form__textarea"
                        placeholder="What task did you forget to track?"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                    {errors.task && <div className="entry-form__validation-message">{errors.task}</div>}
                </div>

                <div className="entry-form__field">
                    <label  className="entry-form__label">Client:</label>
                    <Select
                        id="client"
                        className="entry-form__select"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        options={clientOptions}
                        placeholder="Select a client..."
                        isClearable
                        isSearchable
                    />
                    {errors.client && <div className="entry-form__validation-message">{errors.client}</div>}
                </div>

                <button type="submit" className="entry-form__submit-btn">Add Entry</button>
            </form>
        </section>

    );
}

export default AddNewEntryPage;
