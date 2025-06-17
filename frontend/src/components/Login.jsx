import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './logreg.css';

const Login = () => {
  const API_PATH = import.meta.env.VITE_API_PATH;  
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false); 

  function handleinp(event) {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  function handlesub(e) {
    e.preventDefault();
    setLoading(true); 

    fetch(`${API_PATH}/login`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false); // ✅ Stop loading
        if (data.Token) {
          localStorage.setItem('Token', data.Token);
          // setMsg({ type: 'success', text: 'Login successful!' });
          setTimeout(() => {
            navigate('/note');
          }, 1000);
        } else {
          setMsg({ type: 'error', text: data.message });
        }
      })
      .catch((err) => {
        setLoading(false); // ✅ Stop loading on error
        setMsg({ type: 'error', text: err.message });
      });
    
  }

  return (
    <div className="main">
      <div className="inner">
        <form className="form" onSubmit={handlesub}>
          <input
            className="inp"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={handleinp}
            required
          />
          <input
            className="inp"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={data.password}
            onChange={handleinp}
            required
          />
          <Link to="/forgetpassword" className='Forget'>Forget password ?</Link>
          

          <button className="btn" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner"></span>}
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>

          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>

        <h1 className={msg.type === 'success' ? 'success' : msg.type === 'error' ? 'error' : ''}>
          {msg.text}
        </h1>
      </div>
    </div>
  );
};

export default Login;
