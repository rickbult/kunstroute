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
    <Link
      to={`/artist/${link}`}
      className="card-link"
    >
      <div className="card-container">
        <div className="card-header">
          <img src={imgSrc} alt={imgAlt || title} />
        </div>

        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-location">{address}</p>
          <p className="card-description">{description}</p>
          <p><strong>♿ Rolstoel:</strong> {wheelchairaccessibility}</p>
          <p><strong>📅 Openingstijden:</strong> {days}</p>

          {phone && (
            <p><strong>📞 Telefoon:</strong> {phone}</p>
          )}
          {email && (
            <p><strong>✉️ Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
          )}
          {website !== "#" && (
            <p>
              <strong>🌐 Website:</strong>{" "}
              <a href={website} className="website-link" target="_blank" rel="noreferrer">
                {website}
              </a>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
});

Card.displayName = "Card";
