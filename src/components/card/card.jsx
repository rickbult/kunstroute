import React from "react";
import "./card.css";  

export default function Card({ name, title, bio, picture, adres, wheelchairaccessibility, day, phonenumer, email, website }) {
  return (
    <div className="card">
      <img src={picture} alt={name} className="card-picture" />
      <h2>{name}</h2>
      <p className="card-title">{title}</p>
      <p className="bio">{bio}</p>
      <p><strong>📍 Adres:</strong> {adres}</p>
      <p><strong>♿ Rolstoel:</strong> {wheelchairaccessibility}</p>
      <p><strong>📅 Open:</strong> {day}</p>
      <p><strong>📞 Tel:</strong> {phonenumer}</p>
      <p><strong>✉️ Email:</strong> {email}</p>
      <p><strong>🌐 Website:</strong> <a href={website} target="_blank" rel="noopener noreferrer">{website}</a></p>
    </div>
  );
}
