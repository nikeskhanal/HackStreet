import React, { useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate=useNavigate();

  const handleJoinClick = () => {
  console.log('Join button clicked!');
  navigate('/signin');  
};

  useEffect(() => {
    // Parallax effect for background elements
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const circles = document.querySelectorAll('.circle');
      circles.forEach((circle, index) => {
        const speed = 0.05 * (index + 1);
        circle.style.transform = `translate(${x * 20 * speed}px, ${y * 20 * speed}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="home-container">
         <div className="logo">MindBridge</div>
      <div className="background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      
      <div className="content">
        <h1 className="main-heading">Am I the only one?</h1>
        
        <div className="avatar-container">
          <div className="avatar-circle">
            <div className="avatar">
              <div className="avatar-face">
                <div className="avatar-eye"></div>
                <div className="avatar-eye"></div>
              </div>
              <div className="avatar-mouth"></div>
            </div>
          </div>
        </div>
        
        <p className="slogan">Your <span className="highlight">Safe Space</span> to Speak Freely — <span className="highlight">Anonymously</span>, Anytime</p>
        
        <button className="btn" onClick={handleJoinClick}>
          Join Our Community
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
      
      <div className="features">
        <div className="feature">
          <i className="fas fa-user-secret"></i>
          <h3>Complete Anonymity</h3>
          <p>Share your thoughts without revealing your identity. Your privacy is our top priority.</p>
        </div>
        
        <div className="feature">
          <i className="fas fa-comments"></i>
          <h3>Supportive Community</h3>
          <p>Connect with others who understand your experiences. You're never alone here.</p>
        </div>
        
        <div className="feature">
          <i className="fas fa-shield-alt"></i>
          <h3>Safe Environment</h3>
          <p>Our strict moderation ensures a respectful, judgment-free space for everyone.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;