// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Import pages
import Home from './pages/Home';
import Prescriptions from './pages/Prescriptions';
// Import additional pages as needed (patients list, detail views, etc.)

// Import components
import PrescriptionForm from './components/PrescriptionForm';
import PatientForm from './components/PatientForm';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div 
          className={`bg-blue-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}
        >
          <div className="flex items-center space-x-2 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="text-xl font-bold">Rx Manager</span>
          </div>

          <nav>
            <Link
              to="/"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/patients"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              Patients
            </Link>
            <Link
              to="/prescriptions"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              Prescriptions
            </Link>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <header className="bg-white shadow-md flex justify-between items-center py-4 px-6">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-gray-500 focus:outline-none md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-700 ml-4">Prescription Management System</h1>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="text-sm focus:outline-none active:outline-none border border-gray-300 w-72 h-10 pl-10 pr-4 rounded-lg"
                />
              </div>
              <div className="ml-4 relative flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="bg-red-500 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center absolute -top-1 -right-1">
                  3
                </span>
              </div>
              <div className="ml-4 relative">
                <div className="flex items-center cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">AD</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Prescription Routes */}
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/prescriptions/new" element={<PrescriptionForm />} />
              <Route path="/prescriptions/:id" element={<PrescriptionDetail />} />
              <Route path="/prescriptions/:id/edit" element={<PrescriptionEdit />} />
              
              {/* Patient Routes */}
              <Route path="/patients" element={<PatientsList />} />
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/patients/:id/edit" element={<PatientEdit />} />
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

// Placeholder components for routes that haven't been implemented yet
const PrescriptionDetail = () => <div>Prescription Detail (To be implemented)</div>;
const PrescriptionEdit = () => <div>Edit Prescription (To be implemented)</div>;
const PatientsList = () => <div>Patients List (To be implemented)</div>;
const PatientDetail = () => <div>Patient Detail (To be implemented)</div>;
const PatientEdit = () => <div>Edit Patient (To be implemented)</div>;

export default App;