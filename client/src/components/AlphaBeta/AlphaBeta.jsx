import { useState, useEffect, useCallback } from 'react';
import { AlphaBetaTree } from '../../algorithms/alphaBeta';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import AlphaBetaToolbar from './AlphaBetaToolbar';
import './AlphaBeta.css';

const AlphaBeta = ({ onChangeTopic }) => {
  const { user } = useAuth();
  const [tree, setTree] = useState(null);
  const [depth, setDepth] = useState(4);
  const [branchingFactor, setBranchingFactor] = useState(3);
  const [treeType, setTreeType] = useState('max');
  const [selectedNode, setSelectedNode] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [scores, setScores] = useState([]);
  const [showScores, setShowScores] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);
  const [forceRerender, setForceRerender] = useState(0);

  const generateTree = useCallback(() => {
    const rootNode = AlphaBetaTree.generateTree(treeType, depth, branchingFactor);
    const newTree = new AlphaBetaTree(rootNode, treeType, depth, branchingFactor);
    
    // Calculate solution immediately to store it
    newTree.alphaBeta();
    console.log('Tree generated, solution calculated');
    
    setTree(newTree);
    setCheckResult(null);
    setCurrentScore(null);
  }, [treeType, depth, branchingFactor]);

  useEffect(() => {
    generateTree();
  }, [generateTree]);

  // Handle window resize to recalculate dimensions
  useEffect(() => {
    const handleResize = () => {
      setForceRerender(prev => prev + 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeClick = (node) => {
    if (node.nodeType === 'leaf' || !tree.mutable) return;
    setSelectedNode(node);
    setInputValue(node.value !== null ? node.value.toString() : '');
  };

  const handleValueSubmit = () => {
    if (!selectedNode || inputValue === '') return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    selectedNode.value = value;
    setSelectedNode(null);
    setInputValue('');
    setForceRerender(prev => prev + 1); // Force re-render without breaking tree object
  };

  const handlePruneToggle = (edge) => {
    if (!tree.mutable || !edge) return;
    edge.pruned = !edge.pruned;
    setForceRerender(prev => prev + 1); // Force re-render without breaking tree object
  };

  const checkAnswer = async () => {
    console.log('=== CHECKING ANSWER ===');
    
    // Calculate the correct solution to compare against
    const calculateCorrectSolution = (node, alpha, beta, isMaxNode) => {
      if (node.nodeType === 'leaf') {
        return { value: node.value, pruned: false };
      }

      let value;
      let childrenPruned = [];
      
      if (isMaxNode) {
        value = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < node.childNum; i++) {
          const child = node.getKthChild(i);
          const childResult = calculateCorrectSolution(child, alpha, beta, false);
          value = Math.max(value, childResult.value);
          alpha = Math.max(alpha, value);
          
          if (beta <= alpha) {
            // Mark remaining children as should be pruned
            for (let j = i + 1; j < node.childNum; j++) {
              childrenPruned[j] = true;
            }
            break;
          }
        }
      } else {
        value = Number.POSITIVE_INFINITY;
        for (let i = 0; i < node.childNum; i++) {
          const child = node.getKthChild(i);
          const childResult = calculateCorrectSolution(child, alpha, beta, true);
          value = Math.min(value, childResult.value);
          beta = Math.min(beta, value);
          
          if (beta <= alpha) {
            // Mark remaining children as should be pruned
            for (let j = i + 1; j < node.childNum; j++) {
              childrenPruned[j] = true;
            }
            break;
          }
        }
      }

      return { value, alpha, beta, childrenPruned };
    };

    // Check if user's answer matches the correct solution
    const checkNodeAnswer = (node, correctSolution, alpha, beta, isMaxNode) => {
      if (node.nodeType === 'leaf') {
        return true; // Leaf nodes are always correct
      }

      // Check if the node value is correct
      if (node.value === null || node.value === undefined) {
        console.log(`Node missing value - should be ${correctSolution.value}`);
        return false;
      }

      if (node.value !== correctSolution.value) {
        console.log(`Node value incorrect: got ${node.value}, expected ${correctSolution.value}`);
        return false;
      }

      // Check pruning for each child
      for (let i = 0; i < node.childNum; i++) {
        const child = node.getKthChild(i);
        const shouldBePruned = correctSolution.childrenPruned[i] || false;
        const isPruned = child.edgeToParent ? child.edgeToParent.pruned : false;

        if (shouldBePruned !== isPruned) {
          console.log(`Edge pruning incorrect for child ${i}: got ${isPruned}, expected ${shouldBePruned}`);
          return false;
        }

        // Recursively check children that aren't pruned
        if (!shouldBePruned) {
          const childCorrectSolution = calculateCorrectSolution(child, alpha, beta, !isMaxNode);
          if (!checkNodeAnswer(child, childCorrectSolution, alpha, beta, !isMaxNode)) {
            return false;
          }
        }
      }

      return true;
    };

    // Calculate the correct solution
    const correctSolution = calculateCorrectSolution(
      tree.rootNode,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      tree.treeType === 'max'
    );

    // Check user's answer
    const isCorrect = checkNodeAnswer(
      tree.rootNode,
      correctSolution,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      tree.treeType === 'max'
    );

    console.log(`Answer check result: ${isCorrect}`);
    setCheckResult(isCorrect);

    // Calculate score
    const totalNodes = countNodes(tree.rootNode) - countLeaves(tree.rootNode);
    const score = isCorrect ? 100 : 0;
    
    setCurrentScore({ isCorrect, score, totalNodes, timestamp: new Date().toISOString() });

    // Save to database
    try {
      // Safety check to ensure tree has getTreeData method
      if (!tree || typeof tree.getTreeData !== 'function') {
        console.error('Tree object is invalid or missing getTreeData method:', tree);
        throw new Error('Invalid tree object');
      }

      await api.saveAlphaBetaScore({
        depth,
        branchingFactor,
        treeType,
        score,
        isCorrect,
        treeData: tree.getTreeData()
      });
      loadScores();
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const countNodes = (node) => {
    if (!node) return 0;
    let count = 1;
    for (let i = 0; i < node.childNum; i++) {
      count += countNodes(node.getKthChild(i));
    }
    return count;
  };

  const countLeaves = (node) => {
    if (!node) return 0;
    if (node.nodeType === 'leaf') return 1;
    let count = 0;
    for (let i = 0; i < node.childNum; i++) {
      count += countLeaves(node.getKthChild(i));
    }
    return count;
  };

  const loadScores = async () => {
    try {
      console.log('Loading scores...');
      const response = await api.getAlphaBetaScores();
      console.log('Scores response:', response);
      
      if (response.success && response.data) {
        // Handle all possible response structures based on actual API response
        let scoresData;
        if (Array.isArray(response.data)) {
          // Direct array: {success: true, data: [...]}
          scoresData = response.data;
        } else if (response.data.scores && Array.isArray(response.data.scores)) {
          // Nested scores: {success: true, data: {scores: [...]}}
          scoresData = response.data.scores;
        } else {
          // Fallback
          scoresData = [];
        }
        
        console.log('Processed scores data:', scoresData);
        console.log('Number of scores:', scoresData.length);
        setScores(scoresData);
      } else {
        console.error('Invalid response structure:', response);
        setScores([]);
      }
    } catch (error) {
      console.error('Failed to load scores:', error);
      setScores([]);
    }
  };

  const resetTree = () => {
    if (!tree) return;
    
    console.log('FORCING TREE RESET...');
    
    // Clear any ongoing input state
    setSelectedNode(null);
    setInputValue('');
    
    // Manually traverse and reset every single node
    const forceResetNode = (node) => {
      if (!node) return;
      
      // Reset edge states
      if (node.edgeToParent) {
        node.edgeToParent.pruned = false;
        node.edgeToParent.entered = false;
      }
      
      // Reset node states
      node.entered = false;
      
      // For NON-LEAF nodes, clear ALL values
      if (node.nodeType !== 'leaf') {
        node.value = null;
        node.alpha = null;
        node.beta = null;
        console.log(`Reset non-leaf node of type: ${node.nodeType}`);
      } else {
        console.log(`Preserved leaf node with value: ${node.value}`);
      }
      
      // Recursively reset all children
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          forceResetNode(node.children[i]);
        }
      }
    };
    
    // Force reset starting from root
    forceResetNode(tree.rootNode);
    
    console.log('MANUAL RESET COMPLETE');
    
    // Force React to completely re-render by changing state multiple times
    setCheckResult(null);
    setCurrentScore(null);
    setForceRerender(prev => prev + 1);
    
    // Use setTimeout to force another state update
    setTimeout(() => {
      setTree(tree => ({ ...tree, mutable: true }));
      setForceRerender(prev => prev + 1);
    }, 10);
    
    console.log('RESET TREE COMPLETED - CHECK THE TREE NOW!');
  };

  const showSolution = () => {
    if (!tree) return;
    
    console.log('=== STARTING SHOW SOLUTION ===');
    
    // Manual solution calculation and application
    const calculateAndApplySolution = (node, alpha, beta, isMaxNode) => {
      console.log(`Processing node: ${node.nodeType}, depth: ${node.depth}`);
      
      if (node.nodeType === 'leaf') {
        console.log(`Leaf node value: ${node.value}`);
        return node.value;
      }

      let value;
      if (isMaxNode) {
        value = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < node.childNum; i++) {
          const child = node.getKthChild(i);
          const childValue = calculateAndApplySolution(child, alpha, beta, false);
          value = Math.max(value, childValue);
          alpha = Math.max(alpha, value);
          
          if (beta <= alpha) {
            // Mark remaining children as pruned
            for (let j = i + 1; j < node.childNum; j++) {
              const prunedChild = node.getKthChild(j);
              if (prunedChild.edgeToParent) {
                prunedChild.edgeToParent.pruned = true;
                console.log(`Pruned edge to child ${j}`);
              }
            }
            break;
          }
        }
      } else {
        value = Number.POSITIVE_INFINITY;
        for (let i = 0; i < node.childNum; i++) {
          const child = node.getKthChild(i);
          const childValue = calculateAndApplySolution(child, alpha, beta, true);
          value = Math.min(value, childValue);
          beta = Math.min(beta, value);
          
          if (beta <= alpha) {
            // Mark remaining children as pruned
            for (let j = i + 1; j < node.childNum; j++) {
              const prunedChild = node.getKthChild(j);
              if (prunedChild.edgeToParent) {
                prunedChild.edgeToParent.pruned = true;
                console.log(`Pruned edge to child ${j}`);
              }
            }
            break;
          }
        }
      }

      // Apply the calculated value to the node
      node.value = value;
      node.alpha = alpha;
      node.beta = beta;
      console.log(`Set node value to: ${value}`);
      
      return value;
    };

    // Start the calculation from root
    const rootValue = calculateAndApplySolution(
      tree.rootNode,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      tree.treeType === 'max'
    );
    
    console.log(`Root value calculated: ${rootValue}`);
    console.log('=== SOLUTION APPLIED ===');
    
    // Force multiple re-renders
    setCheckResult(null);
    setForceRerender(prev => prev + 1);
    
    setTimeout(() => {
      setForceRerender(prev => prev + 1);
    }, 10);
  };

  // Calculate optimal dimensions based on tree size
  const calculateTreeDimensions = () => {
    if (!tree) return { width: 1200, height: 600, nodeSize: 80, verticalGap: 150, horizontalSpacing: 1000 };

    const maxDepth = depth;
    const maxBranchingFactor = branchingFactor;
    
    // Use full viewport dimensions
    const availableWidth = window.innerWidth * 1.5; // Account for control panel
    const availableHeight = window.innerHeight * 1.4; // Account for toolbar
    
    // Calculate number of leaf nodes
    const leafCount = Math.pow(maxBranchingFactor, maxDepth - 1);
    
    // Dynamic node sizing based on available space
    const baseNodeSize = Math.min(
      (availableWidth / leafCount) * 0.6, // 60% of available width per leaf
      (availableHeight / maxDepth) * 0.4, // 40% of available height per level
      120 // Maximum node size
    );
    const nodeSize = Math.max(100, baseNodeSize); // Minimum node size
    
    // Dynamic spacing
    const horizontalSpacing = availableWidth * 0.95;
    const verticalGap = availableHeight / (maxDepth);
    
    return {
      width: availableWidth,
      height: availableHeight,
      nodeSize: nodeSize,
      verticalGap: verticalGap,
      horizontalSpacing: horizontalSpacing,
      centerX: availableWidth / 2,
      startY: verticalGap * 0.5
    };
  };  const renderNode = (node, x, y, width, dimensions) => {
    if (!node) return null;

    const { nodeSize, verticalGap } = dimensions;
    const elements = [];

    // Calculate positions for children
    if (node.childNum > 0) {
      const childWidth = width / node.childNum;
      for (let i = 0; i < node.childNum; i++) {
        const child = node.getKthChild(i);
        const childX = x - width / 2 + childWidth * (i + 0.5);
        const childY = y + verticalGap;

        // Draw edge
        const edge = child.edgeToParent;
        const edgeStrokeWidth = Math.max(2, dimensions.nodeSize / 25);
        const dashArray = edge.pruned ? `${edgeStrokeWidth * 2},${edgeStrokeWidth * 1.5}` : '0';
        
        elements.push(
          <line
            key={`edge-${node.id}-${i}`}
            x1={x}
            y1={y}
            x2={childX}
            y2={childY}
            stroke={edge.pruned ? '#dc2626' : '#475569'}
            strokeWidth={edgeStrokeWidth}
            strokeDasharray={dashArray}
            style={{ cursor: tree.mutable ? 'pointer' : 'default' }}
            onClick={() => tree.mutable && handlePruneToggle(edge)}
          />
        );

        // Recursively render child
        elements.push(...renderNode(child, childX, childY, childWidth, dimensions));
      }
    }

    // Draw node
    const halfSize = dimensions.nodeSize / 2;
    const strokeWidth = Math.max(2, dimensions.nodeSize / 20);
    const fontSize = Math.max(12, dimensions.nodeSize / 3.6); // Reduced font size by changing divisor from 3 to 5
    
    elements.push(
      <g key={`node-${node.id}`}>
        {node.nodeType === 'leaf' ? (
          // Rectangle for leaf nodes
          <>
            <rect
              x={x - halfSize * 0.8}
              y={y - halfSize * 0.6}
              width={halfSize * 1.6}
              height={halfSize * 1.2}
              fill="#ffffff"
              stroke="#000000"
              strokeWidth={strokeWidth}
              style={{ cursor: 'default' }}
            />
            <text
              x={x}
              y={y + fontSize * 0.3}
              textAnchor="middle"
              fontSize={fontSize}
              fontWeight="bold"
              fill="#000000"
            >
              {node.value !== null ? node.value : '?'}
            </text>
          </>
        ) : (
          // Triangle for MAX/MIN nodes
          <>
            {node.nodeType === 'max' ? (
              // Triangle pointing up for MAX
              <polygon
                points={`${x},${y - halfSize} ${x - halfSize},${y + halfSize * 0.8} ${x + halfSize},${y + halfSize * 0.8}`}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={strokeWidth}
                style={{ cursor: tree.mutable ? 'pointer' : 'default' }}
                onClick={() => handleNodeClick(node)}
              />
            ) : (
              // Triangle pointing down for MIN
              <polygon
                points={`${x - halfSize},${y - halfSize * 0.8} ${x + halfSize},${y - halfSize * 0.8} ${x},${y + halfSize}`}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={strokeWidth}
                style={{ cursor: tree.mutable ? 'pointer' : 'default' }}
                onClick={() => handleNodeClick(node)}
              />
            )}
            <text
              x={x}
              y={y + fontSize * 0.3}
              textAnchor="middle"
              fontSize={fontSize}
              fontWeight="bold"
              fill="#000000"
            >
              {node.value !== null ? node.value : '?'}
            </text>
          </>
        )}
      </g>
    );

    return elements;
  };

  // Assign IDs to nodes
  const assignNodeIds = (node, id = 0) => {
    if (!node) return id;
    node.id = id++;
    for (let i = 0; i < node.childNum; i++) {
      id = assignNodeIds(node.getKthChild(i), id);
    }
    return id;
  };

  if (tree) {
    assignNodeIds(tree.rootNode);
  }

  const dimensions = calculateTreeDimensions();

  return (
    <div className="alphabeta-container">
      <AlphaBetaToolbar onChangeTopic={onChangeTopic} />

      <div className="alphabeta-content">
        <div className="tree-visualization">
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {tree && renderNode(
              tree.rootNode, 
              dimensions.centerX, 
              dimensions.startY, 
              dimensions.horizontalSpacing,
              dimensions
            )}
          </svg>
        </div>

        <div className="control-panel">
          <div className="control-section">
            <h3>Tree Configuration</h3>
            <div className="control-row">
              <label>Depth: {depth}</label>
              <div className="button-group">
                <button onClick={() => setDepth(Math.max(3, depth - 1))}>-</button>
                <button onClick={() => setDepth(Math.min(5, depth + 1))}>+</button>
              </div>
            </div>
            <div className="control-row">
              <label>Branching Factor: {branchingFactor}</label>
              <div className="button-group">
                <button onClick={() => setBranchingFactor(Math.max(2, branchingFactor - 1))}>-</button>
                <button onClick={() => setBranchingFactor(Math.min(4, branchingFactor + 1))}>+</button>
              </div>
            </div>
            <div className="control-row">
              <label>Root Type:</label>
              <button onClick={() => setTreeType(treeType === 'max' ? 'min' : 'max')}>
                {treeType === 'max' ? 'MAX' : 'MIN'}
              </button>
            </div>
            <button className="action-button" onClick={generateTree}>
              Generate New Tree
            </button>
          </div>

          <div className="control-section">
            <h3>Actions</h3>
            <button className="action-button" onClick={resetTree}>
              Reset Tree
            </button>
            <button className="action-button" onClick={showSolution}>
              Show Solution
            </button>
            <button className="action-button primary" onClick={checkAnswer}>
              Check Answer
            </button>
            <button className="action-button" onClick={() => { setShowScores(true); loadScores(); }}>
              View Score History
            </button>
          </div>

          {checkResult !== null && (
            <div className={`result-box ${checkResult ? 'correct' : 'incorrect'}`}>
              <h3>{checkResult ? '✓ Correct!' : '✗ Incorrect'}</h3>
              {currentScore && (
                <p>Score: {currentScore.score}/100</p>
              )}
            </div>
          )}

          {selectedNode && (
            <div className="input-box">
              <h3>Enter Value for Node</h3>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleValueSubmit()}
                autoFocus
              />
              <div className="button-group">
                <button onClick={handleValueSubmit}>Submit</button>
                <button onClick={() => setSelectedNode(null)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="instructions">
            <h4>Instructions:</h4>
            <ul>
              <li>Click on non-leaf nodes to set their values</li>
              <li>Click on edges to toggle pruning</li>
              <li>MAX nodes choose highest value (blue)</li>
              <li>MIN nodes choose lowest value (pink)</li>
              <li>Prune when β ≤ α</li>
            </ul>
          </div>
        </div>
      </div>

      {showScores && (
        <div className="modal-overlay" onClick={() => setShowScores(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Score History</h3>
              <button onClick={() => setShowScores(false)}>×</button>
            </div>
            <div className="scores-list">
              {scores.length === 0 ? (
                <p>No scores yet. Start practicing!</p>
              ) : (
                scores.map((score, index) => (
                  <div key={index} className="score-item">
                    <div className="score-main">
                      <span className={`score-badge ${score.isCorrect ? 'correct' : 'incorrect'}`}>
                        {score.score}/100
                      </span>
                      <div className="score-details">
                        <p>Depth: {score.depth} | Branching: {score.branchingFactor} | Type: {score.treeType.toUpperCase()}</p>
                        <p className="score-date">{new Date(score.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlphaBeta;
