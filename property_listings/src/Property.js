import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faCar, faCouch, faRuler } from '@fortawesome/free-solid-svg-icons';

function Property({ property }) {
  const createdDate = new Date(parseDate(property.createdAt));
  const currentDate = new Date();
  const daysSinceCreation = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));

  let statusTag = "";
  
  if (property.deletedAt) {
    statusTag = "Sold";
  } else if (!isNaN(daysSinceCreation) && daysSinceCreation < 30) {
    statusTag = `New (${daysSinceCreation} days)`;
  } else if (!isNaN(daysSinceCreation)) {
    statusTag = `(${daysSinceCreation} days)`;
  }

  // Parse amenities data
  const amenitiesArray = property.amenities.split(',');

  const bedrooms = amenitiesArray.find(amenity => amenity.toLowerCase().includes('bed')) || '0';
  const bathrooms = amenitiesArray.find(amenity => amenity.toLowerCase().includes('bath')) || '0';
  const parkingSpaces = amenitiesArray.find(amenity => amenity.toLowerCase().includes('parking')) || '0';
  const furnishedStatus = amenitiesArray.find(amenity => amenity.toLowerCase().includes('furnished')) || 'Not Specified';
  const carpetArea = property.carpetArea || 'Not Specified';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div className="property" variants={cardVariants} initial="hidden" animate="visible">
      <Link to={`/property/${property.id}`} style={{ textDecoration: 'none' }}>
        <Card>
          <Card.Img variant="top" src={'https://images.app.goo.gl/eZnodztCexdQnebQ6'} alt={property.pic} />
        
          <Card.Body>
            <Card.Title>{property.name}</Card.Title>
            <Card.Text>{`Price: Rs ${property.price}/month`}</Card.Text>
            <Card.Text>
              <strong>Location:</strong> {property.location}<br />
              <strong>Available from:</strong> {new Date(property.availablefrom).toLocaleDateString()}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <div className="amenities" style={{padding: '10px'}}>
              <FontAwesomeIcon icon={faBed} /> {bedrooms.trim() }
              <FontAwesomeIcon icon={faBath} /> {bathrooms.trim()}
              <FontAwesomeIcon icon={faCar} /> {parkingSpaces.trim()}
              <FontAwesomeIcon icon={faCouch} /> {furnishedStatus.trim()}
              <FontAwesomeIcon icon={faRuler} /> {carpetArea.trim()}
            </div>
          </Card.Footer>
        </Card>
      </Link>
    </motion.div>
  );
}

function parseDate(dateString) {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);
  if (day && month && year) {
    const [hour, minute, second] = (timePart || "00:00:00").split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  }
  return null;
}

export default Property;
