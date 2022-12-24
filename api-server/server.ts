import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { entitiesRouter } from './routers/entitiesRouter';
import { createContext, router } from './trpc';

const appRouter = router({
  entities: entitiesRouter,
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);

const port = 9000;

app.get('/', (req, res) => {
  res.send('Hello from api-server');
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
