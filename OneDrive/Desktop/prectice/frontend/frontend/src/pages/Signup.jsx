import React, { useState } from 'react';
import './Signup.css';
import avatar from '../assets/avatar.svg';
import wave from '../assets/wave.png';
import bg from '../assets/bg.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [form, setForm] = useState({
    realName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:3500/api/auth/register', form);
      
      // Store token & user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success('Registration successful! Redirecting...', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate after toast completes
      setTimeout(() => {
        navigate('/signin');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
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
      
      <div className="signup-left">
        <img className="wave-img" src={wave} alt="wave background" />
        <div className="bg-graphic">
          <img src={bg} alt="background illustration" />
        </div>
      </div>

      <div className="signup-right">
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="avatar-wrapper">
            <img src={avatar} className="avatar-icon" alt="avatar" />
          </div>
          <h2>Sign Up</h2>

          <div className="form-group">
            <input
              name="realName"
              required
              value={form.realName}
              onChange={handleChange}
            />
            <label>Full Name</label>
          </div>

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

          <button 
            type="submit" 
            className="btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p>Already have an account? <Link to="/signin">Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;