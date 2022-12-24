import { useCallback } from 'react';
import { trpc } from './trpc';

type ArrayType<T> = T extends (infer U)[] ? U : never;
type UseContextReturnType = ReturnType<typeof trpc.useContext>;
type UseContextReturnTypeKey = keyof UseContextReturnType;

// All procedure data types
type GetAllData<K extends UseContextReturnTypeKey> =
  UseContextReturnType[K] extends {
    all: {
      getData: (...args: infer Args) => infer GetDataType
    }
  } ?
  (...args: Args) => GetDataType :
  never;

type SetAllData<K extends UseContextReturnTypeKey> =
  UseContextReturnType[K] extends {
    all: {
      setData: (...args: infer Args) => infer SetDataType
    }
  } ?
  (...args: Args) => SetDataType :
  never;

// One procedure data types
type GetOneData<K extends UseContextReturnTypeKey> =
  UseContextReturnType[K] extends {
    one: {
      getData: (...args: infer Args) => infer GetDataType
    }
  } ?
  (...args: Args) => GetDataType :
  never;

type SetOneData<K extends UseContextReturnTypeKey> =
  UseContextReturnType[K] extends {
    one: {
      setData: (...args: infer Args) => infer SetDataType
    }
  } ?
  (...args: Args) => SetDataType :
  never;

type Base<K extends UseContextReturnTypeKey> =
  UseContextReturnType[K] extends {
    all: {
      getData: GetAllData<K>,
      setData: SetAllData<K>
    },
    one?: {
      getData: GetOneData<K>,
      setData: SetOneData<K>
    }
  } ?
  UseContextReturnType[K] :
  never;

type TData<K extends UseContextReturnTypeKey> = ArrayType<ReturnType<GetAllData<K>>> & { id: number };

export const useQueryModifiers = <K extends UseContextReturnTypeKey>(base: Base<K>) => {
  const addToBase = useCallback((item: TData<K>) => {
    const data = base.all.getData();

    if (data) {
      base.all.setData(undefined, (curr: TData<K>[]) => [...curr, item]);
    }
  }, [base]);

  const removeFromBase = useCallback((item: TData<K>) => {
    const data = base.all.getData();

    if (data) {
      base.all.setData(undefined, (curr: TData<K>[]) => curr.filter(i => i.id !== item.id));
    }
  }, [base]);

  const upsertInBase = useCallback((item: TData<K>) => {
    const data = base.all.getData();

    if (data) {
      base.all.setData(undefined, (curr: TData<K>[]) => {
        const index = curr.findIndex(i => i.id === item.id);

        if (index === -1) {
          return [...curr, item];
        }

        return [...curr.slice(0, index), item, ...curr.slice(index + 1)];
      });
    }
  }, [base]);

  const setOne = useCallback((item: TData<K>) => {
    base.one?.setData(undefined, item);
  }, [base]);

  return {
    addToBase,
    upsertInBase,
    removeFromBase,
    setOne
  };
};

export const useMerchantQueryModifiers = () => {
  const { merchants } = trpc.useContext();
  return useQueryModifiers<'merchants'>(merchants);
};

export const usePopupQueryModifiers = () => {
  const { popups } = trpc.useContext();
  return useQueryModifiers<'popups'>(popups);
};
