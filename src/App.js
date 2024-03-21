import './App.scss';
import Header from './components/Header/Header';
import TimerPage from './pages/TimerPage/TimerPage';
import InvoicesPage from './pages/InvoicesPage/InvoicesPage';
import EntriesPage from './pages/EntriesPage/EntriesPage';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  const [clients, setClients] = useState([]);

  //get all clients data - doing it here as I will need this data 
  //in the timer, entries and invoice page

  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/clients');
        // console.log(response.data[0])
        setClients(response.data);
      } catch (error) {
        console.error('Error getting clients:', error);
      }
    };

    getClients();
  }, []);



  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<TimerPage clients={clients}/>} />
        <Route path='/entries' element={<EntriesPage />} />
        <Route path='/invoices' element={<InvoicesPage />} />
        <Route path="*" element={<TimerPage clients={clients}/>} />
      </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
