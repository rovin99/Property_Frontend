import React, { useEffect, useState } from 'react';
import './App.css';
import Property from './Property';
import Filter from './Filter';

import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

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
      const response = await fetch('https://property-backend-zew1.onrender.com/api/list-properties');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
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
      const isPriceInRange =
        property.price >= selectedFilters.price[0] && property.price <= selectedFilters.price[1];
      const isAvailableFrom =
        selectedFilters.availablefrom.length === 0 ||
        selectedFilters.availablefrom.some((date) => new Date(date) <= new Date(property.availablefrom));

      return (
        (selectedFilters.location.length === 0 || selectedFilters.location.includes(property.location)) &&
        (selectedFilters.type.length === 0 || selectedFilters.type.includes(property.type)) &&
        isPriceInRange &&
        isAvailableFrom
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
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <img src="./assets/Logo.png" alt="logo" width="50" height="50" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
              </Nav>
              <Nav>
                <Button variant="outline-primary" className="mx-2">
                  Sign Up
                </Button>
                <Button variant="primary">Login</Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Container className="my-4">
                  <h1>Search Properties for Rent</h1>
                </Container>
                <Filter
                  data={data}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  appliedFiltersCount={appliedFiltersCount}
                  filteredDataCount={filteredData.length}
                />
                <Container>
                  <div className="properties">
                  {loading ? (
                      <p>Loading...</p>
                    ) : (
                      filteredData.map((property) => (
                        <motion.div key={property.id} initial="hidden" animate="visible" exit="hidden">
                          <Property key={property.id} property={property} />
                        </motion.div>
                      ))
                    )}
                  </div>
                </Container>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;