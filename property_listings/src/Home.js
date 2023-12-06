// Home.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [priceRangeFilter, setPriceRangeFilter] = useState([0, 1000000]);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/list-properties');
      const jsonData = await response.json();
      setProperties(jsonData.data);
      setFilteredProperties(jsonData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    let filtered = properties;

    if (locationFilter) {
      filtered = filtered.filter(property => property.location === locationFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(property => new Date(property.availablefrom) >= dateFilter);
    }

    filtered = filtered.filter(property => property.price >= priceRangeFilter[0] && property.price <= priceRangeFilter[1]);

    if (propertyTypeFilter) {
      filtered = filtered.filter(property => property.type === propertyTypeFilter);
    }

    setFilteredProperties(filtered);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>Property Listings</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Location</Form.Label>
            <Form.Control as="select" onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="">All</option>
              {/* Add options dynamically based on your data */}
              <option value="Andheri, Mumbai">Andheri, Mumbai</option>
              <option value="Bandra, Mumbai">Bandra, Mumbai</option>
              <option value="Dadar, Mumbai">Dadar, Mumbai</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Available from</Form.Label>
            <DatePicker
              selected={dateFilter}
              onChange={(date) => setDateFilter(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Price Range</Form.Label>
            <div>
              <Form.Label>${priceRangeFilter[0]}</Form.Label>
              <Form.Label className="float-end">${priceRangeFilter[1]}</Form.Label>
            </div>
            <Form.Control
              type="range"
              min={0}
              max={1000000}
              value={priceRangeFilter[1]}
              onChange={(e) => setPriceRangeFilter([priceRangeFilter[0], +e.target.value])}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Property Type</Form.Label>
            <Form.Control as="select" onChange={(e) => setPropertyTypeFilter(e.target.value)}>
              <option value="">All</option>
              {/* Add options dynamically based on your data */}
              <option value="flat">Flat</option>
              <option value="villa">Villa</option>
              {/* Add more property types */}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3} className="mt-2">
          <Button variant="primary" onClick={handleFilter}>
            Apply Filters
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row>
                {filteredProperties.map((property) => (
                  <Col md={4} key={property.id} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>{property.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{property.location}</Card.Subtitle>
                        <Card.Text>
                          {`Price: Rs ${property.price}/month`}
                        </Card.Text>
                        <Card.Text>{`Available from: ${new Date(property.availablefrom).toLocaleDateString()}`}</Card.Text>
                        <Card.Text>{`Type: ${property.type}`}</Card.Text>
                        <Card.Text>{`Amenities: ${property.amenities}`}</Card.Text>
                        <Card.Text>{`Carpet Area: ${property.carpetArea}`}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

