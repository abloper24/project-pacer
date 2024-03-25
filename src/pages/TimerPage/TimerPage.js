import "./TimerPage.scss";
import Quotes from "../../components/Quotes/Quotes";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format as formatDate } from 'date-fns';

function TimerPage({ clients, getTimerEntries }) {
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [description, setDescription] = useState("");
    const [shouldLogEntry, setShouldLogEntry] = useState(false);

    const [selectedClientId, setSelectedClientId] = useState("");
    // console.log(clients)
    // console.log(getTimerEntries)

    //client data
    useEffect(() => {
        if (clients.length > 0) {
            setSelectedClientId(clients[0].clientid.toString()); //defaul first client
        }
    }, [clients]);

    //timer data
    useEffect(() => {
        let interval = null;

        if (isRunning) {
            if (!startTime) setStartTime(new Date());
            interval = setInterval(() => {
                setElapsedTime(previousTime => previousTime + 1);
            }, 1000);
        } else if (!isRunning && startTime && shouldLogEntry) {
            setEndTime(new Date());
            clearInterval(interval);
            setShouldLogEntry(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, startTime, shouldLogEntry]);

    useEffect(() => {
        if (!isRunning && endTime) {
            logTimeEntry();
        }
    }, [endTime]);


    //  HH:mm:ss format
    const formatTime = (seconds) => {
        const formatNumberWithZeros = (num, size) => String(num).padStart(size, '0');
        const hours = formatNumberWithZeros(Math.floor(seconds / 3600), 2);
        const minutes = formatNumberWithZeros(Math.floor((seconds % 3600) / 60), 2);
        const secondsLeft = formatNumberWithZeros(seconds % 60, 2);
        return `${hours}:${minutes}:${secondsLeft}`;
    };


    //uniq id use it int he forntend to define 
    const logTimeEntry = async () => {
        if (startTime && endTime) {
            const duration = Math.floor((endTime - startTime) / 1000);
            // date-fns
            const formattedStartTime = formatDate(startTime, 'yyyy-MM-dd HH:mm:ss');
            const formattedEndTime = formatDate(endTime, 'yyyy-MM-dd HH:mm:ss');

            try {
                const response = await axios.post('http://localhost:8080/timers', {
                    starttime: formattedStartTime,
                    endtime: formattedEndTime,
                    duration,
                    description,
                    clientid: selectedClientId,
                });
                console.log(response.data);
                resetTimer();
                getTimerEntries(); //to call all timer entries again
            } catch (error) {
                console.error("Error logging time entry:", error);
            }
        }
    };

    const startTimer = () => {
        setIsRunning(true);
        setShouldLogEntry(false);
    };

    const stopTimer = () => {
        setIsRunning(false);
        setShouldLogEntry(true);
    };

    const resetTimer = () => {
        setElapsedTime(0);
        setIsRunning(false);
        setStartTime(null);
        setEndTime(null);
        setDescription("");
    };


    return (
        <>
            <section>
                <h1>Timer Page</h1>
                <p>This is the timer page</p>

                <div>
                    <button onClick={startTimer}>Start</button>
                    <button onClick={stopTimer} disabled={!isRunning}>Stop</button>
                    <button onClick={resetTimer} disabled={isRunning}>Reset</button>
                </div>

                <div>Elapsed Time: {formatTime(elapsedTime)}</div>
                <div>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What tasks are you tackling today?"
                ></textarea>
                </div>
                <div>
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
                </div>

            </section>
            <Quotes />
        </>
    );
}

export default TimerPage;
