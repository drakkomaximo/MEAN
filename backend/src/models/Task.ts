import mongoose, { Document, Schema } from 'mongoose';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/taskEnums';

// Interface for Task History
interface ITaskHistory {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

// Interface for Task
export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  tags: string[];
  history: ITaskHistory[];
  createdAt: Date;
  updatedAt: Date;
}

// Task Schema
const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters long'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: TASK_STATUS,
      message: '{VALUE} is not a valid status'
    },
    required: [true, 'Status is required'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: {
      values: TASK_PRIORITY,
      message: '{VALUE} is not a valid priority'
    },
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  history: [{
    field: String,
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ tags: 1 });

// Pre-save middleware to ensure unique tags
TaskSchema.pre('save', function(next) {
  if (this.tags) {
    this.tags = [...new Set(this.tags)];
  }
  next();
});

export const Task = mongoose.model<ITask>('Task', TaskSchema); 