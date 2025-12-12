import { useAuth } from '../../contexts/AuthContext';
import './AlphaBetaToolbar.css';

const AlphaBetaToolbar = ({ onChangeTopic }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleChangeTopic = () => {
    if (onChangeTopic) {
      onChangeTopic();
    }
  };

  return (
    <div className="alphabeta-toolbar">
      <div className="toolbar-title">
        <h2>Alpha-Beta Pruning Practice</h2>
      </div>
      
      <div className="toolbar-spacer"></div>
      
      <div className="user-section">
        <span className="username">{user?.username || 'Guest'}</span>
        <button
          className="toolbar-btn change-topic-btn"
          onClick={handleChangeTopic}
          title="Change Topic"
        >
          Change Topic
        </button>
        <button
          className="toolbar-btn logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AlphaBetaToolbar;
