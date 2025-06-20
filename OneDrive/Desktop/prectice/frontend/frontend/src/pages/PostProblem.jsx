import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './PostProblem.css';
import axios from 'axios';

function PostProblem() {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState('');
  const [otherText, setOtherText] = useState('');
  const [groups, setGroups] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const anonymousName = user?.anonymousName || 'Anonymous';

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get('http://localhost:3500/api/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data.groups);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };
    fetchGroups();
  }, [token]);

  const createGroup = async (topic) => {
    try {
      const res = await axios.post(
        'http://localhost:3500/api/groups/create',
        { topic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const groupId = res.data.group?.id || res.data._id;
      navigate('/groupchat', { state: { groupId } });
    } catch (error) {
      console.error('Group creation failed:', error);
      alert('Failed to create group. Try again.');
    }
  };

  const handleProblemChange = (e) => {
    const value = e.target.value;
    setSelectedProblem(value);
    if (value && value !== 'others') createGroup(value);
  };

  const handleTextareaSubmit = () => {
    if (otherText.trim()) createGroup(otherText.trim());
  };

  const handleJoinGroup = (groupId) => {
    navigate('/groupchat', { state: { groupId } });
  };
const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.clear();
    navigate('/signin');
  }
};

  return (
    <div className="post-container">
      <button className="logout-button" onClick={handleLogout}>
        🔒 Logout
      </button>

      <h1 className="header-title">Am I the only one?</h1>

      <div className="left-content">
        <div className="welcome-text">
          Welcome, <span>👤 {anonymousName}</span>
        </div>

        <div className="problem-box">
          <label htmlFor="problemSelect">Select your problem</label>
          <select
            id="problemSelect"
            className="form-select"
            value={selectedProblem}
            onChange={handleProblemChange}
          >
            <option value="">-- Choose a problem --</option>
            <option value="depression">Depression</option>
            <option value="anxiety">Anxiety</option>
            <option value="overthinking">Overthinking</option>
            <option value="others">Others</option>
          </select>

          {selectedProblem === 'others' && (
            <>
              <textarea
                className="form-control mt-3"
                placeholder="Write about your problem..."
                rows="4"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
              ></textarea>
              <button className="btn" onClick={handleTextareaSubmit}>
                Submit 🚀
              </button>
            </>
          )}
        </div>
      </div>

      <div className="right-content">
        <h2>Existing Group Discussions</h2>
        {groups.length === 0 ? (
          <p>No groups available yet.</p>
        ) : (
          <ul className="groups-list">
            {groups.map((group) => (
              <li key={group._id} className="group-item">
                <div className="group-topic">{group.topic}</div>
                <div className="group-date">
                  Created: {new Date(group.createdAt).toLocaleString()}
                </div>
                <button onClick={() => handleJoinGroup(group._id)} className="btn join-btn">
                  Join Chat 💬
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PostProblem;
