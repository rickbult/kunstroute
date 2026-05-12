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
      className="card-link-wrapper"
    >
      <div className="card">
        <img src={imgSrc} alt={imgAlt} loading="lazy" className="card-picture" />
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-location">{address}</p>
          <p className="card-description">{description}</p>
          <p  className="wheelchairaccessibility"> ♿{wheelchairaccessibility}</p>
          <span className="tag tag-days">{days}</span>
          
        </div>
      </div>
    </Link>
  );
});

Card.displayName = "Card";
