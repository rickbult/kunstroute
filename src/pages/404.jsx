import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./404.css";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(6);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const countdownText =
    secondsLeft === 0
      ? "Je wordt nu omgeleid..."
      : `Je wordt daarom binnen ${secondsLeft} ${
          secondsLeft === 1 ? "seconde" : "seconden"
        } omgeleid naar de homepagina.`;

  return (
    <section>
      <h1>We weten niet wat je zocht,</h1>
      <h1>maar we konden het niet voor je vinden...</h1>
      <h2>{countdownText}</h2>
      <p>
        Klik <Link to="/">hier</Link> als er niets gebeurt.
      </p>
    </section>
  );
}
