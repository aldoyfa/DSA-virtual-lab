import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Save Alpha Beta score
router.post('/scores', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { depth, branchingFactor, treeType, score, isCorrect, treeData } = req.body;

    if (!depth || !branchingFactor || !treeType || score === undefined || isCorrect === undefined || !treeData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const alphaBetaScore = await prisma.alphaBetaScore.create({
      data: {
        userId,
        depth: parseInt(depth),
        branchingFactor: parseInt(branchingFactor),
        treeType,
        score: parseInt(score),
        isCorrect,
        treeData
      }
    });

    res.json({
      success: true,
      data: alphaBetaScore,
      message: 'Score saved successfully'
    });
  } catch (error) {
    console.error('Error saving alpha beta score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save score'
    });
  }
});

// Get all Alpha Beta scores for the user
router.get('/scores', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const scores = await prisma.alphaBetaScore.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        depth: true,
        branchingFactor: true,
        treeType: true,
        score: true,
        isCorrect: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: { scores }
    });
  } catch (error) {
    console.error('Error fetching alpha beta scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scores'
    });
  }
});

// Get a specific score with full tree data
router.get('/scores/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const score = await prisma.alphaBetaScore.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    res.json({
      success: true,
      data: score
    });
  } catch (error) {
    console.error('Error fetching alpha beta score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch score'
    });
  }
});

// Get user statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalAttempts = await prisma.alphaBetaScore.count({
      where: { userId }
    });

    const correctAttempts = await prisma.alphaBetaScore.count({
      where: {
        userId,
        isCorrect: true
      }
    });

    const averageScore = await prisma.alphaBetaScore.aggregate({
      where: { userId },
      _avg: {
        score: true
      }
    });

    res.json({
      success: true,
      data: {
        totalAttempts,
        correctAttempts,
        incorrectAttempts: totalAttempts - correctAttempts,
        accuracy: totalAttempts > 0 ? (correctAttempts / totalAttempts * 100).toFixed(2) : 0,
        averageScore: averageScore._avg.score?.toFixed(2) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching alpha beta stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

export default router;
