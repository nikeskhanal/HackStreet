import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [groups, setGroups] = useState([]);
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:3500/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data.groups);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:3500/api/groups/create',
        { topic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/groupchat', { state: { groupId: res.data.group.id } });
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:3500/api/groups/join/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/groupchat', { state: { groupId } });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join group');
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      padding: '30px',
      background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
      fontFamily: 'Arial, sans-serif',
    },
    container: {
      maxWidth: '700px',
      margin: 'auto',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    backButton: {
      marginBottom: '20px',
      padding: '10px 16px',
      backgroundColor: '#3f51b5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    heading: {
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#3f51b5',
      marginBottom: '24px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '30px',
    },
    input: {
      padding: '10px 14px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#3f51b5',
      color: 'white',
      padding: '10px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background 0.3s',
    },
    buttonHover: {
      backgroundColor: '#2c387e',
    },
    card: {
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    },
    cardTitle: {
      fontSize: '18px',
      color: '#333',
      marginBottom: '4px',
    },
    cardDate: {
      fontSize: '14px',
      color: '#888',
      marginBottom: '8px',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Home button */}
        <button
          style={styles.backButton}
          onClick={() => navigate('/post')}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#2c387e')}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.backButton.backgroundColor)}
        >
          🏠 Home
        </button>

        <h2 style={styles.heading}>Active Group Discussions</h2>

        <form onSubmit={handleCreateGroup} style={styles.form}>
          <input
            type="text"
            placeholder="Start a new discussion topic..."
            style={styles.input}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Create Group
          </button>
        </form>

        {groups.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No groups yet. Be the first to create one!</p>
        ) : (
          <div>
            {groups.map((group) => (
              <div key={group._id} style={styles.card}>
                <div style={styles.cardTitle}>{group.topic}</div>
                <div style={styles.cardDate}>
                  Created: {new Date(group.createdAt).toLocaleString()}
                </div>
                <button
                  style={{ ...styles.button, width: '100%' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                  onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                  onClick={() => handleJoinGroup(group._id)}
                >
                  Join Chat 💬
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
