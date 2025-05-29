import { Request, Response } from 'express';
import { Task, ITask } from '../models/Task';

interface ITaskHistory {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tasks with filters
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority, tags, startDate, endDate } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tags) {
      const tagArray = (tags as string).split(',');
      query.tags = { $in: tagArray };
    }
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate as string);
      if (endDate) query.dueDate.$lte = new Date(endDate as string);
    }

    const tasks = await Task.find(query).sort({ dueDate: 1 });
    // Mapea cada tarea para agregar el campo id
    const tasksWithId = tasks.map(task => ({
      ...task.toObject(),
      id: task._id
    }));
    res.json(tasksWithId);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get task history by ID
export const getTaskHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ history: task.history });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Prevent direct status change from Pending to Completed
    if (task.status === 'Pending' && req.body.status === 'Completed') {
      res.status(400).json({ 
        message: 'Cannot change status directly from Pending to Completed' 
      });
      return;
    }

    // Track changes in history
    const changes: ITaskHistory[] = [];
    (Object.keys(req.body) as (keyof ITask)[]).forEach(key => {
      const oldValue = (task as any).get ? (task as any).get(key) : task[key];
      const newValue = req.body[key];
      if (oldValue !== newValue) {
        changes.push({
          field: key as string,
          oldValue,
          newValue,
          timestamp: new Date()
        });
      }
    });

    // Update task
    Object.assign(task, req.body);
    if (changes.length > 0) {
      task.history.push(...changes);
    }

    await task.save();
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 