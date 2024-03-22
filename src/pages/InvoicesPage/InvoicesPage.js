
import React, { useState, useEffect } from "react";
import andreaLogo from '../../assets/images/logos/andrea-logo.png'
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';



function InvoicesPage({ selectedEntries, clients }) {
      // console.log(selectedEntries)
    const [chosenClientId, setChosenClientId] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [invoiceDueDate, setInvoiceDueDate] = useState("");
    const [rates, setRates] = useState({});
    const [taxRates, setTaxRates] = useState({});
    const [terms, setTerms] = useState("If payment is not received within 10 days of the due date, the Client will also be subject to a late fee of 5% of the amount overdue.\n\nGST/HST#: 702288010RT0001");
    const [paymentInstructions, setPaymentInstructions] = useState("Please send payment via e-transfer to ablobelperez@gmail.com");
    const [selectedTaxRate, setSelectedTaxRate] = useState(0);
    const [invoiceNumber, setInvoiceNumber] = useState("");

    const clientForInvoice = clients.find(client => client.clientid === selectedEntries[0]?.clientid) || {};

  
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

    const handleInvoiceNumberChange = (event) => {
        setInvoiceNumber(event.target.value);
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

    // build  PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFont("Helvetica");
    
        // logo image
        const logoWidth = 50;
        const logoHeight = 50;
        const yPosition = 10;
        doc.addImage(andreaLogo, 'PNG', 15, yPosition, logoWidth, logoHeight);
    
        // address info
        let pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(11);
        const rightMargin = 10;
        const addressYStart = 30;
        const lineHeight = 5;
        let addressXPosition = pageWidth - rightMargin;
        let addressLines = [
            'Andrea Blobel Pérez',
            '1003-1188 Bidwell',
            'Vancouver British Columbia V6G 0C6',
            'Canada',
            '672-515-3544',
            'billing@andreablobel.com'
        ];
    
        // printing Address Lines
        addressLines.forEach((line, i) => {
            doc.text(line, addressXPosition, addressYStart + (i * lineHeight), null, null, 'right');
        });
    
        // billing info
        let billingInfoLine = [
            `Bill to: ${clientForInvoice.name || 'Client not selected'}`,
            `Email: ${clientForInvoice.email || 'Email not provided'}`,
            `Phone: ${clientForInvoice.phone || 'Phone not provided'}`,
        ];
        let billingStartY = addressYStart + (addressLines.length * lineHeight) + 10;

        // priting billing info
        billingInfoLine.forEach((line, i) => {
            doc.text(line, 15, billingStartY + (i * lineHeight)); 
        });

        //invide details info
        let invoiceInfoLine = [
            `Invoice #: ${invoiceNumber}`,
            `Invoice Date: ${invoiceDate}`,
            `Due Date: ${invoiceDueDate}`,
        ];
        //determine invoice info position in pdf - aligned with billingstartY axis but right
        //taking x position of address
        let invoiceInfoStartY = billingStartY;
        let invoiceInfoX = addressXPosition;
        //printing invoice info
        invoiceInfoLine.forEach((line, i) => {
            doc.text(line, invoiceInfoX, invoiceInfoStartY + (i * lineHeight), null, null, 'right');
        });
        
        //position of table
        let tableStartY = invoiceInfoStartY + (billingInfoLine.length * lineHeight) + 10;
    
        // table headers and data
        let headers = ["#", "Task", "Project Hours", "Rate", "Amount"];
        let data = selectedEntries.map((selectedEntry, i) => [
            i + 1,
            selectedEntry.description,
            roundedMinutesIntoHours(selectedEntry.duration),
            `$${rates[selectedEntry.timerid] || '0.00'}`,
            `$${calculateAmountWithTax(selectedEntry.duration, rates[selectedEntry.timerid] || 0, taxRates[selectedEntry.timerid] || 0)}`
        ]);

        // printing table
        doc.autoTable({
            head: [headers],
            body: data,
            startY: tableStartY,
            theme: 'grid',
            styles: {
                fontSize: 11,
                cellPadding: 2,
                font: 'Helvetica',
                textColor: [0, 0, 0]
            },
            headStyles: {
                fillColor: [245, 246, 247],
                textColor: [0, 0, 0],
                fontSize: 11,
                fontStyle: 'bold',
                font: 'Helvetica'
            },
            margin: { right: rightMargin }
        });

        // Subtotal, Tax, and Total 
        let financialDetailsStartY = doc.previousAutoTable.finalY + 10;
        const financialLineHeight = 6;
        doc.text(`Subtotal: $${subtotal}`, addressXPosition, financialDetailsStartY, null, null, 'right');
        doc.text(`${getTaxName(selectedTaxRate)}: $${taxAmount}`, addressXPosition, financialDetailsStartY + financialLineHeight, null, null, 'right');
        doc.text(`Balance due: $${totalAmount}`, addressXPosition, financialDetailsStartY + 2 * financialLineHeight, null, null, 'right');

        // Terms & Conditions 
        let termsStartY = financialDetailsStartY + 3 * financialLineHeight + 10; 
        doc.setFont("Helvetica", "bold");
        doc.text("Terms & Conditions", 14, termsStartY);
        doc.setFont("Helvetica", "normal");
        let termsLines = doc.splitTextToSize(terms, 180);
        termsLines.forEach((line, index) => {
            doc.text(line, 14, termsStartY + 7 + (index * 6.5)); 
        });

        // Payment
        let paymentInstructionsStartY = termsStartY + 7 + (termsLines.length * 6.5) + 10; 
        doc.setFont("Helvetica", "bold");
        doc.text("Payment Instructions", 14, paymentInstructionsStartY);
        doc.setFont("Helvetica", "normal");
        let paymentLines = doc.splitTextToSize(paymentInstructions, 180); 
        paymentLines.forEach((line, index) => {
            doc.text(line, 14, paymentInstructionsStartY + 7 + (index * 6.5)); 
        });

        // save  PDF
        doc.save(`${invoiceNumber}.pdf`);
    };


    return (
        <div>
            <h1>Invoices</h1>
            <form>
                <div>
                    <p>Client: {clientForInvoice.name || 'Client not selected'}</p>
                </div>

                <div>
                    <label>Invoice #</label>
                    <input
                        type="text"
                        placeholder="INV-00099"
                        name="invoice-number"
                        value={invoiceNumber}
                        onChange={handleInvoiceNumberChange}
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

                <button type="button" onClick={generatePDF}>
                    Export to PDF
                </button>



            </form>



        </div>
    );
}

export default InvoicesPage;
