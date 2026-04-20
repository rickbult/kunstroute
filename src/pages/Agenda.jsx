import React, { useState } from "react";
import "./Agenda.css";

const MONTH_NAMES = [
  "Januari","Februari","Maart","April","Mei","Juni",
  "Juli","Augustus","September","Oktober","November","December",
];
const DAY_NAMES = ["Ma","Di","Wo","Do","Vr","Za","Zo"];

const events = [
  { date: "2026-02-21", type: "deadline", title: "Inschrijven voor deelname 2026", desc: "Deadline voor kunstenaars om zich in te schrijven voor de Kunstroute 2026.", time: null, location: null },
  { date: "2026-02-28", type: "deadline", title: "Betaling inschrijfgeld", desc: "Deadline voor betaling van het inschrijfgeld.", time: null, location: null },
  { date: "2026-03-15", type: "deadline", title: "Ballotage", desc: "3 jaar of langer of mooi meegedaan - maart is de ballotage maand.", time: null, location: null },
  { date: "2026-03-28", type: "deadline", title: "Aanleveren kunstwerk en bezoekadres", desc: "Deadline voor het aanleveren van gegraveerd kunstwerk en bezoekadres.", time: null, location: null },
  { date: "2026-06-06", type: "deadline", title: "Tasje ophalen met flyers, posters en boekjes", desc: "Ophalen van promotiemateriaal: flyers (10), posters (2) en boekjes (10). Deelnemers 1e weekend bij Hans en Teunis Bastaan, deelnemers 2e weekend bij Gerda van 't Goor.", time: "10:00 – 12:00", location: "Wolfhuisweg 320, Wezep / Martinius Nijhoffstraat 9, Harderwijk" },
  { date: "2026-06-06", type: "deadline", title: "Vlag en/of Beachflag ophalen (1e weekend)", desc: "Ophalen van vlaggen en beachflags voor het eerste weekend bij Hans en Teunis Bastaan.", time: "10:00 – 12:00", location: "Wolfhuisweg 320, 8091 EB Wezep" },
  { date: "2026-08-17", type: "deadline", title: "Extra materiaal uitdelen aan VVV", desc: "Tasje met flyers (50), posters (2) en boekjes (2) uitdelen aan VVV. Niet eerder om niet te laten verspreiden.", time: null, location: null },
  { date: "2026-09-05", type: "kunstroute", title: "Kunstroute Eerste Weekend - Zaterdag", desc: "Ateliers open in Elspeet, Hulshorst, Nunspeet, Vierhouten en Wezep", time: "11:00 – 17:00", location: "Elspeet, Hulshorst, Nunspeet, Vierhouten, Wezep" },
  { date: "2026-09-06", type: "kunstroute", title: "Kunstroute Eerste Weekend - Zondag", desc: "Ateliers open in Elspeet, Hulshorst, Nunspeet, Vierhouten en Wezep", time: "11:00 – 17:00", location: "Elspeet, Hulshorst, Nunspeet, Vierhouten, Wezep" },
  { date: "2026-09-12", type: "deadline", title: "Vlag/Beachflag 1e weekend terugbrengen", desc: "Terugbrengen van vlaggen en beachflags naar Gerda van 't Goor.", time: "09:00 – 11:00", location: "Martinius Nijhoffstraat 9, 3845 LM Harderwijk" },
  { date: "2026-09-12", type: "deadline", title: "Vlag/Beachflag 2e weekend ophalen", desc: "Ophalen van vlaggen en beachflags bij Gerda van 't Goor.", time: "12:00 – 14:00", location: "Martinius Nijhoffstraat 9, 3845 LM Harderwijk" },
  { date: "2026-09-19", type: "kunstroute", title: "Kunstroute Tweede Weekend - Zaterdag", desc: "Ateliers open in Ermelo en Harderwijk.", time: "11:00 – 17:00", location: "Ermelo, Harderwijk" },
  { date: "2026-09-20", type: "kunstroute", title: "Kunstroute Tweede Weekend - Zondag", desc: "Ateliers open in Ermelo en Harderwijk.", time: "11:00 – 17:00", location: "Ermelo, Harderwijk" },
  { date: "2026-09-26", type: "deadline", title: "Vlag/Beachflag 2e weekend terugbrengen", desc: "Terugbrengen van vlaggen en beachflags naar Gerda van 't Goor.", time: "09:00 – 11:00", location: "Martinius Nijhoffstraat 9, 3845 LM Harderwijk" },
  { date: "2026-09-26", type: "deadline", title: "Enquête invullen", desc: "Deadline voor het invullen van het evaluatieformulier om de kunstroute te verbeteren.", time: null, location: null },
];

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1; 
};

const NL_DAYS  = ["zo","ma","di","wo","do","vr","za"];
const NL_MONTHS = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];

const fmtEventDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${NL_DAYS[date.getDay()]} ${d} ${NL_MONTHS[m - 1]}`;
};

export const AgendaPage = () => {
  const [year, setYear]   = useState(2026);
  const [month, setMonth] = useState(8); 
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  const prevMonth = () => {
    setSelectedDateKey(null);
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const getDateKey = (day) => (
    `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
  );
  const nextMonth = () => {
    setSelectedDateKey(null);
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const getDayEvents = (day) => {
    const key = getDateKey(day);
    return events.filter(e => e.date === key);
  };
  const selectedEvents = selectedDateKey
    ? events.filter(e => e.date === selectedDateKey)
    : [];
  const remainingEvents = selectedDateKey
    ? events.filter(e => e.date !== selectedDateKey)
    : events;

  const allCells = [];
  const firstDay = getFirstDayOfMonth(year, month);
  for (let i = 0; i < firstDay; i++) allCells.push(null);
  for (let d = 1; d <= getDaysInMonth(year, month); d++) allCells.push(d);
  const renderEventCard = (evt, key, extraClass = "") => (
    <div key={key} className={`event-card ${extraClass}`.trim()}>
      <div className="event-card-top">
        <span className={`event-badge badge-${evt.type}`}>
          {evt.type === "kunstroute" ? "KUNSTROUTE" : "BELANGRIJK"}
        </span>
        <span className="event-card-date">{fmtEventDate(evt.date)}</span>
      </div>
      <p className="event-card-title">{evt.title}</p>
      <p className="event-card-desc">{evt.desc}</p>
      {(evt.time || evt.location) && (
        <div className="event-card-meta">
          {evt.time && (
            <span className="event-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {evt.time}
            </span>
          )}
          {evt.location && (
            <span className="event-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {evt.location}
            </span>
          )}
        </div>
      )}
    </div>
  );


  return (
    <div className="agenda-page">
      <div className="agenda-main-column">

        <div className="agenda-calendar-card">
          <div className="cal-header">
            <h2 className="cal-title">{MONTH_NAMES[month]} {year}</h2>
            <div className="cal-nav">
              <button onClick={prevMonth} aria-label="Vorige maand">‹</button>
              <button onClick={nextMonth} aria-label="Volgende maand">›</button>
            </div>
          </div>
          <div className="cal-grid">
            {DAY_NAMES.map(d => (
              <div key={d} className="cal-day-name">{d}</div>
            ))}
            {allCells.map((day, i) => {
              if (!day) return <div key={`e${i}`} className="cal-cell" />;
              const dayEvts = getDayEvents(day);
              const dayKey = getDateKey(day);
              const isClickable = dayEvts.length > 0;
              const isSelectedDay = dayKey === selectedDateKey;
              const hasKunstroute = dayEvts.some(e => e.type === "kunstroute");
              const hasDeadline = dayEvts.some(e => e.type === "deadline");
              const cls = hasKunstroute ? "day-kunstroute" : hasDeadline ? "day-deadline" : "";
              return (
                <button
                  key={day}
                  type="button"
                  className={`cal-cell cal-day ${cls} ${isClickable ? "day-clickable" : ""} ${isSelectedDay ? "day-selected" : ""}`.trim()}
                  onClick={() => {
                    if (!isClickable) return;
                    setSelectedDateKey(prev => (prev === dayKey ? null : dayKey));
                  }}
                  aria-label={`Dag ${day} ${MONTH_NAMES[month]} ${year}${isClickable ? ", met bericht(en)" : ""}`}
                  disabled={!isClickable}
                >
                  <span className="day-num">{day}</span>
                  {dayEvts.length > 1 && <span className="day-count">{dayEvts.length}</span>}
                  {hasDeadline && <span className="day-dots">••</span>}
                </button>
              );
            })}
          </div>
          <div className="cal-legend">
            <span className="legend-item">
              <span className="legend-dot green" /> Kunstroute
            </span>
            <span className="legend-item">
              <span className="legend-dot blue" /> Deadline/Belangrijk
            </span>
          </div>
        </div>

        <div className="agenda-info-card">
          <h2 className="info-card-title">
            <span className="info-icon">ℹ</span> Over de Kunstroute
          </h2>
          <p className="info-card-body">
            De Kunstroute Noordwest Veluwe is een jaarlijks terugkerend evenement waarbij
            kunstliefhebbers de kans krijgen om een kijkje te nemen in de ateliers van lokale
            kunstenaars.
          </p>
          <p className="info-card-detail">
            <strong>Eerste weekend:</strong> 5 &amp; 6 september 2026<br />
            Locaties: Elspeet, Hulshorst, Nunspeet, Vierhouten, Wezep
          </p>
          <p className="info-card-detail">
            <strong>Tweede weekend:</strong> 19 &amp; 20 september 2026<br />
            Locaties: Ermelo, Harderwijk
          </p>
          <div className="info-card-row">
            <div>
              <strong>Openingstijden</strong>
              <p>Zaterdag &amp; Zondag: 11:00 – 17:00</p>
              <p className="info-note">Check per kunstenaar de specifieke openingstijden.</p>
            </div>
          </div>
          <div className="info-card-row">
            <div>
              <strong>Startpunten</strong>
              <p>
                U kunt op elk willekeurig punt starten. Download de routekaart of gebruik de
                interactieve kaart op deze website.
              </p>
            </div>
          </div>
        </div>
      </div>

      <aside className="agenda-side-panel">
        <div className="agenda-events-card">
          <div className="events-panel-header">
            <h3 className="events-panel-title">Berichten </h3>
            <p className="events-panel-subtitle">Deadlines & Kunstroute datums</p>
          </div>
          {selectedEvents.length > 0 && (
            <div className="selected-events-section">
              <div className="selected-events-header">
                <p className="selected-events-label">
                  Geselecteerd: {fmtEventDate(selectedDateKey)}
                </p>
                <button
                  type="button"
                  className="selected-events-clear"
                  onClick={() => setSelectedDateKey(null)}
                >
                  Wissen
                </button>
              </div>
              <div className="selected-events-list">
                {selectedEvents.map((evt, i) =>
                  renderEventCard(evt, `selected-${i}`, "event-card-selected")
                )}
              </div>
            </div>
          )}
          <div className="events-list">
            {remainingEvents.map((evt, i) => renderEventCard(evt, `remaining-${i}`))}
          </div>
        </div>
      </aside>
    </div>
  );
};
