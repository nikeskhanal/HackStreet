import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { FiSend, FiArrowLeft, FiUser, FiClock, FiLogOut } from "react-icons/fi";

const socket = io("http://localhost:3500", { autoConnect: false });

// Generic anonymous avatar image URL (replace with your own if you want)
const anonymousAvatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const GroupChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [anonymousName, setAnonymousName] = useState("");
  const [groupTopic, setGroupTopic] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!token || !groupId) return;

    socket.auth = { token };
    socket.connect();

    const onReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("connect", () => {
      socket.emit("joinGroup", groupId);
    });

    socket.on("receiveMessage", onReceiveMessage);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3500/api/groups/${groupId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    const fetchGroupInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3500/api/groups/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroupTopic(res.data.group.topic);
      } catch (err) {
        console.error("Failed to fetch group info:", err);
      }
    };

    const getUserInfo = async () => {
      try {
        const res = await axios.get("http://localhost:3500/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnonymousName(res.data.anonymousName);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchMessages();
    fetchGroupInfo();
    getUserInfo();

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
      socket.emit("leaveGroup", groupId);
      socket.disconnect();
    };
  }, [groupId, token]);

  const handleSend = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", { groupId, text: input.trim() });
    setInput("");
    inputRef.current.focus();
  };

  const handleLeaveGroup = () => {
    socket.emit("leaveGroup", groupId);
    socket.disconnect();
    navigate("/post");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={handleLeaveGroup} style={styles.backButton}>
            <FiArrowLeft size={20} />
          </button>
          <div style={styles.headerContent}>
            <h2 style={styles.headerTitle}>{groupTopic}</h2>
          </div>
          <div style={styles.userInfo}>
            <FiUser size={18} style={styles.userIcon} />
            <span>{anonymousName}</span>
          </div>
        </div>

        <div style={styles.chatBox}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Start the conversation</p>
              <p style={styles.emptySubtext}>Be the first to send a message in this group</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isOwnMessage = msg.sender.anonymousName === anonymousName;
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.message,
                    alignSelf: isOwnMessage ? "flex-end" : "flex-start",
                    backgroundColor: isOwnMessage ? "#6c5ce7" : "#dfe6e9",
                    color: isOwnMessage ? "#fff" : "#2d3436",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {!isOwnMessage && (
                    <div style={styles.nameWithAvatar}>
                      <img
                        src={anonymousAvatarUrl}
                        alt="avatar"
                        style={styles.avatar}
                        draggable={false}
                      />
                      <span>{msg.sender.anonymousName}</span>
                    </div>
                  )}

                  <div style={styles.messageText}>{msg.text}</div>

                  <div style={styles.time}>
                    <FiClock size={12} style={styles.timeIcon} />
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <div style={styles.inputBox}>
            <textarea
              ref={inputRef}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
              rows={1}
            />
            <button onClick={handleSend} style={styles.sendButton}>
              <FiSend size={20} />
            </button>
          </div>
          <div style={styles.footer}>
            <button onClick={handleLeaveGroup} style={styles.leaveButton}>
              <FiLogOut size={16} />
              <span> Leave Group</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  page: {
    height: "100vh",
    background: "#f0f4ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    color: "#2d3436",
  },
  container: {
    width: "100%",
    maxWidth: "520px",
    height: "90vh",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#6c5ce7",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    marginRight: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: 700,
    margin: 0,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: "#dfe6e9",
    color: "#2d3436",
  },
  userIcon: {
    marginRight: "6px",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    background: "linear-gradient(to bottom right, #141E30, #243B55)",
    color: "#ffffff",
  },
  emptyState: {
    textAlign: "center",
    color: "#dfe6e9",
    marginTop: "30%",
  },
  emptyText: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "8px",
  },
  emptySubtext: {
    fontSize: "14px",
    opacity: 0.8,
  },
  message: {
    maxWidth: "85%",
    margin: "8px 0",
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "16px",
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  nameWithAvatar: {
    display: "flex",
    alignItems: "center",
    marginBottom: "4px",
    fontSize: "13px",
    fontWeight: 600,
    gap: "8px",
    color: "#2d3436",
  },
  avatar: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    objectFit: "cover",
    userSelect: "none",
  },
  messageText: {
    fontSize: "15px",
  },
  time: {
    fontSize: "11px",
    marginTop: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    opacity: 0.8,
    gap: "4px",
  },
  timeIcon: {
    marginRight: "4px",
  },
  inputContainer: {
    padding: "16px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e0e0e0",
  },
  inputBox: {
    display: "flex",
    borderRadius: "20px",
    backgroundColor: "#f1f2f6",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: "14px 20px",
    fontSize: "15px",
    border: "none",
    background: "transparent",
    resize: "none",
    outline: "none",
    color: "#2d3436",
  },
  sendButton: {
    padding: "0 20px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "12px",
  },
  leaveButton: {
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    color: "#e74c3c",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    gap: "6px",
  },
};

export default GroupChat;