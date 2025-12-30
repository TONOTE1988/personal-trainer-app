import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const prisma = (req as any).prisma;
    const userId = (req as any).user.id;
    const { type, limit = 20, offset = 0 } = req.query;

    const where: any = { userId };
    if (type === 'generated' || type === 'template') {
      where.type = type;
    }

    const workouts = await prisma.workout.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string, 10),
      skip: parseInt(offset as string, 10),
      select: {
        id: true,
        type: true,
        templateId: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await prisma.workout.count({ where });

    res.json({ workouts, total, limit: parseInt(limit as string, 10), offset: parseInt(offset as string, 10) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const prisma = (req as any).prisma;
    const userId = (req as any).user.id;
    const { id } = req.params;

    const workout = await prisma.workout.findFirst({
      where: { id, userId },
    });

    if (!workout) {
      throw new AppError(404, 'Workout not found', 'NOT_FOUND');
    }

    res.json({
      ...workout,
      content: JSON.parse(workout.content),
      params: workout.params ? JSON.parse(workout.params) : null,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const prisma = (req as any).prisma;
    const userId = (req as any).user.id;
    const { id } = req.params;

    const workout = await prisma.workout.findFirst({
      where: { id, userId },
    });

    if (!workout) {
      throw new AppError(404, 'Workout not found', 'NOT_FOUND');
    }

    await prisma.workout.delete({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/save-template', authMiddleware, async (req, res, next) => {
  try {
    const prisma = (req as any).prisma;
    const userId = (req as any).user.id;
    const { templateId, title, content } = req.body;

    const workout = await prisma.workout.create({
      data: {
        userId,
        type: 'template',
        templateId,
        title,
        content: JSON.stringify(content),
      },
    });

    res.status(201).json({ success: true, workout });
  } catch (error) {
    next(error);
  }
});

export default router;

