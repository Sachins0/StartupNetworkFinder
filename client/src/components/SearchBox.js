import React, { useState } from 'react';
import axios from 'axios';

const SearchBox = ({ onCreditUpdate }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/search`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log("data", data);

      setResult(data.data.match);
      onCreditUpdate(data.data.remainingCredits);
    } catch (error) {
      if(error.response.data.message === 'Your credits are exhausted. Please check your email to recharge. Wait for 5 minutes and Login again for the changes to take effect.' 
        || "Sorry, we are not offering additional credits at this time as you have already used your one-time recharge."){
        localStorage.setItem("creditError","CreditError");
      }
      
      console.log("error", error);
      setError(
        error.response?.data?.message || 
        'An error occurred. Please try again.'
      );
      if (error.response?.status === 403) {
        // Credits exhausted
        onCreditUpdate(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const creditError = localStorage.getItem("creditError");

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Find Your Perfect Match
      </h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your startup and what you're looking for...
                        For example: 'We are video OTT platform, currently we are seeking investor to fuel company growth.'"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim() ||error || creditError} 
          className={`w-full py-2 px-4 rounded-lg text-white font-medium
            ${loading || !query.trim() || error || creditError
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {loading ? 'Searching...' : (creditError) ? 'Not Sufficient credit...': 'Search' }
          
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
          <h3 className="font-semibold">Recommended Match:</h3>
          <p className="mt-2">{result}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBox;