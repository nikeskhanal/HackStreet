import React, { useState } from 'react';
import './Signin.css';
import wave from '../assets/wave.png';
import bg from '../assets/bg.svg';
import avatar from '../assets/avatar.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:3500/api/auth/login', form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/post');
      }
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Invalid email or password', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="signin-left">
        <img src={wave} className="wave-img" alt="Wave background" />
        <div className="bg-graphic">
          <img src={bg} alt="Person sitting on phone" />
        </div>
      </div>

      <div className="signin-right">
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="avatar-wrapper">
            <img src={avatar} className="avatar-icon" alt="Avatar" />
          </div>
          <h2>Sign In</h2>

          <div className="form-group">
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
            />
            <label>Password</label>
          </div>

          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Signin;