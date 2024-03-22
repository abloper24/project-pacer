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
  // const [entries, setEntries] = useState([]);
  const [timerEntries, setTimerEntries] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]); // New state for selected entries

  //get all clients data - doing it here as I will need this data 
  //in the timer, entries and invoice page
  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/clients');
        // console.log(response.data)
        setClients(response.data);
      } catch (error) {
        console.error('Error getting clients:', error);
      }
    };

    getClients();
  }, []);

  //get all manual entries
  // useEffect(() => {
  //   const getEntries = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8080/entries');
  //       // console.log(response.data)
  //       setEntries(response.data);
  //     } catch (error) {
  //       console.error('Error getting entries:', error);
  //     }
  //   };

  //   getEntries();
  // }, []);

  //get all timer entries
  //outside useeffect so it can be passed to entries and timer page to refresh

  const getTimerEntries = async () => {
    try {
      const response = await axios.get('http://localhost:8080/timers');
      // console.log(response.data)
      setTimerEntries(response.data);
    } catch (error) {
      console.error('Error getting entries:', error);
    }
  };
  useEffect(() => {
    getTimerEntries();
  }, []);



  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<TimerPage clients={clients}   getTimerEntries={getTimerEntries}/>} />
        <Route path='/entries' element={<EntriesPage clients={clients} timerEntries={timerEntries} getTimerEntries={getTimerEntries} setSelectedEntries={setSelectedEntries}/>} />
        <Route path='/invoices' element={<InvoicesPage selectedEntries={selectedEntries} clients={clients}/>} />
        <Route path="*" element={<TimerPage clients={clients}/>} />
      </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
