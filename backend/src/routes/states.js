import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route   GET /api/states
 * @desc    Get all saved states for current user
 * @access  Private
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const states = await prisma.userState.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        arraySize: true,
        selectedAlgorithm: true,
        speed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: { states },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/states/:id
 * @desc    Get a specific saved state
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const state = await prisma.userState.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }

    res.json({
      success: true,
      data: { state },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/states
 * @desc    Save a new state
 * @access  Private
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, arrayData, arraySize, selectedAlgorithm, speed } = req.body;

    // Validation
    if (!arrayData || !Array.isArray(arrayData)) {
      return res.status(400).json({
        success: false,
        message: 'arrayData is required and must be an array',
      });
    }

    if (arrayData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'arrayData cannot be empty',
      });
    }

    // Create state
    const state = await prisma.userState.create({
      data: {
        userId: req.user.id,
        name: name || 'Untitled Session',
        arrayData,
        arraySize: arraySize || arrayData.length,
        selectedAlgorithm: selectedAlgorithm || null,
        speed: speed || 100,
      },
    });

    res.status(201).json({
      success: true,
      message: 'State saved successfully',
      data: { state },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/states/:id
 * @desc    Update a saved state
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, arrayData, arraySize, selectedAlgorithm, speed } = req.body;

    // Check if state exists and belongs to user
    const existingState = await prisma.userState.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingState) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (arrayData !== undefined) {
      if (!Array.isArray(arrayData) || arrayData.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'arrayData must be a non-empty array',
        });
      }
      updateData.arrayData = arrayData;
    }
    if (arraySize !== undefined) updateData.arraySize = arraySize;
    if (selectedAlgorithm !== undefined) updateData.selectedAlgorithm = selectedAlgorithm;
    if (speed !== undefined) updateData.speed = speed;

    // Update state
    const state = await prisma.userState.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'State updated successfully',
      data: { state },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/states/:id
 * @desc    Delete a saved state
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if state exists and belongs to user
    const existingState = await prisma.userState.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingState) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }

    // Delete state
    await prisma.userState.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'State deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/states/latest
 * @desc    Get the most recently updated state
 * @access  Private
 */
router.get('/user/latest', authenticate, async (req, res, next) => {
  try {
    const state = await prisma.userState.findFirst({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
    });

    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'No saved states found',
      });
    }

    res.json({
      success: true,
      data: { state },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
