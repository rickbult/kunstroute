import React from 'react';
import './App.css';
import Searchbar from './searchbar.jsx';
import Navbar from './navbar.jsx';
import Card from './card.jsx';

function App() {
  return (
    <div className="app">
      <Navbar />
      <h1 className="page-title">Onze Kunstenaars</h1>
      <Searchbar />
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
          name="Jan Is De Man" 
          title="Street Art Kunstenaar" 
          bio="Creëert muurschilderingen die verbonden zijn met de locatie, vaak met iconische ogen en boekenkasten." 
          adres="Oudegracht 200, Utrecht" 
          wheelchairaccessibility="Afhankelijk van locatie" 
          day="Zondag" 
          phonenumer="030-8765432" 
          email="info@janisdeman.com" 
          website="https://www.janisdeman.com" 
        />
        <Card 
          picture="https://picsum.photos/seed/emilyart/320/320" 
          name="Emily van den Broek" 
          title="Keramiste" 
          bio="Werkt met lokale klei om natuurlijke texturen te verkennen in minimalistische keramiek." 
          adres="Lombokstraat 12, Utrecht" 
          wheelchairaccessibility="Ja" 
          day="Donderdag & Vrijdag" 
          phonenumer="06-11223344" 
          email="studio@emilykeramiek.nl" 
          website="https://www.emilykeramiek.nl" 
        />
        <Card 
          picture="https://picsum.photos/seed/lucaschreuder/320/320" 
          name="Lucas Schreuder" 
          title="Fotograaf" 
          bio="Richt zich op stedelijke architectuur en het samenspel tussen licht en schaduw." 
          adres="Wittevrouwenstraat 45, Utrecht" 
          wheelchairaccessibility="Nee" 
          day="Woensdag" 
          phonenumer="030-9988776" 
          email="lucas@lichtbeeld.com" 
          website="https://www.lichtbeeld.com" 
        />
        <Card 
          picture="https://picsum.photos/seed/sofiedesigns/320/320" 
          name="Sofie Designs" 
          title="Grafisch Ontwerper" 
          bio="Combineert typografie en krachtige kleuren in branding voor duurzame merken." 
          adres="Kanaalstraat 88, Utrecht" 
          wheelchairaccessibility="Ja" 
          day="Maandag t/m Vrijdag" 
          phonenumer="030-2233445" 
          email="sofie@sofiedesigns.nl" 
          website="https://www.sofiedesigns.nl" 
        />
      </div>
    </div>
  );
}

export default App;
