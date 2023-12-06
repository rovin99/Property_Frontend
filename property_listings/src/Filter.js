import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Form } from 'react-bootstrap';
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Filter({ data, selectedFilters, onFilterChange, filteredDataCount }) {
  const uniqueLocations = [...new Set(data.map((item) => item.location))];
  const uniquePropertyTypes = [...new Set(data.map((item) => item.type))];

  uniqueLocations.sort();
  uniquePropertyTypes.sort();

  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    const selectedLocation = selectedFilters.location;

    let allCities = [];
    if (selectedLocation.length === 0) {
      allCities = [...new Set(data.map((item) => item.location))];
    } else {
      allCities = [
        ...new Set(
          data.filter((item) => selectedLocation.includes(item.location)).map((item) => item.location)
        ),
      ];
    }

    setAvailableCities(allCities);
  }, [selectedFilters.location, data]);

  
  const minPrice = Math.min(...data.map((item) => item.price));
  const maxPrice = Math.max(...data.map((item) => item.price));

  const handleCheckboxChange = (filterType, isChecked, value) => {
    const updatedFilters = { ...selectedFilters };
    if (isChecked) {
      updatedFilters[filterType] = [...updatedFilters[filterType], value];
    } else {
      updatedFilters[filterType] = updatedFilters[filterType].filter((val) => val !== value);
    }
    onFilterChange(filterType, updatedFilters[filterType]);
  };

  const handleFilterSelect = (filterType, values) => {
    onFilterChange(filterType, values);
  };

 
  const [priceValues, setPriceValues] = useState([minPrice, maxPrice]);

  const handleResetFilters = () => {
    
    onFilterChange('location', []);
    
    onFilterChange('price', [minPrice, maxPrice]);
    onFilterChange('type', []);

   
    document.getElementById('locationDropdown').selectedIndex = 0;

    
    setPriceValues([minPrice, maxPrice]);
  };

  return (
    <div className="filter-container">
      <Form>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0" className="accordion-item">
            <Accordion.Header className="accordion-header">Location </Accordion.Header>
            <Accordion.Body className="accordion-body">
              <Form.Group className="Location">
                <Form.Select
                  id="locationDropdown"
                  onChange={(e) => handleFilterSelect('location', [e.target.value])}
                >
                  <option value="">Select Location</option>
                  {uniqueLocations.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        
        <div className="form-group">
          <label>Price Range: {priceValues[0]} - {priceValues[1]}</label>
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            value={priceValues}
            onChange={(values) => {
              setPriceValues(values);
              handleFilterSelect('price', values);
            }}
          />
        </div>
        <Accordion>
          <Accordion.Item eventKey="0" className="accordion-item">
            <Accordion.Header className="accordion-header">Property Type </Accordion.Header>
            <Accordion.Body className="accordion-body">
              <Form.Group className="PropertyType">
                {uniquePropertyTypes.map((option, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    label={option}
                    value={option}
                    onChange={(e) => handleCheckboxChange('type', e.target.checked, option)}
                  />
                ))}
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>

      <div>
        <button className="reset-button" onClick={handleResetFilters}>
          Reset Filters
        </button>
        <div className="filter-count">{`${filteredDataCount} out of ${data.length} properties`}</div>
      </div>
    </div>
  );
}

export default Filter;
