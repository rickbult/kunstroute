// DIT IS AI GEGENEREERD!!!!!!!!!!!!;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });
      setMessage('✅ Account aangemaakt! Ga naar login.');
      // Reset form
      setUsername('');
      setEmail('');
      setPassword('');
      // Redirect optioneel: window.location.href = '/login';
    } catch (err) {
      setMessage('❌ Fout: ' + (err.response?.data?.error || 'Probeer opnieuw'));
    }
  };

  return (
    <div className="signup-container">
      <h2>🖼️ Kunstroute Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
      {message && <p className={message.startsWith('✅') ? 'success' : 'error'}>{message}</p>}
      
      <div className="login-link">
        <Link to="/login">👉 Heb je al een account? Login hier</Link>
      </div>
      
      <p>Test met unieke data (backend MongoDB).</p>
    </div>
  );
};

export default Signup;