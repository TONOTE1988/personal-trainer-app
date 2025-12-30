import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      throw new AppError(401, 'Unauthorized: Missing user ID', 'UNAUTHORIZED');
    }

    const prisma = (req as any).prisma;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(401, 'Unauthorized: User not found', 'USER_NOT_FOUND');
    }

    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};

