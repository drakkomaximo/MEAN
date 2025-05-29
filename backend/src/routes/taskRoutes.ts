import express, { Request, Response, NextFunction } from 'express';
import { body, ValidationChain } from 'express-validator';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController';
import { validateRequest } from '../middleware/validationMiddleware';

const router = express.Router();

// Validation middleware
const taskValidation: ValidationChain[] = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// Routes
router.post('/', [...taskValidation, validateRequest], createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', [...taskValidation, validateRequest], updateTask);
router.patch('/:id', [...taskValidation, validateRequest], updateTask);
router.delete('/:id', deleteTask);

export default router; 