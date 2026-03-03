import React from 'react';
import './App.css';

export const Card = ({
  name,
  title,
  bio,
  picture,
  adres,
  wheelchairaccessibility,
  day,
  phonenumer,
  email,
  website
}) => (
  <div className="card">
    <img src={picture} alt={name} className="card-picture" />
    <h2>{name}</h2>
    <p className="card-title">{title}</p>
    <p>{bio}</p>
    <p>Adres: {adres}</p>
    <p>Rolstoeltoegankelijk? {wheelchairaccessibility}</p>
    <p>Open op: {day}</p>
    <p>Telefoonnummer: {phonenumer}</p>
    <p>E-mailadres: {email}</p>
    <p>Website: {website}</p>
  </div>
);

const App = () => (
  <div className="flex-container">
    <Card
      picture="https://picsum.photos/seed/josderckx/320/320"
      name="Jos Derckx"
      title="Illustrator en Kunstenaar"
      bio="Zijn werk is kleurrijk, maatschappijkritisch en vol humor en surrealisme. Gebaseerd in Utrecht."
      adres="Nijverlei 10, Utrecht"
      wheelchairaccessibility="Ja"
      day="Zaterdag"
      phonenumer="030-7654321"
      email="jos@josderckx.nl"
      website="https://www.instagram.com/josderckx/"
    />
    <Card
      picture="https://picsum.photos/seed/janisdeman/320/320"
      name="JanIsDeMan"
      title="Street Art Kunstenaar"
      bio="Creeërt muurschilderingen verbonden met de locatie, met iconische ogen en boekenkasten. Utrechtse graffiti-artiest."
      adres="Oudegracht 200, Utrecht"
      wheelchairaccessibility="Afhankelijk van locatie"
      day="Zondag"
      phonenumer="030-8765432"
      email="info@janisdeman.com"
      website="https://www.janisdeman.com"
    />
    
  </div>
);

export default App;
