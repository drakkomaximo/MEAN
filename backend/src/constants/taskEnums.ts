export const TASK_STATUS = ['Pending', 'In Progress', 'Completed'] as const;
export type TaskStatus = typeof TASK_STATUS[number];

export const TASK_PRIORITY = ['Low', 'Medium', 'High'] as const;
export type TaskPriority = typeof TASK_PRIORITY[number]; 