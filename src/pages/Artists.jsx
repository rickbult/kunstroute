import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/Card.jsx";
import { FilterBalk } from "../components/filter.jsx";
import "./Artists.css";

export default function Artists() {
  const [zoekterm, setZoekterm] = useState("");
  const [geselecteerdeFilters, setGeselecteerdeFilters] = useState({});
  const [artistsData, setArtistsData] = useState([]);
  const [isLaden, setIsLaden] = useState(true);
  const [fout, setFout] = useState("");

  useEffect(() => {
    let actief = true;

    fetch("/api/artists")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (!actief || !Array.isArray(data)) {
          return;
        }

        setArtistsData(data);
      })
      .catch((error) => {
        if (actief) {
          setFout(`Kon kunstenaars niet laden: ${error.message}`);
        }
      })
      .finally(() => {
        if (actief) {
          setIsLaden(false);
        }
      });

    return () => {
      actief = false;
    };
  }, []);

  const filterOpties = useMemo(() => {
    const uniekeOpeningsdagen = new Set();
    const uniekePlaatsen = new Set();
    const uniekeKunstvormen = new Set();
    const uniekeRolstoelNiveaus = new Set();

    artistsData.forEach((kaart) => {
      const dagMatches = kaart.days?.match(/[A-Za-zÀ-ÿ]+dag/g) || [];
      dagMatches.forEach((dag) => uniekeOpeningsdagen.add(dag));

      const plaats = kaart.address?.split(",").pop()?.trim();
      if (plaats) {
        uniekePlaatsen.add(plaats);
      }

      if (kaart.discipline) {
        uniekeKunstvormen.add(kaart.discipline);
      }

      if (kaart.wheelchairaccessibility) {
        uniekeRolstoelNiveaus.add(kaart.wheelchairaccessibility);
      }
    });

    const opNederlands = (a, b) => a.localeCompare(b, "nl");

    return {
      openingsdagen: Array.from(uniekeOpeningsdagen).sort(opNederlands),
      plaatsen: Array.from(uniekePlaatsen).sort(opNederlands),
      kunstvormen: Array.from(uniekeKunstvormen).sort(opNederlands),
      rolstoelNiveaus: Array.from(uniekeRolstoelNiveaus).sort(opNederlands),
    };
  }, []);

  let gefilterdeKaarten = artistsData.filter((kaart) => {
    const voldoetAanZoekterm = kaart.title?.toLowerCase().includes(zoekterm.toLowerCase());

    const rolstoelFilter = geselecteerdeFilters.rolstoelToegang || [];
    const voldoetAanRolstoel =
      rolstoelFilter.length === 0 ||
      rolstoelFilter.includes(kaart.wheelchairaccessibility);

    const plaatsFilter = geselecteerdeFilters.plaats || [];
    const voldoetAanPlaats =
      plaatsFilter.length === 0 ||
      plaatsFilter.some((plaats) => kaart.address?.includes(plaats));

    const kunstvormFilter = geselecteerdeFilters.kunstvorm || [];
    const voldoetAanKunstvorm =
      kunstvormFilter.length === 0 ||
      kunstvormFilter.includes(kaart.discipline);

    const dagenFilter = geselecteerdeFilters.openingsdagen || [];
    const voldoetAanDagen =
      dagenFilter.length === 0 ||
      dagenFilter.some((dag) => kaart.days?.includes(dag));

    return (
      voldoetAanZoekterm &&
      voldoetAanRolstoel &&
      voldoetAanPlaats &&
      voldoetAanKunstvorm &&
      voldoetAanDagen
    );
  });

  const sorteervolgorde = geselecteerdeFilters.sortering?.[0];
  if (sorteervolgorde === "A-Z") {
    gefilterdeKaarten = [...gefilterdeKaarten].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sorteervolgorde === "Z-A") {
    gefilterdeKaarten = [...gefilterdeKaarten].sort((a, b) => b.title.localeCompare(a.title));
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Onze Kunstenaars</h1>
        <p>Maak kennis met de creatieve geesten achter de kunstwerken.</p>
      </div>

      {fout && <p className="page-error">{fout}</p>}
      {isLaden && <p className="page-loading">Kunstenaars laden...</p>}

      <div className="filter-widget">
        <div className="zoekfilter-balk">
          <div className="zoekbalk">
            <input
              type="text"
              placeholder="Zoek een kunstenaar..."
              value={zoekterm}
              onChange={(e) => setZoekterm(e.target.value)}
            />
          </div>

          <FilterBalk
            geselecteerdeFilters={geselecteerdeFilters}
            bijFilterWijziging={setGeselecteerdeFilters}
            filterOpties={filterOpties}
          />
        </div>
      </div>

      <div className="card-grid">
        {!isLaden && gefilterdeKaarten.length > 0 ? (
          gefilterdeKaarten.map((kaart) => <Card key={kaart.link} {...kaart} />)
        ) : (
          !isLaden && <p>Geen kunstenaars gevonden met de geselecteerde filters.</p>
        )}
      </div>
    </div>
  );
}