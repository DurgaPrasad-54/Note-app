import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './logreg.css'

const Forgetpass = () => {
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();

  const [email, setEmail] = useState({
    email: ''
  });

  const [msg, setMsg] = useState({
    type: '',
    text: ''
  });

  function handleinp(event) {
    const { name, value } = event.target;
    setEmail(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handlesub(e) {
    e.preventDefault();
    fetch(`${API_PATH}/sendotp`, {
      method: 'PUT',
      body: JSON.stringify(email),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setMsg({ type: 'success', text: data.message });
          setTimeout(() => {
            navigate('/newpassword');
          }, 2000);
        } else {
          setMsg({ type: 'error', text:data.message});
        }
      })
      .catch(err => {
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
            value={email.email}
            onChange={handleinp}
            required
          />
          <button className='btn' type="submit">Send OTP</button>
        </form>
        <h1 className={msg.type === 'success' ? 'success' : msg.type === 'error' ? 'error' : ''}>
          {msg.text}
        </h1>
      </div>
    </div>
  );
};

export default Forgetpass;
