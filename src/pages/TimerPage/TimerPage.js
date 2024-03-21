import React, { useState, useEffect } from "react";
import "./TimerPage.scss";
import Quotes from "../../components/Quotes/Quotes";
import axios from "axios";

function TimerPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null); 
    const [elapsedTime, setElapsedTime] = useState(0);
    const [description, setDescription] = useState("");
    const [shouldLogEntry, setShouldLogEntry] = useState(false);

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

    const formatDateTime = (date) => {
        return date.toISOString().replace('T', ' ').slice(0, -5);
    };

    const logTimeEntry = async () => {
        if (startTime && endTime) {
            const duration = Math.floor((endTime - startTime) / 1000); 
            const formattedStartTime = formatDateTime(startTime); //to format away from Z and T's
            const formattedEndTime = formatDateTime(endTime);

            try {
                const response = await axios.post('http://localhost:8080/timers', {
                    starttime: formattedStartTime,
                    endtime: formattedEndTime,
                    duration,
                    description,
                    // clientid, for now it will be commented out - need to add logic
                });
                console.log(response.data);
                resetTimer();
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
                <div>Elapsed Time: {elapsedTime} seconds</div>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                ></textarea>
            </section>
            <Quotes />
        </>
    );
}

export default TimerPage;


//to do's or to fix:
// project id needs to be connected to client id - so when user is on the timer page
//we see a list of clients - like in a dropdown 
//after client gets selected this time entry is connected to that project id, client id
//maybe i should change that in the backend - project id insta
//logic error: timers and entries should both be connected to clientid data
//there should not be any projectid

//frontend - dropdown selecting client 
//check how we did this in the add warehouses form
