import { Task } from '../models/Task';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/taskEnums';

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateMockTasks = () => {
  const tasks = [];
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // Tasks due within next 30 days

  const titles = [
    'Implement user authentication',
    'Design database schema',
    'Create API endpoints',
    'Write unit tests',
    'Fix UI bugs',
    'Optimize performance',
    'Add error handling',
    'Update documentation',
    'Implement search feature',
    'Add data validation',
    'Create admin dashboard',
    'Implement file upload',
    'Add email notifications',
    'Create user profile page',
    'Implement real-time updates',
    'Add payment integration',
    'Create reporting system',
    'Implement caching',
    'Add analytics tracking',
    'Create backup system',
    'Implement security features',
    'Add multi-language support',
    'Create mobile responsive design',
    'Implement data export',
    'Add user roles and permissions'
  ];

  const tags = [
    'Frontend', 'Backend', 'API', 'Database', 'Testing',
    'Security', 'Performance', 'UI/UX', 'DevOps', 'Documentation'
  ];

  for (let i = 0; i < 25; i++) {
    const task = {
      title: titles[i],
      description: `Description for ${titles[i]}`,
      status: TASK_STATUS[Math.floor(Math.random() * TASK_STATUS.length)],
      priority: TASK_PRIORITY[Math.floor(Math.random() * TASK_PRIORITY.length)],
      dueDate: generateRandomDate(startDate, endDate),
      tags: Array.from(
        { length: Math.floor(Math.random() * 4) + 1 },
        () => tags[Math.floor(Math.random() * tags.length)]
      ).filter((value, index, self) => self.indexOf(value) === index)
    };
    tasks.push(task);
  }

  return tasks;
};

export const seedDatabase = async () => {
  try {
    // Check if database is empty
    const count = await Task.countDocuments();
    if (count > 0) {
      throw new Error('Database is not empty. Seeding is only allowed on an empty database.');
    }

    // Generate and insert mock tasks
    const mockTasks = generateMockTasks();
    await Task.insertMany(mockTasks);

    return { message: 'Database seeded successfully with 25 tasks' };
  } catch (error: any) {
    throw new Error(`Failed to seed database: ${error.message}`);
  }
}; 