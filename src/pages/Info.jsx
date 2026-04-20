import React from "react";
import "./InfoPage.css";

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.75a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const boardMembers = [
  {
    name: "Teunie Bastiaan",
    role: "Voorzitter",
    photo: "",
    phone: "0619 – 93 58 77",
    email: "voorzitter@kunstroute-noordwest-veluwe.nl",
  },
  {
    name: "Hans Bastiaan",
    role: "Penningmeester",
    photo: "",
    phone: "0610 – 91 97 45",
    email: "penningmeester@kunstroute-noordwest-veluwe.nl",
  },
  {
    name: "Gerda van 't Goor",
    role: "Secretaris",
    photo: "",
    phone: "0629 – 19 09 18",
    email: "secretaris@kunstroute-noordwest-veluwe.nl",
  },
];

const navItems = [
  { label: "Geschiedenis Kunstroute", href: "#geschiedenis" },
  { label: "Bestuur", href: "#bestuur" },
  { label: "Doelstelling", href: "#doelstelling" },
  { label: "Ballotage", href: "#ballotage" },
  { label: "Voorwaarden Deelname", href: "#voorwaarden" },
  { label: "Overzichtstentoonstelling", href: "#overzicht" },
];

export const InfoPage = () => {
  return (
    <div className="info-page-layout">

      <aside className="info-sidebar">
        <p className="sidebar-heading">OVER DE KUNSTROUTE</p>
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="sidebar-link">
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="info-wrapper">

      <section id="geschiedenis" className="info-section logo-story">
        <h2 className="logo-story-title">
          Van donkergroen naar frisse vernieuwing – Het verhaal achter ons nieuwe logo
        </h2>
        <p>
          In 2023 kreeg de Kunstroute Noordwest Veluwe een nieuw gezicht. Na twintig jaar vonden
          we het tijd voor een visuele vernieuwing – een logo dat past bij de toekomst van de
          route, zonder het verleden te vergeten.
        </p>
        <p>
          De jonge Zwolse kunstenaar <strong>Anna Kindt</strong> kreeg de opdracht mee: ontwerp
          een logo met een <strong>jonge, frisse en uitnodigende uitstraling</strong>. En dat is
          precies wat ze heeft gedaan. Het resultaat is een eigentijds beeldmerk waarin de
          herkenbaarheid behouden blijft, maar met een eigentijdse twist. Anna maakte ook het
          korte filmpje op onze website, waarin de sfeer van de route prachtig wordt gevangen.
        </p>
        <p>
          De <strong>groene kleur</strong> uit het oorspronkelijke logo bleef behouden, maar kreeg
          een lichtere, vriendelijkere tint. Niet zonder reden: het oude donkergroen verdween
          haast tegen de achtergrond van onze bosrijke Veluwse omgeving. Dat contrast vroeg om
          iets nieuws.
        </p>
        <p>Maar waar kwam die originele kleur eigenlijk vandaan?</p>
        <p>
          Via oud-bestuurslid Bert Spijkerman kwamen we in contact met{" "}
          <strong>Susan Ollebek-Scheele</strong>, een van de grondleggers van onze kunstroute. In
          een prachtig gesprek in haar huis – omringd door natuur, verhalen en herinneringen –
          ontvouwde zich een rijke geschiedenis. Susan bleek tot haar tachtigste actief betrokken
          te zijn geweest. Ze beheerde de ballotage, verzorgde de tentoonstellingen, hield de
          administratie bij én schonk steevast koffie en thee tijdens openingen.
        </p>
        <p>
          Ze bewaart nog altijd <strong>alle boekjes</strong> van de route, die tegenwoordig te
          bewonderen zijn in een vitrine. Susan wist zich ook nog te herinneren dat de groene
          kleur ooit werd afgekeken van een makelaarslogo uit Nunspeet.
        </p>
      </section>

      <section className="info-section history">
        <h3>Een route met geschiedenis</h3>
        <p>
          De Kunstroute Noordwest Veluwe kent een bijzondere oorsprong. <strong>In 2001</strong>{" "}
          zorgde een lokale sponsor van de Noordoost Veluwe-route ervoor dat ook{" "}
          <strong>Nunspeetse kunstenaars</strong> konden meedoen. Een jaar later, in 2002, kreeg
          Nunspeet een eigen kunstroute. Er volgde een regionale samenwerking, met subsidie van de
          provincie Gelderland. Zo ontstond de Kunstkring Noordwest Veluwe, die in 2003 werd
          ingeschreven bij de Kamer van Koophandel.
        </p>
        <p>
          De eerste jaren was er sprake van samenwerking met de Noordoost Veluwe-route (in
          oktober), maar vanaf 2003 ging de Noordwest Veluwe-route{" "}
          <strong>zelfstandig verder</strong>. Het zwaartepunt lag voortaan in{" "}
          <strong>september</strong>, met startpunt in de Vrije Academie van Nunspeet. Later
          sloten ook Elburg, Wezep, Oldebroek, Harderwijk en Ermelo zich aan.
        </p>

        <h3>Een collectief van makers</h3>
        <p>
          De kunstroute werd jarenlang gedragen door bevlogen bestuursleden en vrijwilligers.
          Namen als <strong>Kees Spapens</strong>, <strong>Peter Kern</strong>,{" "}
          <strong>Susan Ollebek</strong>, <strong>Trudy Kroeze</strong>,{" "}
          <strong>Bert Spijkerman</strong>, en <strong>Ali de Graaf</strong> staan in onze
          annalen. In 2019 volgde een nieuwe impuls: <strong>Teunie Bastiaan</strong> nam het
          voorzitterschap op zich, <strong>Gerda van 't Goor</strong> het secretariaat en{" "}
          <strong>Hans Bastiaan</strong> de website, boekjes én later het penningmeesterschap.
        </p>
        <p>
          Met de herintroductie van een fris logo in 2023 werd ook de naam Kunstkring
          losgelaten. Vanaf nu gaan we verder als: <strong>Kunstroute Noordwest Veluwe.</strong>
        </p>
        <p>En dat mag gezien worden.</p>
      </section>

      <section id="bestuur" className="info-section bestuur">
        <h2 className="bestuur-title">Het bestuur</h2>
        <div className="bestuur-grid">
          {boardMembers.map((member) => (
            <div key={member.name} className="bestuur-card">
              <p className="bestuur-name">{member.name}</p>
              <p className="bestuur-role">{member.role}</p>
              <div className="bestuur-photo">
                <img src={member.photo} alt={member.name} />
              </div>
              <div className="bestuur-contact">
                <div className="contact-row">
                  <span className="contact-badge"><PhoneIcon /></span>
                  <span>{member.phone}</span>
                </div>
                <div className="contact-row">
                  <span className="contact-badge"><EmailIcon /></span>
                  <a href={`mailto:${member.email}`}>{member.email}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="doelstelling" className="info-section doelstelling">
        <h3 className="doelstelling-heading">Doelstelling</h3>
        <div className="doelstelling-body">
          <div className="doelstelling-text">
            <p>
              De stichting "Kunstkring Noordwest-Veluwe" heeft als doelstelling kunst voor een
              breed publiek meer toegankelijk te maken door kunstenaars uit de regio een podium te
              bieden waarop zij hun kunst aan iedereen kunnen laten zien. Ook voor
              amateur-kunstenaars, die al jaren bezig zijn met het uitvoeren van beeldende kunst,
              is dit een mooie opstap.
            </p>
            <p>
              Het bestuur organiseert elk jaar de Kunstroute op de Noordwest-Veluwe. Heel veel
              enthousiaste kunstenaars uit de verschillende dorpen en steden op de
              Noordwest-Veluwe exposeren hun kunstwerken.
            </p>
            <p>
              U kunt in deze weekenden op een gezellige, informele manier kennis maken met de
              kunstenaars die exposeren. U bent van harte welkom in de ateliers om te zien hoe een
              kunstwerk tot stand komt. De kunstenaars kunnen uitleg geven over de technieken en
              materialen die worden gebruikt en zij vertellen graag meer over het verhaal achter
              hun kunstwerk. Op deze manier krijgt u een goede indruk van de verschillende
              disciplines, technieken en van zeer uiteenlopende opvattingen en manieren van
              werken. Naast het bekijken van de kunstwerken is het ook mogelijk een kunstwerk te
              kopen of een opdracht te plaatsen.
            </p>
            <p className="doelstelling-meer">Meer weten?</p>
            <p>
              Neem contact met ons door een mail te sturen naar{" "}
              <a href="mailto:voorzitter@kunstroute-noordwest-veluwe.nl">
                voorzitter@kunstroute-noordwest-veluwe.nl
              </a>
            </p>
            <p>
              Bellen mag ook =&gt; 0619 935 877 (Teunie Bastiaan – Voorzitter)
            </p>
          </div>
          <div className="doelstelling-image">
            <img src="" alt="Doelstelling" />
          </div>
        </div>
      </section>

      <section id="voorwaarden" className="info-section voorwaarden">
        <h2 className="voorwaarden-title">
          Voorwaarden voor deelname aan de kunstroute Noordwest Veluwe
        </h2>
        <p>Om deel te nemen aan de Kunstroute moet aan een aantal voorwaarden worden voldaan.</p>

        <h4>Professionaliteit</h4>
        <p>
          Je bent op een professionele manier werkzaam als kunstenaar en je kunt voldoende werk
          tonen.
        </p>

        <h4>Atelier</h4>
        <p>
          Je atelier/expositieruimte ligt binnen de gemeenten Oldebroek, Elburg, Nunspeet,
          Harderwijk, Ermelo en Putten, is goed bereikbaar, heeft een professionele uitstraling en
          is geschikt om aantallen bezoekers te ontvangen of je exposeert bij een collega
          kunstenaar in één van genoemde gemeenten. Voorkeur gaat uit naar het clusteren van
          deelnemers: meer deelnemers op minder locaties.
        </p>
        <p>
          Indien er één of meerdere kunstenaars mee willen doen in jouw atelier dan dienen deze
          zich ook als deelnemer aan te melden. Als hij/zij nog niet is geballoteerd dan dient dit
          eerst te gebeuren. Het is <u><strong>niet</strong></u> toegestaan dat kunstwerken van
          niet-deelnemers aanwezig zijn in je atelier.
        </p>
        <p>
          Je ontvangt bezoekers en geeft hen, indien mogelijk, een indruk van je werkwijze door
          middel van demonstraties. Daarnaast houd je een bezoekersregistratie bij. De aantallen
          bezoekers (en de woonplaatsen van de bezoekers) zijn benodigd voor het jaarverslag ten
          behoeve van de sponsoren.
        </p>

        <h4 id="ballotage">Ballotage</h4>
        <p>
          Bij nieuwe deelnemers en bij kunstenaars die na een onderbreking van 3 jaar of meer
          zich opnieuw aanmelden vindt ballotage plaats. De ballotagecommissie brengt altijd een
          bezoek aan de kandidaat-deelnemers. Zij doet dit samen met een lid van het bestuur.
        </p>
        <p><em>Het werk wordt getoetst aan de volgende criteria:</em></p>
        <ul className="voorwaarden-list">
          <li>techniek en materiaalbeheersing;</li>
          <li>verbeelding- en zeggingskracht;</li>
          <li>
            persoonlijke beeldtaal: samenhang in compositie, vormgevoel, kleurgebruik, contrast
            licht/donker, textuur en structuur;
          </li>
          <li>
            oorspronkelijkheid en ontwikkeling als zelfstandig werkend kunstenaar over een
            langere periode.
          </li>
        </ul>
        <p><em>Verder is belangrijk:</em></p>
        <ul className="voorwaarden-list">
          <li>ambitie en ontwikkeling van de kunstenaar;</li>
          <li>toegankelijkheid van het atelier voor het publiek.</li>
        </ul>

        <h4>Privacy</h4>
        <p>
          De kunstenaar geeft toestemming voor het opslaan van relevante persoonsgegevens. Tevens
          geeft men, door mee te doen met de Kunstroute, toestemming voor het plaatsen van
          identificeerbare foto&#39;s op de website of sociale media.
        </p>

        <h4>Inschrijfgeld</h4>
        <p>Het inschrijfgeld bedraagt &euro; 100,&ndash;</p>

        <h4>Boekje en foto&#39;s</h4>
        <p>
          In het boekje en op de site{" "}
          <a href="https://www.kunstroute-noordwest-veluwe.nl" target="_blank" rel="noreferrer">
            www.kunstroute-noordwest-veluwe.nl
          </a>{" "}
          wordt per deelnemer en per galerie slechts één foto vermeld.
        </p>
        <p>
          De foto moet van voldoende resolutie zijn en ook is de belichting en bijvoorbeeld het
          perspectief bij schilderijen (zodat een schilderij ook echt rechthoekig blijft) van
          belang voor de kwaliteit. Maak gebruik van de app &ldquo;Office Lens&rdquo; op jouw
          smartPhone.
        </p>

        <h4>Publiciteit en herkenningsmiddelen</h4>
        <p>
          Naast publiciteit in de media worden flyers, posters en boekjes gemaakt. Van jou wordt
          verwacht dat je actief deelneemt aan de verspreiding hiervan en dat je reclame maakt
          voor de Kunstroute via social media. Voor de &ldquo;vindbaarheid&rdquo; van de ateliers
          zijn vlaggen, routeborden en een beachflags beschikbaar.
        </p>

        <h4>Bijwonen van de openingsavond</h4>
        <p>
          Er wordt van jou verwacht dat je aanwezig bent bij de openingsavond van de kunstroute
          en dat je zelf de flyers, posters en boekjes ophaalt. Ben je verhinderd, regel deze
          zaken dan met een andere deelnemer.
        </p>

        <h4>Evaluatie</h4>
        <p>
          Er wordt van jou verwacht dat je na de kunstroute het evaluatieformulier invult.
          Invullen van het evaluatieformulier is van groot belang om zoveel mogelijk
          verbeterpunten voor het nieuwe jaar te verzamelen.
        </p>
      </section>

      <section id="overzicht" className="info-section overzicht">
        <h2 className="overzicht-title">Overzichtstentoonstelling 2025</h2>
        <p>
          In de Veluvine Nunspeet is van{" "}
          <strong>3 september t/m 23 september 2025</strong> een overzichtstentoonstelling
          ingericht met diverse kunstwerken van de deelnemende kunstenaars. Deze tentoonstelling
          is te bezoeken tijdens de openingsuren.
        </p>
        <div className="overzicht-image">
          <img src="" alt="Veluvine Nunspeet" />
        </div>
      </section>

      <section className="info-section verspreiding">
        <h2 className="verspreiding-title">
          Verspreiding flyers (A5), poster (A3) en boekje (A5 vierkant)
        </h2>
        <p>
          Elk jaar verspreiden we in een aantal plaatsen bij verschillende instellingen flyers,
          posters en boekjes:
        </p>
        <ul className="verspreiding-list">
          <li>50 flyers (A5)</li>
          <li>1 poster (A3)</li>
          <li>2 boekjes (dit zijn inkijk exemplaren)</li>
        </ul>
        <p>
          Plaatsen: Ermelo, Putten, Harderwijk, Nunspeet, Elburg, Oldebroek, Kampen, Elspeet,
          Vierhouten.
        </p>
      </section>

      </div>
    </div>
  );
};
