import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

export const Card = ({
  imgSrc,
  imgAlt,
  title = "Naam kunstenaar",
  location = "Locatie",
  description = "Korte beschrijving",
  days = "Dagen Aanwezig",
  link = "#",
}) => {
  return (
    <Link to={`/artist/${link}`} className="card-link">
      <div className="card-container">
        <div className="card-header">
          {imgSrc && imgAlt && <img src={imgSrc} alt={imgAlt} />}
          {title && <h1 className="card-title">{title}</h1>}
          {location && <div className="card-location"> {location}</div>}
        </div>
        <div className="card-body">
          {description && <p className="card-description">{description}</p>}
          {days && <span className="card-btn">{days}</span>}
        </div>
      </div>
    </Link>
  );
};
