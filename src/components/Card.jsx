import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

export const Card = React.memo(({ 
  imgSrc,                 
  imgAlt = "Artist",
  title,                 
  description = "",      
  address = "",          
  wheelchairaccessibility = "Onbekend",
  days = "",             
  link,        
}) => {
  return (
    <Link
      to={`/artist/${link}`}
      className="card-link"
    >
      <div className="card-container">
        <div className="card-header">
          <img src={imgSrc} alt={imgAlt} />
        </div>

        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-location">{address}</p>
          <p className="card-description">{description}</p>
          <p className="wheelchairaccessibility">
            <strong>Rolstoeltoegankelijk:</strong> {wheelchairaccessibility}</p>
          <p className="openinghours"><strong>Openingstijden:</strong> {days}</p>
        </div>
      </div>
    </Link>
  );
});

Card.displayName = "Card";
