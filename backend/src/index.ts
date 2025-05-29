import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes';
import { config } from './config/config';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task Manager API' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
}); 