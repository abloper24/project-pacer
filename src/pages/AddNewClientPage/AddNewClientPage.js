import "./AddNewClientPage.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import arrowBack from '../../assets/images/icons/arrow_back.svg'

function AddNewClientPage({ getClients }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    //form validation state
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

      //to go back
      const handleBackClick = () => {
        navigate(-1); 
      };

    // form validation of each field
    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!name.trim()) {
            errors["name"] = "Please enter a name";
            formIsValid = false;
        }

        if (!email.trim()) {
            errors["email"] = "Please enter a valid email";
            formIsValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors["email"] = "Email is invalid.";
            formIsValid = false;
        }

        if (!phone.trim()) {
            errors["phone"] = "Please enter a phone number";
            formIsValid = false;
        }

        if (!address.trim()) {
            errors["address"] = "Please enter an address";
            formIsValid = false;
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/clients", {
                name,
                phone,
                address,
                email,
            });
            getClients();

            console.log(response.data);
            navigate("/clients");
        } catch (error) {
            console.error("Error adding new client:", error);
        }
    };

    return (
        <section className="client-form">
            <div className="client-form__header">
            <button className='client-form__back-btn' 
            onClick={handleBackClick}><img 
            src={arrowBack} alt='arrow_back-24px' /></button>
            <h1 className="client-form__title">Add a New Client</h1>
            </div>
            <form onSubmit={handleSubmit} className="client-form__form">
                <div className="client-form__field">
                    <label className="client-form__label">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="client-form__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                    />
                        {errors.name && <div className="client-form__validation-message">{errors.name}</div>}
                </div>

                <div className="client-form__field">
                    <label className="client-form__label">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        className="client-form__input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                    />
                
                    {errors.phone && <div className="client-form__validation-message">{errors.phone}</div>}
                </div>

                <div className="client-form__field">
                    <label className="client-form__label">Address:</label>
                    <input
                        type="text"
                        id="address"
                        className="client-form__input"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                    />
                     {errors.address && <div className="client-form__validation-message">{errors.address}</div>}
                </div>

                <div className="client-form__field">
                    <label className="client-form__label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="client-form__input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    {errors.email && <div className="client-form__validation-message">{errors.email}</div>}
                </div>

                <button type="submit" className="client-form__submit-btn">Add Client</button>
            </form>
        </section>

    );
}

export default AddNewClientPage;
