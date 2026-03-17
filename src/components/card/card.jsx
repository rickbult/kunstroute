import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

export const Card = ({ artist }) => {
  return (
    <Link to={`/artist/${artist.id}`} className="card-link">
      <div className="card-container">
        <div className="card-header">
          <img src={artist.picture} alt={artist.name} />
          <h1 className="card-title">{artist.name}</h1>
          <div className="card-location">{artist.adres}</div>
        </div>
        <div className="card-body">
          <p className="card-description">{artist.bio}</p>
          <span className="card-btn">{artist.day}</span>
        </div>
      </div>
    </Link>
  );
};
