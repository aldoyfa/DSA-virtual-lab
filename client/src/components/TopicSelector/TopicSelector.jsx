import React from 'react';
import './TopicSelector.css';

const TopicSelector = ({ onSelectTopic }) => {
  const handleTopicSelect = (topic) => {
    onSelectTopic(topic);
  };

  return (
    <div className="topic-selector-overlay">
      <div className="topic-card">
        <div className="topic-content">
          <h1>Mau belajar apa hari ini?</h1>
          <p className="lead">
            Pilih topik yang ingin kamu pelajari. Pilihan akan disimpan dan digunakan untuk menyesuaikan pengalaman.
          </p>

          <div className="tiles">
            <button
              className="tile blue"
              onClick={() => handleTopicSelect('sorting')}
              aria-label="Sorting Visualizer"
            >
              <div className="bar" aria-hidden="true"></div>
              <div className="title">Sorting Visualizer</div>
              <div className="subtitle">Visualisasi algoritma sorting — cocok untuk pemula</div>
            </button>

            <button
              className="tile coral"
              onClick={() => handleTopicSelect('alphabeta')}
              aria-label="Alpha Beta Pruning"
            >
              <div className="bar" aria-hidden="true"></div>
              <div className="title">Alpha Beta Pruning</div>
              <div className="subtitle">Praktik game tree — untuk yang mau tantangan</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelector;
