import React from "react";
import { Link } from "react-router-dom";
import "./card.css";  

export default function Card({ 
  imgSrc,           
  title,             
  description,      
  address,          
  wheelchairaccessibility = "Onbekend",
  days,             
  phone,            
  email,
  website = "#",
  link = "#",
  imgAlt = "Artist"
}) {
  return (
    <Link to={`/artist/${link}`} className="card-link-wrapper">
      <div className="card">
        <img src={imgSrc} alt={title} className="card-picture" />
        <h2>{title}</h2>
        <p className="card-title">{days}</p>
        <p className="bio">{description}</p>
        {address && <p><strong>📍 Adres:</strong> {address}</p>}
        <p><strong>♿ Rolstoel:</strong> {wheelchairaccessibility}</p>
        <p><strong>📅 Open:</strong> {days}</p>
        {phone && <p><strong>📞 Tel:</strong> {phone}</p>}
        {email && <p><strong>✉️ Email:</strong> {email}</p>}
        {website !== "#" && (
          <p><strong>🌐 Website:</strong> 
            <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
          </p>
        )}
      </div>
    </Link>
  );
}
