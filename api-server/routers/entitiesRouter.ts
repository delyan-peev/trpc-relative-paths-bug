import { prisma } from 'prisma';
import { publicProcedure, router } from '../trpc';

export const entitiesRouter = router({
  all: publicProcedure.query(() => prisma.entity.findMany())
});
