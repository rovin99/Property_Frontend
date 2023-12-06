// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import Property from './Property';
import Filter from './Filter';
//import LoadingAnimation from './LoadingAnimation';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import PropertyDetails from './PropertyDetails';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    availablefrom: [],
    price: [0, 1000000],
    type: [],
  });
  const [loading, setLoading] = useState(true);
  const [appliedFiltersCount] = useState(0);
  const [selectedFiltersHistory, setSelectedFiltersHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('Default');

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/list-properties'); // Replace with your property API endpoint
      const jsonData = await response.json();
      setData(jsonData.data);
      setFilteredData(jsonData.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [data, selectedFilters, sortOrder]);

  const filterAndSortData = () => {
    const filteredProperties = data.filter((property) => {
      const isPriceInRange = property.price >= selectedFilters.price[0] && property.price <= selectedFilters.price[1];

      return (
        (selectedFilters.location.length === 0 || selectedFilters.location.includes(property.location)) &&
        (selectedFilters.type.length === 0 || selectedFilters.type.includes(property.type)) &&
        // (selectedFilters.availablefrom.length === 0 || selectedFilters.availablefrom.includes(property.availablefrom)) &&
        isPriceInRange
      );
    });

    const sorted = sortData(filteredProperties, sortOrder);
    setFilteredData(sorted);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
    setSelectedFiltersHistory([...selectedFiltersHistory, { ...selectedFilters }]);
  };

  const sortData = (data, sortOrder) => {
    switch (sortOrder) {
      // Add sorting options as needed
      default:
        return data;
    }
  };

  return (
    <div className="App">
      <Router>
        <Routes>
         
          <Route
            path="/"
            element={
              <>
              <h1>Property Listings</h1>
                <Filter
                  data={data}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  appliedFiltersCount={appliedFiltersCount}
                  filteredDataCount={filteredData.length}
                />
                <div className="properties">
                    {filteredData.map((property) => (
                      <motion.div key={property.id} initial="hidden" animate="visible" exit="hidden">
                        <Property key={property.id} property={property} />
                      </motion.div>
                    ))}
                  </div>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
