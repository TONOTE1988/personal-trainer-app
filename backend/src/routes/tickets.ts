import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/balance', authMiddleware, async (req, res, next) => {
  try {
    const prisma = (req as any).prisma;
    const userId = (req as any).user.id;

    const balance = await prisma.ticketLedger.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const recentTransactions = await prisma.ticketLedger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({
      balance: balance._sum.amount || 0,
      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/purchase', authMiddleware, async (req, res, next) => {
  try {
    const prisma = (req as any).prisma;
    const userId = (req as any).user.id;
    const { productId, quantity = 10 } = req.body;

    const ticketAmounts: Record<string, number> = {
      tickets_10: 10,
      tickets_30: 30,
      tickets_100: 100,
    };

    const amount = ticketAmounts[productId] || quantity;

    await prisma.ticketLedger.create({
      data: {
        userId,
        type: 'purchase',
        amount,
        description: `Purchased ${amount} tickets (STUB)`,
      },
    });

    const newBalance = await prisma.ticketLedger.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    res.json({
      success: true,
      ticketsAdded: amount,
      newBalance: newBalance._sum.amount || 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

