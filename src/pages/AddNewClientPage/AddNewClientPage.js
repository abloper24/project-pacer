import "./AddNewClientPage.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddNewClientPage({ getClients }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

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
            <h1 className="client-form__title">Add a New Client</h1>
            <form onSubmit={handleSubmit} className="client-form__form">
                <div className="client-form__field">
                    <label htmlFor="name" className="client-form__label">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="client-form__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                    />
                </div>

                <div className="client-form__field">
                    <label htmlFor="phone" className="client-form__label">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        className="client-form__input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                    />
                </div>

                <div className="client-form__field">
                    <label htmlFor="address" className="client-form__label">Address:</label>
                    <input
                        type="text"
                        id="address"
                        className="client-form__input"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                    />
                </div>

                <div className="client-form__field">
                    <label htmlFor="email" className="client-form__label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="client-form__input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>

                <button type="submit" className="client-form__submit-btn">Add Client</button>
            </form>
        </section>

    );
}

export default AddNewClientPage;
