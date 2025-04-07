import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { prescriptionsApi, patientsApi } from '../api';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [patientFilter, setPatientFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all prescriptions
        const prescriptionsResponse = await prescriptionsApi.getAll();
        setPrescriptions(prescriptionsResponse.data);
        
        // Fetch all patients to map names to prescriptions
        const patientsResponse = await patientsApi.getAll();
        const patientsMap = {};
        
        patientsResponse.data.forEach(patient => {
          patientsMap[patient.id] = `${patient.firstName} ${patient.lastName}`;
        });
        
        setPatients(patientsMap);
      } catch (err) {
        setError('Failed to load prescriptions');
        console.error('Error fetching prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/prescriptions/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionsApi.delete(id);
        setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
      } catch (err) {
        setError('Failed to delete prescription');
        console.error('Error deleting prescription:', err);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const handlePatientFilterChange = (e) => {
    setPatientFilter(e.target.value);
  };

  // Filter prescriptions based on search input and patient selection
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.medicationName.toLowerCase().includes(filter) ||
                          (prescription.instructions && prescription.instructions.toLowerCase().includes(filter));
    
    const matchesPatient = patientFilter === '' || prescription.patientId === patientFilter;
    
    return matchesSearch && matchesPatient;
  });

  // Get unique patient IDs for the filter dropdown
  const uniquePatientIds = [...new Set(prescriptions.map(prescription => prescription.patientId))];

  // Check if a prescription is active based on start/end dates
  const isPrescriptionActive = (prescription) => {
    const today = new Date();
    const startDate = prescription.startDate ? new Date(prescription.startDate) : null;
    const endDate = prescription.endDate ? new Date(prescription.endDate) : null;
    
    if (!startDate) return false;
    
    return (startDate <= today) && (!endDate || endDate >= today);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <Link
          to="/prescriptions/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add New Prescription
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Prescriptions
            </label>
            <input
              type="text"
              value={filter}
              onChange={handleFilterChange}
              placeholder="Search by medication or instructions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Patient
            </label>
            <select
              value={patientFilter}
              onChange={handlePatientFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Patients</option>
              {uniquePatientIds.map(patientId => (
                <option key={patientId} value={patientId}>
                  {patients[patientId] || 'Unknown Patient'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrescriptions.map(prescription => (
                <tr key={prescription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/prescriptions/${prescription.id}`}
                      className="text-blue-600 hover:text-blue-900 hover:underline font-medium"
                    >
                      {prescription.medicationName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/patients/${prescription.patientId}`}
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      {patients[prescription.patientId] || 'Unknown Patient'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prescription.dosage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isPrescriptionActive(prescription) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isPrescriptionActive(prescription) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prescription.startDate ? new Date(prescription.startDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(prescription.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No prescriptions found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;