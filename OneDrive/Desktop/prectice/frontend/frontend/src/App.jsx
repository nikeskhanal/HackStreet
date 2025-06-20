import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import PostProblem from './pages/PostProblem';
import Chat from './pages/Chat';
import GroupChat from './pages/GroupChat';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/post" element={<PostProblem />} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/groupchat" element={<GroupChat/>} />
        <Route path="/admin" element={<AdminPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
