import React from "react";
import "./Info.css";

const PhoneIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.75a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const boardMembers = [
  {
    name: "Teunie Bastiaan",
    role: "Voorzitter",
    photo: "",
    phone: "0619 93 58 77",
    email: "voorzitter@kunstroute-noordwest-veluwe.nl",
  },
  {
    name: "Hans Bastiaan",
    role: "Penningmeester",
    photo: "",
    phone: "0610 91 97 45",
    email: "penningmeester@kunstroute-noordwest-veluwe.nl",
  },
  {
    name: "Gerda van 't Goor",
    role: "Secretaris",
    photo: "",
    phone: "0629 19 09 18",
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

const normalizePhone = (phone) => phone.replace(/\s|–/g, "");

const InfoPage = () => {
  return (
    <div className="info-page-layout">
      <aside className="info-sidebar">
        <p className="sidebar-heading">OVER DE KUNSTROUTE</p>
        <nav aria-label="Over de kunstroute">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="sidebar-link">
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="info-wrapper">
        <section id="bestuur" className="info-section bestuur">
          <h2 className="bestuur-title">Het bestuur</h2>
          <div className="bestuur-grid">
            {boardMembers.map((member) => (
              <div key={member.name} className="bestuur-card">
                <p className="bestuur-name">{member.name}</p>
                <p className="bestuur-role">{member.role}</p>

                <div className="bestuur-photo">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} />
                  ) : (
                    <div className="bestuur-photo-placeholder" aria-hidden="true">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="bestuur-contact">
                  <div className="contact-row">
                    <span className="contact-badge">
                      <PhoneIcon />
                    </span>
                    <a href={`tel:${normalizePhone(member.phone)}`}>
                      {member.phone}
                    </a>
                  </div>

                  <div className="contact-row">
                    <span className="contact-badge">
                      <EmailIcon />
                    </span>
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfoPage;