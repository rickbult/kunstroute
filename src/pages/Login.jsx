// DIT IS AI GEGENEREERD!!!!!!!!!!!!;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../pages/login.css';  // Je login.css

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);  // Sla token op
      setMessage('✅ Login succes! Token opgeslagen.');
      console.log('TEST TOKEN:', res.data.token);
      // Reset form
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage('❌ Fout: ' + (err.response?.data?.error || 'Probeer opnieuw'));
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Kunstroute Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Inloggen</button>
      </form>
      {message && <p className={message.startsWith('✅') ? 'success' : 'error'}>{message}</p>}
      
      <div className="signup-link">
        <Link to="/signup">👉 Nog geen account? Registreer hier</Link>
      </div>
      
      <p>Test met backend credentials (MongoDB).</p>
    </div>
  );
};

export default Login;