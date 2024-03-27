
import "./InvoicesPage.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import andreaLogo from '../../assets/images/logos/andrea-logo.png'
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select';
import arrowBack from '../../assets/images/icons/arrow_back.svg'



function InvoicesPage({ selectedEntries, clients }) {
    const [chosenClientId, setChosenClientId] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [invoiceDueDate, setInvoiceDueDate] = useState("");
    const [rates, setRates] = useState({});
    const [taxRates, setTaxRates] = useState({});
    const [terms, setTerms] = useState("If payment is not received within 10 days of the due date, the Client will also be subject to a late fee of 5% of the amount overdue.\n\nGST/HST#: 70228XXXXRT0001");
    const [paymentInstructions, setPaymentInstructions] = useState("Please send payment via e-transfer to billing@email.com");
    const [selectedTaxRate, setSelectedTaxRate] = useState(0);
    const [invoiceNumber, setInvoiceNumber] = useState("");


    //form validation state
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    //only generate pdf if form is valid
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
        generatePDF();
        navigate("/");
    };

    // form validation function
    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        if (!invoiceNumber.trim()) {
            newErrors["invoiceNumber"] = "Please enter an Invoice Number";
            formIsValid = false;
        }

        if (!invoiceDate.trim()) {
            newErrors["invoiceDate"] = "Please enter Invoice Date";
            formIsValid = false;
        }

        if (!invoiceDueDate.trim()) {
            newErrors["invoiceDueDate"] = "Wanna get paid? Enter the due date. ";
            formIsValid = false;
        }

        const hasInvalidRate = selectedEntries.some(entry => !rates[entry.timerid] || rates[entry.timerid] <= 0);
        if (hasInvalidRate) {
            newErrors["rates"] = "Please enter a rate -- your work's $$";
            formIsValid = false;
        }

        if (selectedTaxRate === null || selectedTaxRate === undefined) {
            newErrors["taxRate"] = "Please select a tax rate";
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };

    //to go back
    const handleBackClick = () => {
        navigate(-1);
    };

    const clientForInvoice = clients.find(client => client.clientid === selectedEntries[0]?.clientid) || {};

    const taxOptions = [
        { value: 0, label: 'No Tax' },
        { value: 5, label: 'GST [5%]' },
        { value: 15, label: 'HST [15%]' },
    ];
    const selectedTaxOption = taxOptions.find(option => option.value === selectedTaxRate);

    const handleTaxRateChange = selectedOption => {
        setSelectedTaxRate(selectedOption.value);
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
            '1100 Bidwell',
            'Vancouver, BC V9G 8C6',
            'Canada',
            '672-515-6767',
            'billing@email.com'
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
        <div className="invoice">
            <div className="invoice__header">
                <button className='invoice__back-btn'
                    onClick={handleBackClick}><img
                        src={arrowBack} alt='arrow_back-24px' /></button>
                <h1 className="invoice__title">Invoices</h1>
            </div>

            <form className="invoice__form" onSubmit={handleSubmit}>

                {/* invoice number */}
                <div className="invoice__field">
                    <label className="invoice__label">Invoice #</label>
                    <input
                        className="invoice__input"
                        type="text"
                        placeholder="INV-00099"
                        name="invoice-number"
                        value={invoiceNumber}
                        onChange={e => setInvoiceNumber(e.target.value)}
                    />
                    {errors.invoiceNumber && <p className="invoice__validation-message">{errors.invoiceNumber}</p>}
                </div>

                {/* invoice date */}
                <div className="invoice__field">
                    <label className="invoice__label">Invoice Date</label>
                    <input
                        className="invoice__input"
                        type="date"
                        name="invoice-date"
                        value={invoiceDate}
                        onChange={e => setInvoiceDate(e.target.value)}
                    />
                    {errors.invoiceDate && <p className="invoice__validation-message">{errors.invoiceDate}</p>}
                </div>

                {/* due date */}
                <div className="invoice__field">
                    <label className="invoice__label">Due Date</label>
                    <input
                        className="invoice__input"
                        type="date"
                        name="invoice-due-date"
                        value={invoiceDueDate}
                        onChange={e => setInvoiceDueDate(e.target.value)}
                    />
                    {errors.invoiceDueDate && <p className="invoice__validation-message">{errors.invoiceDueDate}</p>}
                </div>

                {/* selected Entries */}
                <div>
                    {selectedEntries.map((entry) => (
                        <div key={entry.timerid} className="invoice__table">
                            {/* left column */}

                            <div className="invoice__column invoice__column-left">
                                <div className="invoice__field">
                                    <div className="invoice__label">Task:</div>
                                    <div className="invoice__input"> {entry.description}</div>
                                </div>
                                <div className="invoice__field">
                                    <div className="invoice__label">Client Name:</div>
                                    <div className="invoice__input">{clients.find(client => client.clientid === entry.clientid)?.name}</div>
                                </div>
                                <div className="invoice__field">
                                    <div className="invoice__label">Date:</div>

                                    <div className="invoice__input"> {entry.starttime.slice(0, 10)}</div>
                                </div>

                            </div>

                            {/* right column  */}
                            <div className="invoice__column invoice__column-rigth">
                                <div className="invoice__field">
                                    <div className="invoice__label">Task Hours:</div>
                                    <div className="invoice__input"> {roundedMinutesIntoHours(entry.duration)}</div>
                                </div>
                                <div className="invoice__field">
                                    <label className="invoice__label">Rate: $</label>
                                    <input
                                        type="number"
                                        id={`rate-${entry.timerid}`}
                                        value={rates[entry.timerid] || ''}
                                        onChange={e => handleRateChange(entry.timerid, Number(e.target.value))}
                                    />
                                    {errors.rates && <p className="invoice__validation-message">{errors.rates}</p>}
                                </div>

                                <div className="invoice__field">
                                    <label className="invoice__label">Amount: $</label>
                                    <input
                                        type="text"
                                        className="invoice__input"
                                        value={calculateAmountWithTax(entry.duration, rates[entry.timerid] || 0, taxRates[entry.timerid] || 0)}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* totals */}
                <div className="invoice__field">

                    <label className="invoice__label">Tax</label>
                    <Select
                        id="tax"
                        classNamePrefix="invoice__select"
                        value={selectedTaxOption}
                        onChange={handleTaxRateChange}
                        options={taxOptions}
                        placeholder="Select tax rate..."
                    />
                    {errors.taxRate && <p className="invoice__validation-message">{errors.taxRate}</p>}
                </div>
                <div className="invoice__field">
                    <label className="invoice__label">Subtotal ${subtotal}</label>
                    <label className="invoice__label">{getTaxName(selectedTaxRate)}: ${taxAmount}</label>
                    <label className="invoice__label">Total ${totalAmount}</label>
                </div>

                {/* terms and conditions */}
                <div className="invoice__field">
                    <label className="invoice__label">Terms & Conditions</label>
                    <textarea
                        className="invoice__terms"
                        id="terms-conditions"
                        value={terms}
                        onChange={e => setTerms(e.target.value)}
                    />
                </div>

                {/* payment instructions */}
                <div className="invoice__field">
                    <label className="invoice__label">Payment</label>
                    <textarea
                        className="invoice__payment"
                        id="payment-instructions"
                        value={paymentInstructions}
                        onChange={e => setPaymentInstructions(e.target.value)}
                    />
                </div>

                {/* export PDF */}
                <div className="invoice__actions">
                    <button type="submit" className="invoice__export-btn">
                        Create Invoice
                    </button>
                </div>

            </form>
        </div>
    );
}

export default InvoicesPage;
