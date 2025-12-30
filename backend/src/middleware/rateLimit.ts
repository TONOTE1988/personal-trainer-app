import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

const DAILY_GEN_LIMIT = parseInt(process.env.DAILY_GEN_LIMIT || '3', 10);
const COOLDOWN_SECONDS = parseInt(process.env.COOLDOWN_SECONDS || '60', 10);

export const generationRateLimit = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const prisma = (req as any).prisma;
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    let rateLimit = await prisma.rateLimit.findUnique({
      where: { userId },
    });

    if (!rateLimit) {
      rateLimit = await prisma.rateLimit.create({
        data: { userId },
      });
    }

    if (rateLimit.lastResetAt < startOfDay) {
      rateLimit = await prisma.rateLimit.update({
        where: { userId },
        data: {
          dailyGenCount: 0,
          lastResetAt: now,
        },
      });
    }

    if (rateLimit.dailyGenCount >= DAILY_GEN_LIMIT) {
      throw new AppError(
        429,
        `Daily generation limit reached (${DAILY_GEN_LIMIT}/day)`,
        'DAILY_LIMIT_REACHED'
      );
    }

    if (rateLimit.lastGenAt) {
      const secondsSinceLastGen =
        (now.getTime() - rateLimit.lastGenAt.getTime()) / 1000;
      if (secondsSinceLastGen < COOLDOWN_SECONDS) {
        const remainingSeconds = Math.ceil(
          COOLDOWN_SECONDS - secondsSinceLastGen
        );
        throw new AppError(
          429,
          `Please wait ${remainingSeconds} seconds before generating again`,
          'COOLDOWN_ACTIVE'
        );
      }
    }

    (req as any).rateLimit = rateLimit;
    next();
  } catch (error) {
    next(error);
  }
};

