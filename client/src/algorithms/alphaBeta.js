/**
 * Alpha-Beta Pruning Algorithm Implementation
 * Based on the minimax algorithm with alpha-beta pruning optimization
 */

export class TreeNode {
  constructor(nodeType, parentNode, depth, childNum) {
    this.nodeType = nodeType; // 'max', 'min', or 'leaf'
    this.parentNode = parentNode;
    this.edgeToParent = parentNode ? { source: parentNode, target: this, pruned: false, entered: false } : null;
    this.depth = depth;
    this.childNum = childNum;
    this.children = new Array(childNum).fill(null);
    this.value = null;
    this.alpha = null;
    this.beta = null;
    this.entered = false;
    this.id = null;
    
    // Hidden values for solution checking
    this.__value = null;
    this.__alpha = null;
    this.__beta = null;
    this.__pruned = false;
  }

  setKthChild(k, child) {
    if (k >= this.childNum) {
      throw new Error(`Error: node only holds ${this.childNum} children.`);
    }
    this.children[k] = child;
  }

  getKthChild(k) {
    if (k >= this.childNum) {
      throw new Error(`Error: node only holds ${this.childNum} children.`);
    }
    return this.children[k];
  }
}

export class AlphaBetaTree {
  constructor(rootNode, treeType, depth, branchingFactor) {
    this.rootNode = rootNode;
    this.treeType = treeType; // 'max' or 'min'
    this.depth = depth;
    this.branchingFactor = branchingFactor;
    this.mutable = true;
  }

  static generateTree(treeType, maxDepth, branchingFactor, minVal = -20, maxVal = 20) {
    const generateSubTree = (parentNode, nodeType, depth, bFac) => {
      const curNode = new TreeNode(nodeType, parentNode, depth, bFac);
      
      if (depth === maxDepth) {
        curNode.nodeType = 'leaf';
        curNode.value = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        curNode.childNum = 0;
        curNode.children = [];
      } else {
        const nextType = nodeType === 'max' ? 'min' : 'max';
        for (let k = 0; k < bFac; k++) {
          curNode.setKthChild(k, generateSubTree(curNode, nextType, depth + 1, bFac));
        }
      }
      
      return curNode;
    };

    return generateSubTree(null, treeType, 1, branchingFactor);
  }

  alphaBeta() {
    const abRecursive = (node, alpha, beta, isMaxNode) => {
      if (node.nodeType === 'leaf') {
        node.__value = node.value;
        return node.value;
      }

      node.__alpha = alpha;
      node.__beta = beta;

      let value;
      if (isMaxNode) {
        value = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < node.childNum; i++) {
          const child = node.getKthChild(i);
          const childValue = abRecursive(child, alpha, beta, false);
          value = Math.max(value, childValue);
          alpha = Math.max(alpha, value);
          
          if (beta <= alpha) {
            // Prune remaining children
            for (let j = i + 1; j < node.childNum; j++) {
              const prunedChild = node.getKthChild(j);
              this.markSubtreePruned(prunedChild);
            }
            break;
          }
        }
      } else {
        value = Number.POSITIVE_INFINITY;
        for (let i = 0; i < node.childNum; i++) {
          const child = node.getKthChild(i);
          const childValue = abRecursive(child, alpha, beta, true);
          value = Math.min(value, childValue);
          beta = Math.min(beta, value);
          
          if (beta <= alpha) {
            // Prune remaining children
            for (let j = i + 1; j < node.childNum; j++) {
              const prunedChild = node.getKthChild(j);
              this.markSubtreePruned(prunedChild);
            }
            break;
          }
        }
      }

      node.__value = value;
      return value;
    };

    const result = abRecursive(
      this.rootNode,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      this.treeType === 'max'
    );

    return result;
  }

  markSubtreePruned(node) {
    if (!node) return;
    
    if (node.edgeToParent) {
      node.edgeToParent.__pruned = true;
    }
    
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        this.markSubtreePruned(node.children[i]);
      }
    }
  }

  checkAnswer() {
    const checkSubTree = (node) => {
      if (node.nodeType === 'leaf') {
        return true;
      }

      // Check if value matches
      if (node.value !== node.__value) {
        return false;
      }

      // Check if pruning is correct
      if (node.edgeToParent && 
          node.edgeToParent.__pruned !== undefined &&
          node.edgeToParent.__pruned !== node.edgeToParent.pruned) {
        return false;
      }

      // Check all children
      let result = true;
      for (let k = 0; k < node.childNum; k++) {
        result = result && checkSubTree(node.getKthChild(k));
      }
      
      return result;
    };

    return checkSubTree(this.rootNode);
  }

  reset() {
    const resetSubTree = (node) => {
      if (node.edgeToParent) {
        node.edgeToParent.entered = false;
        node.edgeToParent.pruned = false;
      }
      
      node.entered = false;
      
      // Reset non-leaf node values to null (user inputted values)
      if (node.nodeType !== 'leaf') {
        node.value = null;
        node.alpha = null;
        node.beta = null;
        
        // Recursively reset all children
        for (let k = 0; k < node.childNum; k++) {
          resetSubTree(node.getKthChild(k));
        }
      }
      // Note: Leaf nodes keep their original random values
    };

    resetSubTree(this.rootNode);
  }

  setSolution() {
    this.alphaBeta();
    
    const setSolutionForSubTree = (node) => {
      if (node.edgeToParent) {
        node.edgeToParent.pruned = node.edgeToParent.__pruned || false;
      }
      
      if (node.nodeType === 'leaf') {
        return;
      }
      
      node.value = node.__value;
      node.alpha = node.__alpha;
      node.beta = node.__beta;
      
      for (let k = 0; k < node.childNum; k++) {
        setSolutionForSubTree(node.getKthChild(k));
      }
    };

    setSolutionForSubTree(this.rootNode);
  }

  getTreeData() {
    const serializeNode = (node) => {
      if (!node) return null;

      // Convert Infinity values to strings for JSON serialization
      const serializeValue = (val) => {
        if (val === Infinity) return 'Infinity';
        if (val === -Infinity) return '-Infinity';
        return val;
      };

      return {
        nodeType: node.nodeType,
        depth: node.depth,
        childNum: node.childNum,
        value: serializeValue(node.value),
        alpha: serializeValue(node.alpha),
        beta: serializeValue(node.beta),
        pruned: node.edgeToParent?.pruned || false,
        children: node.children.map(child => serializeNode(child))
      };
    };

    return {
      treeType: this.treeType,
      depth: this.depth,
      branchingFactor: this.branchingFactor,
      rootNode: serializeNode(this.rootNode)
    };
  }
}

export default AlphaBetaTree;
