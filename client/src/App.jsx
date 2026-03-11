import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { VisualizerProvider } from './contexts/VisualizerContext';
import Auth from './components/Auth/Auth';
import TopicSelector from './components/TopicSelector/TopicSelector';
import Toolbar from './components/Toolbar/Toolbar';
import Visualizer from './components/Visualizer/Visualizer';
import AlphaBeta from './components/AlphaBeta/AlphaBeta';
import './App.css';

function App() {
  const { isAuthenticated, loading, login, register } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedTopic(null);
    }
  }, [isAuthenticated]);

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

  if (!selectedTopic) {
    return <TopicSelector onSelectTopic={setSelectedTopic} />;
  }

  if (selectedTopic === 'alphabeta') {
    return <AlphaBeta onChangeTopic={() => setSelectedTopic(null)} />;
  }

  return (
    <div className="app">
      <div className="app__content">
        <VisualizerProvider>
          <Toolbar onChangeTopic={() => setSelectedTopic(null)} />
          <Visualizer />
        </VisualizerProvider>
      </div>
    </div>
  );
}

export default App;