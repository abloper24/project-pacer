
import React, { useState, useEffect } from "react";
import jsPDF from 'jspdf';
// import 'jspdf-autotable';


function InvoicesPage({ selectedEntries, clients }) {
    const [chosenClientId, setChosenClientId] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [invoiceDueDate, setInvoiceDueDate] = useState("");
    const [rates, setRates] = useState({});

    // console.log(selectedEntries)

    const handleDateChange = (event) => {
        setInvoiceDate(event.target.value);
    };

    const handleDueDateChange = (event) => {
        setInvoiceDueDate(event.target.value);
    };

    const handleRateChange = (timerId, rate) => {
        setRates(prevRates => ({ ...prevRates, [timerId]: rate }));
    };

    // round seconds up to min and then to h
    const roundedMinutesIntoHours = (seconds) => {
        const minutes = Math.ceil(seconds / 60); 
        const hours = minutes / 60; 
        return hours.toFixed(2); //  2 decimal places
    };

    const calculateAmount = (durationInSeconds, rate) => {
        const hours = roundedMinutesIntoHours(durationInSeconds);
        return (hours * rate).toFixed(2);
    };

    return (
        <div>
            <h1>Invoices</h1>
            <form>
                <div>
                    <select
                        value={chosenClientId}
                        onChange={(e) => setChosenClientId(e.target.value)}
                    >
                        {clients.map((client) => (
                            <option key={client.clientid} value={client.clientid}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Invoice #</label>
                    <input
                        type="text"
                        placeholder="INV-00099"
                        name="invoice-number"
                    >
                    </input>
                </div>
                <div>
                    <label>Invoice Date</label>
                    <input
                        type="date"
                        id="invoice-date"
                        name="invoice-date"
                        value={invoiceDate}
                        onChange={handleDateChange}
                    />

                    <label>Due Date</label>
                    <input
                        type="date"
                        id="invoice-due-date"
                        name="invoice-due-date"
                        value={invoiceDueDate}
                        onChange={handleDueDateChange}
                    />
                </div>

                <div>
                    {selectedEntries.map((selectedEntries) => (
                        <div key={selectedEntries.timerid}>
                            <div>Task: {selectedEntries.description}</div>
                            <div>Client Name: {clients.find(client => client.clientid === selectedEntries.clientid)?.name}</div>
                            <div>Date: {selectedEntries.starttime.slice(0, 10)}</div>
                            <div>Duration/Time: {roundedMinutesIntoHours(selectedEntries.duration)}</div>



                            <label>Rate: $</label>
                            <input
                                type="number"
                                id={`rate-${selectedEntries.timerid}`}
                                value={rates[selectedEntries.timerid] || ''}
                                onChange={e => handleRateChange(selectedEntries.timerid, Number(e.target.value))}
                            />
                            <label>Tax</label>
                            <select

                            >

                                <option >
                                    GST [5%]
                                </option>
                                <option >
                                    HST [15%]
                                </option>

                            </select>


                            <label>Amount: $</label>
                            <input
                                type="text"
                                id={`amount-${selectedEntries.timerid}`}
                                value={calculateAmount(selectedEntries.duration, rates[selectedEntries.timerid] || 0)}
                                disabled
                            />

                        </div>
                    ))}
                </div>







            </form>

        </div>
    );
}

export default InvoicesPage;
