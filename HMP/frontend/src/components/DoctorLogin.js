import React, { useState } from 'react';
import axios from 'axios';
import './styles/DoctorLogin.css'; 
import ECGAnimation from './ECGAnimation';
import { FaSignInAlt } from 'react-icons/fa'; 
import { Helmet } from 'react-helmet';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/doctors/dlogin', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('doctorEmail', email); 
      window.location.href = '/doctor-account'; 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="doctor-login-container">
       <Helmet>
        <title>Doctor Portal Page</title>
      </Helmet>
      <h2>Doctor Portal</h2>
      <p className="doctor-login-quote">
        "The art of medicine consists of amusing the patient while nature cures the disease." - Voltaire
      </p>
      <form className="doctor-login-form" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <button type="submit" className="doctor-login-button">
          { <FaSignInAlt />} 
        </button>
      </form>
      {error && <p className="doctor-login-error-message">{error}</p>}
      {loading && <ECGAnimation />}
      <p className="doctor-login-signup-prompt">
        Don't have an account? <a href="/doctor-signup" className="doctor-login-signup-link">Create one here</a>
      </p>
    </div>
  );
};

export default DoctorLogin;
