import Toolbar from './components/Toolbar/Toolbar';
import Visualizer from './components/Visualizer/Visualizer';
import './App.css';

function App() {
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