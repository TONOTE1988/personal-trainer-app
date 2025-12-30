import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';
import generateRoutes from './routes/generate';
import workoutRoutes from './routes/workouts';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  (req as any).prisma = prisma;
  next();
});

app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/generate', generateRoutes);
app.use('/workouts', workoutRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/me', async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const balance = await prisma.ticketLedger.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      ticketBalance: balance._sum.amount || 0,
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { prisma };

