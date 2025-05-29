export interface Task {
  id?: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  history?: any[];
}

export interface TaskHistory {
  id?: string;
  taskId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  timestamp: Date;
}
