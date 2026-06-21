import { useLocation, useNavigate } from 'react-router-dom';
import { register } from '../../Utils/auth';
import './Voorwaarden.css';

export default function Voorwaarden() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;

  if (!userData) {
    return (
      <div className="voorwaarden-container">
        <h2>Geen gegevens gevonden.</h2>
        <button className="vw-btn" onClick={() => navigate('/registreren')}>Terug naar registreren</button>
      </div>
    );
  }

  function handleAccept() {
    const result = register(userData);
    if (!result.success) {
      alert(result.error);
      return;
    }
    navigate('/payment');
  }

  return (
    <div className="voorwaarden-bg">
      <div className="voorwaarden-content">
        <h1>Voorwaarden voor deelname aan de kunstroute Noordwest Veluwe</h1>
        <p>Om deel te nemen aan de Kunstroute moet aan een aantal voorwaarden worden voldaan.</p>

        <h2>Professionaliteit</h2>
        <p>Je bent op een professionele manier werkzaam als kunstenaar en je kunt voldoende werk tonen.</p>

        <h2>Atelier</h2>
        <p>Je atelier/expositieruimte ligt binnen de gemeenten Oldebroek, Elburg, Nunspeet, Harderwijk, Ermelo en Putten, is goed bereikbaar, heeft een professionele uitstraling en is geschikt om aantallen bezoekers te ontvangen of je exposeert bij een collega kunstenaar in één van genoemde gemeenten. Voorkeur gaat uit naar het clusteren van deelnemers: meer deelnemers op minder locaties.</p>

        <p>Indien er één of meerdere kunstenaars mee willen doen in jouw atelier dan dienen deze zich ook als deelnemer aan te melden. Als hij/zij nog niet is geballoteerd dan dient dit eerst te gebeuren. Het is niet toegestaan dat kunstwerken van niet-deelnemers aanwezig zijn in je atelier.</p>

        <p>Je ontvangt bezoekers en geeft hen, indien mogelijk, een indruk van je werkwijze door middel van demonstraties. Daarnaast houd je een bezoekersregistratie bij. De aantallen bezoekers (en de woonplaatsen van de bezoekers) zijn benodigd voor het jaarverslag ten behoeve van de sponsoren.</p>

        <h2>Ballotage</h2>
        <p>Bij nieuwe deelnemers en bij kunstenaars die na een onderbreking van 3 jaar of meer zich opnieuw aanmelden vindt ballotage plaats. De ballotagecommissie brengt altijd een bezoek aan de kandidaat-deelnemers. Zij doet dit samen met een lid van het bestuur.</p>

        <p>Het werk wordt getoetst aan de volgende criteria:</p>
        <ul>
          <li>techniek en materiaalbeheersing;</li>
          <li>verbeelding- en zeggingskracht;</li>
          <li>persoonlijke beeldtaal: samenhang in compositie, vormgevoel, kleurgebruik, contrast licht/donker, textuur en structuur;</li>
          <li>oorspronkelijkheid en ontwikkeling als zelfstandig werkend kunstenaar over een langere periode.</li>
        </ul>
        <p>Verder is belangrijk:</p>
        <ul>
          <li>ambitie en ontwikkeling van de kunstenaar;</li>
          <li>toegankelijkheid van het atelier voor het publiek.</li>
        </ul>

        <h2>Privacy</h2>
        <p>De kunstenaar geeft toestemming voor het opslaan van relevante persoonsgegevens. Tevens geeft men, door mee te doen met de Kunstroute, toestemming voor het plaatsen van identificeerbare foto’s op de website of sociale media.</p>

        <h2>Inschrijfgeld</h2>
        <p>Het inschrijfgeld bedraagt € 100,–</p>

        <h2>Boekje en foto’s</h2>
        <p>In het boekje en op de site www.kunstroute-noordwest-veluwe.nl wordt per deelnemer en per galerie slechts één foto vermeld.</p>

        <p>De foto moet van voldoende resolutie zijn en ook is de belichting en bijvoorbeeld het perspectief bij schilderijen (zodat een schilderij ook echt rechthoekig blijft) van belang voor de kwaliteit. Maak gebruik van de app "Office Lens" op jouw smartPhone.</p>

        <h2>Publiciteit en herkenningsmiddelen</h2>
        <p>Naast publiciteit in de media worden flyers, posters en boekjes gemaakt. Van jou wordt verwacht dat je actief deelneemt aan de verspreiding hiervan en dat je reclame maakt voor de Kunstroute via social media. Voor de "vindbaarheid" van de ateliers zijn vlaggen, routeborden en een beachflags beschikbaar.</p>

        <h2>Bijwonen van de openingsavond</h2>
        <p>Er wordt van jou verwacht dat je aanwezig bent bij de openingsavond van de kunstroute en dat je zelf de flyers, posters en boekjes ophaalt. Ben je verhinderd, regel deze zaken dan met een andere deelnemer.</p>

        <h2>Evaluatie</h2>
        <p>Er wordt van jou verwacht dat je na de kunstroute het evaluatieformulier invult. Invullen van het evaluatieformulier is van groot belang om zoveel mogelijk verbeterpunten voor het nieuwe jaar te verzamelen.</p>

        <div className="vw-actions">
          <button className="vw-btn-accept" onClick={handleAccept}>Ik ga akkoord en maak account aan</button>
          <button className="vw-btn-cancel" onClick={() => navigate('/registreren')}>Weigeren (Terug)</button>
        </div>
      </div>
    </div>
  );
}
