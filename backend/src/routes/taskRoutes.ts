import express from 'express';
import { body, ValidationChain } from 'express-validator';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController';
import { validateRequest } from '../middleware/validationMiddleware';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/taskEnums';
import { seedDatabase } from '../services/seedService';

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
    .isIn(TASK_STATUS)
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITY)
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

/**
 * @openapi
 * /api/tasks/status/options:
 *   get:
 *     summary: Get allowed status options for tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: List of allowed status values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusOptions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Pending", "In Progress", "Completed"]
 */
router.get('/status/options', (req, res) => {
  res.json({ statusOptions: TASK_STATUS });
});

/**
 * @openapi
 * /api/tasks/priority/options:
 *   get:
 *     summary: Get allowed priority options for tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: List of allowed priority values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 priorityOptions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Low", "Medium", "High"]
 */
router.get('/priority/options', (req, res) => {
  res.json({ priorityOptions: TASK_PRIORITY });
});

// Routes
/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - Pending
 *             - In Progress
 *             - Completed
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum:
 *             - Low
 *             - Medium
 *             - High
 *         description: Filter by priority
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma separated)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (range)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (range)
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', getTasks);

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - In Progress
 *                   - Completed
 *               priority:
 *                 type: string
 *                 enum:
 *                   - Low
 *                   - Medium
 *                   - High
 *                 default: Medium
 *                 description: If not provided, defaults to 'Medium'.
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', [...taskValidation, validateRequest], createTask);

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get('/:id', getTaskById);

/**
 * @openapi
 * /api/tasks/{id}:
 *   patch:
 *     summary: Partially update a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - In Progress
 *                   - Completed
 *               priority:
 *                 type: string
 *                 enum:
 *                   - Low
 *                   - Medium
 *                   - High
 *                 default: Medium
 *                 description: If not provided, defaults to 'Medium'.
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */
router.patch('/:id', [...taskValidation, validateRequest], updateTask);

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete('/:id', deleteTask);

/**
 * @openapi
 * /api/tasks/{id}/history:
 *   get:
 *     summary: Get the change history of a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       oldValue:
 *                         type: string
 *                       newValue:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Task not found
 */
router.get('/:id/history', require('../controllers/taskController').getTaskHistory);

/**
 * @openapi
 * /api/tasks/seed:
 *   post:
 *     summary: Seed the database with sample tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *       400:
 *         description: Database is not empty
 *       500:
 *         description: Server error
 */
router.post('/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 