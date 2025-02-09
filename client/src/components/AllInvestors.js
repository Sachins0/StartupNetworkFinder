// src/components/AllInvestors.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllInvestors() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/findAll`, {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      });
      console.log("response", response);
      setInvestors(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch investors');
      setLoading(false);
    }
  };

  const filteredInvestors = investors.filter(investor => {
    if (filter === 'all') return true;
    return investor.type.toLowerCase() === filter.toLowerCase();
  }).filter(investor => {
    return investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           investor.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-gray-600">Loading investors...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">All Investors & Mentors</h2>
        <p className="mt-2 text-gray-600">Find and connect with investors and mentors</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or category..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="investor">Investors</option>
          <option value="mentor">Mentors</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvestors.map((investor) => (
          <div 
            key={investor._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{investor.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${investor.type.toLowerCase() === 'investor' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'}`}
                >
                  {investor.type}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Category:</span> {investor.category}
                </p>
                <div className="pt-4">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInvestors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No investors found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

export default AllInvestors;