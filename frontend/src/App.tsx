import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ApplicationPage from './pages/ApplicationPage';
import ApplicationEditPage from './pages/ApplicationEditPage';
import ResourcePage from './pages/ResourcePage';
import JobHuntAppBar from './components/JobHuntAppBar';
import InteractionPage from './pages/InteractionPage';
import InteractionEditPage from './pages/InteractionEditPage';

const App = () => {
  return (
    <Router>
      <JobHuntAppBar />
      <Routes>
        <Route path="/" element={<ResourcePage />} />
        <Route path="/applications" element={<ApplicationPage />} />
        <Route path="/applications/edit" element={<ApplicationEditPage />} />
        <Route path="/applications/interactions" element={<InteractionPage />} />
        <Route path="/applications/interactions/edit" element={<InteractionEditPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
