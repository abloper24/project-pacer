import React, { useState, useEffect } from "react";
import Select from 'react-select';
import axios from "axios";
import { format as formatDate } from 'date-fns';
import "./TimerPage.scss";
import Quotes from "../../components/Quotes/Quotes";

function TimerPage({ clients, getTimerEntries }) {
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [description, setDescription] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);

    // format elapsed time
    function formatTime(seconds) {
        const pad = (num) => String(num).padStart(2, '0');
        const hours = Math.floor(seconds / 3600);
        const minutes = pad(Math.floor((seconds % 3600) / 60));
        const secondsLeft = pad(seconds % 60);
        return `${hours}:${minutes}:${secondsLeft}`;
    }

    useEffect(() => {
        let interval = null;

        if (isRunning) {
            if (!startTime) setStartTime(new Date());
            interval = setInterval(() => {
                setElapsedTime(previousElapsedTime => previousElapsedTime + 1);
            }, 1000);
        } else if (!isRunning && startTime) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning, startTime]);

    const startTimer = () => setIsRunning(true);

    const stopTimer = () => {
        setIsRunning(false);
        logTimeEntry();
    };

    const resetTimer = () => {
        setElapsedTime(0);
        setIsRunning(false);
        setStartTime(null);
        setDescription("");
    };

    const logTimeEntry = async () => {
        const endTime = new Date();
        const duration = (endTime - startTime) / 1000; // duration in secs

        try {
            await axios.post('http://localhost:8080/timers', {
                starttime: formatDate(startTime, 'yyyy-MM-dd HH:mm:ss'),
                endtime: formatDate(endTime, 'yyyy-MM-dd HH:mm:ss'),
                duration,
                description,
                clientid: selectedClient ? selectedClient.value : null,
                invoiced: false,
            });
            resetTimer();
            getTimerEntries();
        } catch (error) {
            console.error("Error logging time entry:", error);
        }
    };

    // clients for react select library
    const clientOptions = clients.map(client => ({
        value: client.clientid.toString(),
        label: client.name
    }));

    return (
        <>
            <section className="timer">
                <p className="timer__intro">Discover ProjectPacer: where time tracking and motivation converge, and invoice management is simplified.</p>
                <p className="timer__instructions">Please select a client before starting the timer</p>

                <div className="timer__select-container">
                    <Select className="timer__select"
                        value={selectedClient}
                        onChange={setSelectedClient}
                        options={clientOptions}
                        placeholder="Select a client..."
                    />
                </div>


                <div className="timer__elapsed-time-container">
                    <p className="timer__elapsed-time"  > Elapsed Time: {formatTime(elapsedTime)} </p>
                </div>

                <div className="timer__controls">
                    <button
                        className="timer__btns"
                        onClick={startTimer} disabled={!selectedClient}>Start</button>
                    <button
                        className="timer__btns"
                        onClick={stopTimer} disabled={!isRunning || !selectedClient}>Stop</button>

                    <button
                        className="timer__btns"
                        onClick={resetTimer} disabled={isRunning}>Reset</button>
                </div>

                <div className="timer__description-container">
                    <textarea className="timer__description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What tasks are you tackling today?"
                    ></textarea>
                </div>






            </section>
            <Quotes />
        </>
    );
}

export default TimerPage;
