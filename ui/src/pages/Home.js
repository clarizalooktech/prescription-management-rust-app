import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientsApi, prescriptionsApi } from '../api';

const Home = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPrescriptions: 0,
    recentPatients: [],
    recentPrescriptions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch patients
        const patientsResponse = await patientsApi.getAll();
        const patients = patientsResponse.data;
        
        // Fetch prescriptions
        const prescriptionsResponse = await prescriptionsApi.getAll();
        const prescriptions = prescriptionsResponse.data;
        
        // Get recent patients (last 5)
        const sortedPatients = [...patients].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Get recent prescriptions (last 5)
        const sortedPrescriptions = [...prescriptions].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Map patient names to prescriptions
        const prescriptionsWithPatientNames = sortedPrescriptions.slice(0, 5).map(prescription => {
          const patient = patients.find(p => p.id === prescription.patientId);
          return {
            ...prescription,
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'
          };
        });
        
        setStats({
          totalPatients: patients.length,
          totalPrescriptions: prescriptions.length,
          recentPatients: sortedPatients.slice(0, 5),
          recentPrescriptions: prescriptionsWithPatientNames
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Prescription Management Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Patients</h2>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-blue-600">{stats.totalPatients}</span>
            <Link 
              to="/patients" 
              className="text-blue-500 hover:text-blue-700 hover:underline"
            >
              View All
            </Link>
          </div>
          <Link 
            to="/patients/new" 
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add New Patient
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Prescriptions</h2>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-green-600">{stats.totalPrescriptions}</span>
            <Link 
              to="/prescriptions" 
              className="text-green-500 hover:text-green-700 hover:underline"
            >
              View All
            </Link>
          </div>
          <Link 
            to="/prescriptions/new" 
            className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add New Prescription
          </Link>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Patients</h2>
          {stats.recentPatients.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentPatients.map(patient => (
                    <tr key={patient.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link 
                          to={`/patients/${patient.id}`}
                          className="text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          {patient.firstName} {patient.lastName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No patients found.</p>
          )}
        </div>
        
        {/* Recent Prescriptions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Prescriptions</h2>
          {stats.recentPrescriptions.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentPrescriptions.map(prescription => (
                    <tr key={prescription.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link 
                          to={`/prescriptions/${prescription.id}`}
                          className="text-green-600 hover:text-green-900 hover:underline"
                        >
                          {prescription.medicationName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link 
                          to={`/patients/${prescription.patientId}`}
                          className="text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          {prescription.patientName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No prescriptions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;