import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../api-server/server';

export const trpc = createTRPCReact<AppRouter>();
