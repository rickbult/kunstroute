import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";  


export const Card = React.memo(({ 
  imgSrc,           
  imgAlt = "Artist",
  title,             
  description,      
  address,          
  wheelchairaccessibility = "Onbekend",
  days,             
  phone,            
  email,
  website = "#",
  link = "#"
}) => {
  return (
    
    <Link to={`/artist/${link}`} className="card-link-wrapper">
      <div className="card">
        <img src={imgSrc} alt={imgAlt || title} className="card-picture" />
        <h2>{title}</h2>
        <p className="card-title">{days}</p>
        <p className="bio">{description}</p>
        {address && <p><strong>📍 Adres:</strong> {address}</p>}
        <p><strong>♿ Rolstoel:</strong> {wheelchairaccessibility}</p>
        {phone && <p><strong>📞 Tel:</strong> {phone}</p>}
        {email && <p><strong>✉️ Email:</strong> {email}</p>}
        {website !== "#" && (
          <p><strong>🌐 Website:</strong> 
            <span className="website-link">{website}</span>
          </p>
        )}
      </div>
    </Link>
  );
});

Card.displayName = 'Card';