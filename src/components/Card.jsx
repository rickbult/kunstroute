import React from "react";

import "./Card.css";

export const Card = ({
  imgSrc,
  imgAlt,
  title = "Naam kunstenaar",
  location = "Locatie",
  description = "Korte beschrijving",
  buttonText = "Aanwezigheid",
  link = "#",
}) => {
  return (
    <div className="card-container">
      <div className="card-header">
        {imgSrc && imgAlt && <img src={imgSrc} alt={imgAlt} />}
        {title && <h1 className="card-title">{title}</h1>}
        {location && <div className="card-location">{location}</div>}
      </div>
      <div className="card-body">
        {description && <p className="card-description">{description}</p>}
        {buttonText && link && (
          <a href={link} className="card-btn">
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};
