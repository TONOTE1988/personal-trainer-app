import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { generationRateLimit } from '../middleware/rateLimit';
import { createLLMService } from '../services/llm/interface';
import { validateGenerateParams, validateWorkoutSafety } from '../validators/safetyGuard';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.post('/', authMiddleware, generationRateLimit, async (req, res, next) => {
  const prisma = (req as any).prisma;
  const userId = (req as any).user.id;
  let consumedTicket = false;
  let ledgerEntryId: string | null = null;

  try {
    const validation = validateGenerateParams(req.body);
    if (!validation.valid || !validation.data) {
      throw new AppError(400, validation.errors.join(', '), 'INVALID_PARAMS');
    }

    const params = validation.data;

    const balance = await prisma.ticketLedger.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    if ((balance._sum.amount || 0) < 1) {
      throw new AppError(402, 'Insufficient tickets', 'INSUFFICIENT_TICKETS');
    }

    const ledgerEntry = await prisma.ticketLedger.create({
      data: {
        userId,
        type: 'consume',
        amount: -1,
        description: 'AI workout generation',
      },
    });
    ledgerEntryId = ledgerEntry.id;
    consumedTicket = true;

    const llmService = await createLLMService();
    let menu = await llmService.generateWorkout(params);

    const safetyCheck = validateWorkoutSafety(menu, params);
    if (!safetyCheck.isValid && safetyCheck.sanitizedMenu) {
      menu = safetyCheck.sanitizedMenu;
    }

    const workout = await prisma.workout.create({
      data: {
        userId,
        type: 'generated',
        title: menu.title,
        content: JSON.stringify(menu),
        params: JSON.stringify(params),
        lastGeneratedAt: new Date(),
      },
    });

    await prisma.rateLimit.update({
      where: { userId },
      data: {
        dailyGenCount: { increment: 1 },
        lastGenAt: new Date(),
      },
    });

    const newBalance = await prisma.ticketLedger.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    res.json({
      success: true,
      workout: { id: workout.id, ...menu },
      ticketConsumed: 1,
      remainingTickets: newBalance._sum.amount || 0,
      safetyNotes: safetyCheck.violations || [],
    });
  } catch (error) {
    if (consumedTicket && ledgerEntryId) {
      try {
        await prisma.ticketLedger.create({
          data: {
            userId,
            type: 'refund',
            amount: 1,
            description: 'Refund due to generation failure',
            referenceId: ledgerEntryId,
          },
        });
      } catch (refundError) {
        console.error('Failed to refund ticket:', refundError);
      }
    }
    next(error);
  }
});

export default router;

