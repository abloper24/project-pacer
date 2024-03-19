import './App.scss';
import Header from './components/Header/Header';
import TimerPage from './pages/TimerPage/TimerPage';
import InvoicesPage from './pages/InvoicesPage/InvoicesPage';
import EntriesPage from './pages/EntriesPage/EntriesPage';

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<TimerPage />} />
        <Route path='/entries' element={<EntriesPage />} />
        <Route path='/invoices' element={<InvoicesPage />} />
        <Route path="*" element={<TimerPage />} />
      </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
