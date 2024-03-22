
import React, { useState, useEffect } from "react";
import jsPDF from 'jspdf';
// import 'jspdf-autotable';


function InvoicesPage({ selectedEntries, clients }) {
    const [chosenClientId, setChosenClientId] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [invoiceDueDate, setInvoiceDueDate] = useState("");
    const [rates, setRates] = useState({});
    const [taxRates, setTaxRates] = useState({});
    const [terms, setTerms] = useState("If payment is not received within 10 days of the due date, the Client will also be subject to a late fee of 5% of the amount overdue.\n\nGST#: 702288010RT0001");
    const [paymentInstructions, setPaymentInstructions] = useState("Please send payment via e-transfer to ablobelperez@gmail.com");
    const [selectedTaxRate, setSelectedTaxRate] = useState(0);

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

    const handleTaxChange = (timerId, tax) => {
        setTaxRates(prevTaxRates => ({ ...prevTaxRates, [timerId]: tax }));
    };

    const handleTaxRateChange = (e) => {
        setSelectedTaxRate(Number(e.target.value));
    };

    // round seconds up to min and then to h
    const roundedMinutesIntoHours = (seconds) => {
        const minutes = Math.ceil(seconds / 60);
        const hours = minutes / 60;
        return hours.toFixed(2); //  2 decimal places
    };

    //calculate each time duration x rate + tax (0, 5%,or 15%) = amount
    const calculateAmountWithTax = (durationInSeconds, rate, taxRate) => {
        const hours = roundedMinutesIntoHours(durationInSeconds);
        const amount = hours * rate;
        const taxAmount = amount * (taxRate / 100);
        return (amount + taxAmount).toFixed(2);
    };
    //calculate subtotal, tax total, super total
    const calculateAmounts = () => {
        const subtotal = selectedEntries.reduce((total, selectedEntry) => {
            const rate = rates[selectedEntry.timerid] || 0;
            const amount = roundedMinutesIntoHours(selectedEntry.duration) * rate;
            return total + amount;
        }, 0);

        const taxAmount = subtotal * (selectedTaxRate / 100);
        const totalAmount = subtotal + taxAmount;

        return { subtotal: subtotal.toFixed(2), taxAmount: taxAmount.toFixed(2), totalAmount: totalAmount.toFixed(2) };
    };

    // get calculated amounts - call function
    const { subtotal, taxAmount, totalAmount } = calculateAmounts();

    //to change terms textare unless default state
    const handleTermsChange = (event) => {
        setTerms(event.target.value);
    };

    //to change payment details unless default
    const handlePaymentInstructionsChange = (event) => {
        setPaymentInstructions(event.target.value);
    };

    //when 5% show GST (5%)
    const getTaxName = (taxRate) => {
        switch (taxRate) {
            case 5:
                return "GST (5%)";
            case 15:
                return "HST (15%)";
            default:
                return "No Tax";
        }
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
                            <div>Task Hours: {roundedMinutesIntoHours(selectedEntries.duration)}</div>



                            <label>Rate: $</label>
                            <input
                                type="number"
                                id={`rate-${selectedEntries.timerid}`}
                                value={rates[selectedEntries.timerid] || ''}
                                onChange={e => handleRateChange(selectedEntries.timerid, Number(e.target.value))}
                            />
                            <label>Tax</label>
                            <select
                                value={selectedTaxRate} onChange={handleTaxRateChange}
                            >
                                <option value={0}>No Tax</option>
                                <option value={5}>GST [5%]</option>
                                <option value={15}>HST [15%]</option>
                            </select>
                            <label>Amount: $</label>
                            <input
                                type="text"
                                id={`amount-${selectedEntries.timerid}`}
                                value={calculateAmountWithTax(selectedEntries.duration, rates[selectedEntries.timerid] || 0, taxRates[selectedEntries.timerid] || 0)}
                                disabled
                            />

                        </div>
                    ))}
                </div>


                <div>
                    <p>Subtotal ${subtotal}</p>
                    <p>{getTaxName(selectedTaxRate)}: ${taxAmount}</p>
                    <p>Total ${totalAmount}</p>
                </div>

                <div>
                    <label>Terms & Conditions</label>
                    <textarea
                        id="terms-conditions"
                        value={terms}
                        onChange={handleTermsChange}
                    >
                    </textarea>

                </div>

                <div>
                    <label>Payment</label>
                    <textarea
                        id="payment-instructions"
                        value={paymentInstructions}
                        onChange={handlePaymentInstructionsChange}
                    />
                </div>

            </form>

        </div>
    );
}

export default InvoicesPage;
