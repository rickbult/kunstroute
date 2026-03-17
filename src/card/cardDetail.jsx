import React from "react";
import { Link } from "react-router-dom";
import "./card.css";
import artistsData from "../data/artists.json";

export default function CardList({ artists = artistsData }) {
  return (
    <div className="card-list">
      {artists.map(artist => (
        <Link key={artist.link} to={`/artist/${artist.link}`} className="artist-card">
          <img src={artist.imgSrc} alt={artist.title} />
          <div className="card-content">
            <h3>{artist.title}</h3>
            <p>{artist.location}</p>
            <p>{artist.description?.slice(0, 100)}...</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
