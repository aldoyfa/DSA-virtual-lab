import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth/Auth';
import TopicSelector from './components/TopicSelector/TopicSelector';
import Toolbar from './components/Toolbar/Toolbar';
import Visualizer from './components/Visualizer/Visualizer';
import AlphaBeta from './components/AlphaBeta/AlphaBeta';
import './App.css';

function App() {
  const { isAuthenticated, loading, login, register } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Reset topic when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedTopic(null);
    }
  }, [isAuthenticated]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={login} onRegister={register} />;
  }

  // Always show topic selector first if no topic selected
  if (!selectedTopic) {
    return <TopicSelector onSelectTopic={handleTopicSelect} />;
  }

  // Render based on selected topic
  if (selectedTopic === 'alphabeta') {
    return <AlphaBeta onChangeTopic={() => setSelectedTopic(null)} />;
  }

  // Default to sorting visualizer
  return (
    <div className="app">
      <div className="app__content">
        <Toolbar />
        <Visualizer />
      </div>
    </div>
  );
}

export default App;