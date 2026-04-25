import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaWheelchair } from "react-icons/fa";
import "./filter.css";

export const FilterBalk = ({
  bijFilterWijziging,
  geselecteerdeFilters = {},
  filterOpties = {}
}) => {
  const [openKeuzemenu, setOpenKeuzemenu] = useState(null);
  const [toonExtraFilters, setToonExtraFilters] = useState(false);
  const [keuzemenuPositie, setKeuzemenuPositie] = useState({ top: 0, left: 0 });
  const [extraVensterLinks, setExtraVensterLinks] = useState(0);
  const rijRef = useRef(null);
  const knopRefs = useRef({});
  const filtergebiedRef = useRef(null);
  const extraFiltersKnopRef = useRef(null);
  const extraVensterRef = useRef(null);

  const handleFilterknopWissel = (filterSoort, binnenExtraFilters = false) => {
    setOpenKeuzemenu((vorige) => (vorige === filterSoort ? null : filterSoort));

    if (!binnenExtraFilters) {
      setToonExtraFilters(false);
    }
  };

  const verwerkKeuzemenuVerlaten = () => {
    setOpenKeuzemenu(null);

    if (
      toonExtraFilters &&
      extraVensterRef.current &&
      !extraVensterRef.current.matches(":hover")
    ) {
      setToonExtraFilters(false);
    }
  };

  const verwerkExtraVensterVerlaten = (event) => {
    const volgendDoel = event.relatedTarget;

    if (volgendDoel instanceof Element && volgendDoel.closest(".filter-keuzemenu")) {
      return;
    }

    setToonExtraFilters(false);
    setOpenKeuzemenu(null);
  };

  useEffect(() => {
    const verwerkKlikBuiten = (event) => {
      if (rijRef.current && !rijRef.current.contains(event.target)) {
        setOpenKeuzemenu(null);
      }
    };
    document.addEventListener("mousedown", verwerkKlikBuiten);
    return () => document.removeEventListener("mousedown", verwerkKlikBuiten);
  }, []);

  const werkKeuzemenuPositieBij = useCallback((filterSoort) => {
    const knop = knopRefs.current[filterSoort];
    if (!knop) {
      return;
    }

    const rechthoek = knop.getBoundingClientRect();
    const minBreedteKeuzemenu = 220;
    const minVensterLinks = 12;
    const maxVensterLinks = Math.max(minVensterLinks, window.innerWidth - minBreedteKeuzemenu - 12);
    const gecentreerdLinks = rechthoek.left + (rechthoek.width / 2) - (minBreedteKeuzemenu / 2);
    const links = Math.max(minVensterLinks, Math.min(gecentreerdLinks, maxVensterLinks));

    setKeuzemenuPositie({
      top: rechthoek.bottom + 10,
      left: links,
    });
  }, []);

  const werkExtraVensterPositieBij = useCallback(() => {
    if (!extraFiltersKnopRef.current || !extraVensterRef.current || !filtergebiedRef.current) {
      return;
    }

    const knopRechthoek = extraFiltersKnopRef.current.getBoundingClientRect();
    const vensterRechthoek = extraVensterRef.current.getBoundingClientRect();
    const gebiedRechthoek = filtergebiedRef.current.getBoundingClientRect();
    const minVensterLinks = 12;
    const maxVensterLinks = Math.max(minVensterLinks, window.innerWidth - vensterRechthoek.width - 12);
    const gecentreerdLinks = knopRechthoek.left + (knopRechthoek.width / 2) - (vensterRechthoek.width / 2);
    const vensterLinks = Math.max(minVensterLinks, Math.min(gecentreerdLinks, maxVensterLinks));
    const relatiefLinks = vensterLinks - gebiedRechthoek.left;

    setExtraVensterLinks(relatiefLinks);
  }, []);

  useEffect(() => {
    if (openKeuzemenu) {
      werkKeuzemenuPositieBij(openKeuzemenu);
    }
  }, [openKeuzemenu, werkKeuzemenuPositieBij]);

  useEffect(() => {
    if (!openKeuzemenu) {
      return;
    }

    const verwerkHerpositioneren = () => werkKeuzemenuPositieBij(openKeuzemenu);
    window.addEventListener("resize", verwerkHerpositioneren);
    window.addEventListener("scroll", verwerkHerpositioneren, true);

    return () => {
      window.removeEventListener("resize", verwerkHerpositioneren);
      window.removeEventListener("scroll", verwerkHerpositioneren, true);
    };
  }, [openKeuzemenu, werkKeuzemenuPositieBij]);

  useEffect(() => {
    if (!toonExtraFilters) {
      return;
    }

    werkExtraVensterPositieBij();
    const verwerkVensterHerpositioneren = () => werkExtraVensterPositieBij();
    window.addEventListener("resize", verwerkVensterHerpositioneren);
    window.addEventListener("scroll", verwerkVensterHerpositioneren, true);

    return () => {
      window.removeEventListener("resize", verwerkVensterHerpositioneren);
      window.removeEventListener("scroll", verwerkVensterHerpositioneren, true);
    };
  }, [toonExtraFilters, werkExtraVensterPositieBij]);

  const verwerkCheckboxWijziging = (filterSoort, waarde) => {
    const huidigeWaarden = geselecteerdeFilters[filterSoort] || [];

    let bijgewerkteWaarden;
    if (huidigeWaarden.includes(waarde)) {
      bijgewerkteWaarden = huidigeWaarden.filter((v) => v !== waarde);
    } else {
      bijgewerkteWaarden = [...huidigeWaarden, waarde];
    }

    bijFilterWijziging({
      ...geselecteerdeFilters,
      [filterSoort]: bijgewerkteWaarden,
    });
  };

  const verwerkRadioWijziging = (filterSoort, waarde) => {
    bijFilterWijziging({
      ...geselecteerdeFilters,
      [filterSoort]: [waarde],
    });
  };

  const verwerkSorteercyclus = () => {
    const huidigeSortering = geselecteerdeFilters.sortering?.[0];

    let volgendeSortering = [];
    if (!huidigeSortering) {
      volgendeSortering = ["A-Z"];
    } else if (huidigeSortering === "A-Z") {
      volgendeSortering = ["Z-A"];
    }

    bijFilterWijziging({
      ...geselecteerdeFilters,
      sortering: volgendeSortering,
    });
  };

  const isAangevinkt = (filterSoort, waarde) => {
    return (geselecteerdeFilters[filterSoort] || []).includes(waarde);
  };

  const {
    plaatsen = [],
    kunstvormen = [],
    rolstoelNiveaus = [],
    openingsdagen = [],
  } = filterOpties;

  const huidigeSortering = geselecteerdeFilters.sortering?.[0];
  const sorteerLabel = huidigeSortering === "Z-A" ? "Z-A" : "A-Z";
  const sorteringActief = Boolean(huidigeSortering);
  const sorteerStatusIcoon = huidigeSortering === "A-Z" ? "▼" : huidigeSortering === "Z-A" ? "▲" : "";

  const FilterKnop = ({ label, filterSoort, opties, isRadio = false, binnenExtraFilters = false }) => {
    const isGeopend = openKeuzemenu === filterSoort;
    const heeftSelecties = (geselecteerdeFilters[filterSoort] || []).length > 0;

    return (
      <div className="filterknop-omhulsel">
        <button
          ref={(el) => {
            knopRefs.current[filterSoort] = el;
          }}
          className={`filterknop ${heeftSelecties ? "actief" : ""}`}
          onClick={() => handleFilterknopWissel(filterSoort, binnenExtraFilters)}
        >
          {label}
          <span className="uitklap-icoon">▼</span>
        </button>

        {isGeopend && (
          <div
            className="filter-keuzemenu"
            onMouseLeave={verwerkKeuzemenuVerlaten}
            style={{
              top: `${keuzemenuPositie.top}px`,
              left: `${keuzemenuPositie.left}px`,
            }}
          >
            {opties.map((optie) => (
              <label key={optie} className="filteroptie">
                <input
                  type={isRadio ? "radio" : "checkbox"}
                  name={isRadio ? filterSoort : undefined}
                  checked={isAangevinkt(filterSoort, optie)}
                  onChange={() =>
                    isRadio
                      ? verwerkRadioWijziging(filterSoort, optie)
                      : verwerkCheckboxWijziging(filterSoort, optie)
                  }
                />
                <span>{optie}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filtergebied" ref={filtergebiedRef}>
      <div className="filterknoppen-rij" ref={rijRef}>
        <div className="filterknop-omhulsel">
          <button
            className={`filterknop ${sorteringActief ? "actief" : ""}`}
            onClick={verwerkSorteercyclus}
            aria-pressed={sorteringActief}
          >
            {sorteerLabel}
            {sorteerStatusIcoon && (
              <span className="uitklap-icoon sorteer-icoon-status">{sorteerStatusIcoon}</span>
            )}
          </button>
        </div>

        <FilterKnop
          label="Open Op"
          filterSoort="openingsdagen"
          opties={openingsdagen}
        />

        <FilterKnop
          label={
            <span className="filterlabel-met-icoon">
              <FaWheelchair aria-hidden="true" className="rolstoel-icoon" />
              <span>-Toegankelijkheid</span>
            </span>
          }
          filterSoort="rolstoelToegang"
          opties={rolstoelNiveaus}
        />

        <button
          ref={extraFiltersKnopRef}
          className={`extra-filters-knop ${toonExtraFilters ? "actief" : ""}`}
          onClick={() => {
            setOpenKeuzemenu(null);
            setToonExtraFilters((vorige) => !vorige);
          }}
        >
          Andere filters
          <span className="wissel-icoon">{toonExtraFilters ? "▲" : "▼"}</span>
        </button>
      </div>

      {toonExtraFilters && (
        <div
          className="extra-filters-venster"
          ref={extraVensterRef}
          onMouseLeave={verwerkExtraVensterVerlaten}
          style={{
            left: `${extraVensterLinks}px`,
          }}
        >
          <div className="extra-filters-inhoud">
            <FilterKnop
              label="Kunstvorm"
              filterSoort="kunstvorm"
              opties={kunstvormen}
              binnenExtraFilters={true}
            />

            <FilterKnop
              label="Plaats"
              filterSoort="plaats"
              opties={plaatsen}
              binnenExtraFilters={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
