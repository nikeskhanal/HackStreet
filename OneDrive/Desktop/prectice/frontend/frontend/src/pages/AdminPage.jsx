import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3500/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:3500/api/admin/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3500/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await axios.delete(`http://localhost:3500/api/admin/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(groups.filter((g) => g._id !== groupId));
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      window.location.href = "/signin"; // Redirect to login page or homepage
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Real Name</th>
                <th style={styles.th}>Anonymous Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={styles.td}>{user.realName}</td>
                  <td style={styles.td}>{user.anonymousName}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>{user.status}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Group Discussions</h2>
        {groups.length === 0 ? (
          <p>No group discussions found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {groups.map((group) => (
              <li key={group._id} style={styles.card}>
                <div>
                  <strong style={{ fontSize: "16px" }}>{group.topic}</strong>
                  <div style={styles.timestamp}>
                    Created: {new Date(group.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteGroup(group._id)}
                  style={styles.deleteBtn}
                >
                  Delete Group
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f7f9fc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    color: "#3f51b5",
    fontSize: "32px",
    margin: 0,
  },
  logoutBtn: {
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background 0.3s",
  },
  section: {
    marginTop: "30px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  subtitle: {
    color: "#333",
    marginBottom: "16px",
    fontSize: "22px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "6px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px",
    backgroundColor: "#f1f3f6",
    borderBottom: "1px solid #ddd",
    fontWeight: "600",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
  deleteBtn: {
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  timestamp: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },
};

export default AdminPage;
