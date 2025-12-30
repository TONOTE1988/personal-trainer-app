import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/anonymous', async (req, res, next) => {
  try {
    const prisma = (req as any).prisma;
    const anonymousId = uuidv4();

    const user = await prisma.user.create({
      data: { anonymousId },
    });

    await prisma.ticketLedger.create({
      data: {
        userId: user.id,
        type: 'grant',
        amount: 3,
        description: 'Welcome bonus',
      },
    });

    res.status(201).json({
      id: user.id,
      anonymousId: user.anonymousId,
      ticketBalance: 3,
      message: 'Anonymous user created with 3 welcome tickets',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

