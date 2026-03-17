import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Card.css";

const Card = ({
  imgSrc,
  imgAlt,
  title = "Naam kunstenaar",
  location = "Locatie",
  description = "Korte beschrijving",
  days = "Dagen Aanwezig",
  link = "#",
}) => {
  return (
    <Link to={`/artist/${link}`} className="card-link" role="button" tabIndex={0}>
      <div className="card-container">
        <div className="card-header">
          {imgSrc && imgAlt && (
            <img 
              src={imgSrc.startsWith('http') ? imgSrc : `/img/${imgSrc}`} 
              alt={imgAlt} 
              loading="lazy"
            />
          )}
          {title && <h2 className="card-title">{title}</h2>}
          {location && <div className="card-location">{location}</div>}
        </div>
        <div className="card-body">
          {description && <p className="card-description">{description}</p>}
          {days && <span className="card-btn" aria-label="Dagen aanwezig">{days}</span>}
        </div>
      </div>
    </Link>
  );
};

Card.propTypes = {
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  title: PropTypes.string,
  location: PropTypes.string,
  description: PropTypes.string,
  days: PropTypes.string,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Card;
