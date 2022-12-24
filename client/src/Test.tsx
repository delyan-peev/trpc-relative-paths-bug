import { trpc } from './trpc';

export const Test = () => {
  const { data } = trpc.entities.all.useQuery();

  return (
    <>
    </>
  );
};
