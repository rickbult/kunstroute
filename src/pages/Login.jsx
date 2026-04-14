import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import kunstrouteLogo from "../assets/kunstroutelogo.png";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/profile");
  }, [navigate]);

  async function handleInloggen(e) {
    e.preventDefault();
    setFout("");

    if (!email.trim() || !wachtwoord.trim()) {
      setFout("Vul je e-mailadres en wachtwoord in.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: wachtwoord,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFout(data.error || "Inloggen mislukt.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setFout("Serverfout, probeer later opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg">
      <main className="login-main">
        <div className="login-card">
          <img
            src={kunstrouteLogo}
            alt="Kunstroute Noordwest Veluwe"
            className="login-logo"
          />

          <h1 className="login-heading">Inloggen</h1>
          <p className="login-subtitle">
            met je Kunstroute account om door te gaan
          </p>

          <form onSubmit={handleInloggen} noValidate>
            <div className="floating-group">
              <input
                id="login-email"
                type="email"
                className={`floating-input${fout ? " has-error" : ""}`}
                placeholder=" "
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFout("");
                }}
                autoComplete="email"
                autoFocus
              />
              <label htmlFor="login-email" className="floating-label">
                E-mailadres
              </label>
            </div>

            <div className="floating-group">
              <input
                id="login-wachtwoord"
                type="password"
                className={`floating-input${fout ? " has-error" : ""}`}
                placeholder=" "
                value={wachtwoord}
                onChange={(e) => {
                  setWachtwoord(e.target.value);
                  setFout("");
                }}
                autoComplete="current-password"
              />
              <label htmlFor="login-wachtwoord" className="floating-label">
                Wachtwoord
              </label>
            </div>

            {fout && <p className="login-fout">{fout}</p>}

            <div className="login-actions">
              <button
                type="button"
                className="login-btn-sec"
                onClick={() => navigate("/register")}
              >
                Account maken
              </button>

              <button
                type="submit"
                className="login-btn-prim"
                disabled={loading}
              >
                {loading ? "Bezig..." : "Inloggen"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}