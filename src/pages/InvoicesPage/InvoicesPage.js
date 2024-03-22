
import React, { useState, useEffect } from "react";
import jsPDF from 'jspdf';
// import 'jspdf-autotable';


function InvoicesPage({ selectedEntries, clients }) {
    const [chosenClientId, setChosenClientId] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");

    // console.log(selectedEntries)

    const handleDateChange = (event) => {
        setInvoiceDate(event.target.value);
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
                        placeholder="INV-000071"
                        name="invoice-number"
                    >
                    </input>
                </div>
                <div>
                    <label>Invoice Date</label>
                    <input
                        type="text"
                        placeholder="2024/02/25"
                        name="invoice-date"
                    >
                    </input>

                    <label>Due Date</label>
                    <input
                        type="date"
                        id="invoice-date"
                        name="invoice-date"
                        value={invoiceDate}
                        onChange={handleDateChange}
                    />
                </div>

                <div>
                    {selectedEntries.map((selectedEntries) => (
                        <div key={selectedEntries.timerid}>
                            <div>Date: {selectedEntries.starttime.slice(0, 10)}</div>
                            <div>StartTime: {selectedEntries.starttime.slice(11, 19)}</div>
                            <div>EndTime: {selectedEntries.endtime.slice(11, 19)}</div>
                            <div>Duration/Time: {selectedEntries.duration}</div>
                            <div>Task: {selectedEntries.description}</div>
                            <div>Client Name: {clients.find(client => client.clientid === selectedEntries.clientid)?.name}</div>
                            <div>Billing Status:</div>
                            
                        </div>
                    ))}
                </div>







            </form>

        </div>
    );
}

export default InvoicesPage;
