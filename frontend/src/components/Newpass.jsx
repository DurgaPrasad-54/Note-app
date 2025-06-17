import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './logreg.css'

const Newpass = () => {
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();

  const [data, setData] = useState({
    otp: '',
    password:''
  });

  const [msg, setMsg] = useState({
    type: '',
    text: ''
  });

  function handleinp(event) {
    const { name, value } = event.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handlesub(e) {
    e.preventDefault();
    fetch(`${API_PATH}/verifyotp`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setMsg({ type: 'success', text: data.message });
          setTimeout(() => {
            navigate('/login');
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
            type="Number"
            name="otp"
            placeholder="Enter OTP"
            value={data.otp}
            onChange={handleinp}
            required
          />
          <input 
            className="inp"
            type="password"
            name="password"
            placeholder="Enter New Password"
            value={data.password}
            onChange={handleinp}
            required
            />
          <button className="btn" type="submit">Submit</button>
        </form>
        <h1 className={msg.type === 'success' ? 'success' : msg.type === 'error' ? 'error' : ''}>
          {msg.text}
        </h1>
      </div>
    </div>
  );
};

export default Newpass;
